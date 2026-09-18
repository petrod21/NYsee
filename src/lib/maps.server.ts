import type { LatLng, Leg, LegStep, TransitStep, WalkStep } from "./itinerary";
import { haversineMeters } from "./itinerary";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";
const NYC_CENTER = { latitude: 40.7549, longitude: -73.984 };

function headers(extra: Record<string, string> = {}) {
  const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
  const GOOGLE_MAPS_API_KEY = process.env["GOOGLE_MAPS_API_KEY"];
  if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps is not connected to this project.");
  }
  return {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function handleError(response: Response): Promise<never> {
  if (response.status === 403) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: { details?: Array<{ reason?: string }> };
    };
    const reason = body?.error?.details?.find((d) => d.reason)?.reason;
    if (reason === "API_KEY_HTTP_REFERRER_BLOCKED") {
      throw new Error(
        'Google Maps server key is referrer-restricted. In Google Cloud Console, set the server key\'s application restrictions to "None" or "IP addresses".',
      );
    }
    if (reason === "API_KEY_SERVICE_BLOCKED") {
      throw new Error(
        "Google Maps server key does not allow this API. In Google Cloud Console, add this Maps API to the server key's allowed-APIs list.",
      );
    }
    throw new Error("Google Maps request was denied (403). Check the server key's restrictions.");
  }
  const text = await response.text();
  console.error(`Google Maps request failed [${response.status}]: ${text}`);
  throw new Error(`Google Maps request failed [${response.status}]: ${text}`);
}

export interface PlaceSuggestion {
  placeId: string;
  main: string;
  secondary: string;
}

export async function autocompletePlaces(
  input: string,
  sessionToken: string,
): Promise<PlaceSuggestion[]> {
  const response = await fetch(`${GATEWAY_URL}/places/v1/places:autocomplete`, {
    method: "POST",
    headers: headers({
      "X-Goog-FieldMask":
        "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text",
    }),
    body: JSON.stringify({
      input,
      sessionToken,
      includedRegionCodes: ["us"],
      locationRestriction: { circle: { center: NYC_CENTER, radius: 25000 } },
    }),
  });
  if (!response.ok) await handleError(response);
  const json = (await response.json()) as {
    suggestions?: Array<{
      placePrediction?: {
        placeId: string;
        structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
      };
    }>;
  };
  return (json.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 6)
    .map((p) => ({
      placeId: p.placeId,
      main: p.structuredFormat?.mainText?.text ?? "",
      secondary: p.structuredFormat?.secondaryText?.text ?? "",
    }));
}

export async function getPlace(placeId: string, sessionToken?: string) {
  const qs = sessionToken ? `?sessionToken=${encodeURIComponent(sessionToken)}` : "";
  const response = await fetch(
    `${GATEWAY_URL}/places/v1/places/${encodeURIComponent(placeId)}${qs}`,
    {
      headers: headers({ "X-Goog-FieldMask": "id,displayName,formattedAddress,location" }),
    },
  );
  if (!response.ok) await handleError(response);
  const json = (await response.json()) as {
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude: number; longitude: number };
  };
  if (!json.location) throw new Error("Place has no location");
  return {
    name: json.displayName?.text ?? "Hotel",
    address: json.formattedAddress ?? "",
    lat: json.location.latitude,
    lng: json.location.longitude,
  };
}

interface RawStep {
  travelMode?: string;
  staticDuration?: string;
  distanceMeters?: number;
  navigationInstruction?: { instructions?: string };
  transitDetails?: {
    headsign?: string;
    stopCount?: number;
    stopDetails?: { arrivalStop?: { name?: string }; departureStop?: { name?: string } };
    transitLine?: {
      name?: string;
      nameShort?: string;
      color?: string;
      textColor?: string;
      vehicle?: { type?: string };
    };
  };
}

const seconds = (s?: string) => (s ? parseInt(s, 10) || 0 : 0);
const toMin = (sec: number) => Math.max(1, Math.round(sec / 60));

async function computeRoute(origin: LatLng, destination: LatLng, mode: "WALK" | "TRANSIT") {
  const body: Record<string, unknown> = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
    travelMode: mode,
    computeAlternativeRoutes: false,
    languageCode: "en-US",
    units: "IMPERIAL",
  };
  if (mode === "TRANSIT") {
    body.transitPreferences = {
      allowedTravelModes: ["SUBWAY", "TRAIN", "LIGHT_RAIL"],
      routingPreference: "LESS_WALKING",
    };
  }
  const response = await fetch(`${GATEWAY_URL}/routes/directions/v2:computeRoutes`, {
    method: "POST",
    headers: headers({
      "X-Goog-FieldMask":
        "routes.duration,routes.distanceMeters,routes.legs.steps.travelMode,routes.legs.steps.staticDuration,routes.legs.steps.distanceMeters,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails",
    }),
    body: JSON.stringify(body),
  });
  if (!response.ok) await handleError(response);
  const json = (await response.json()) as {
    routes?: Array<{
      duration?: string;
      distanceMeters?: number;
      legs?: Array<{ steps?: RawStep[] }>;
    }>;
  };
  return json.routes?.[0] ?? null;
}

function parseSteps(raw: RawStep[]): LegStep[] {
  const steps: LegStep[] = [];
  for (const s of raw) {
    if (s.travelMode === "TRANSIT" && s.transitDetails) {
      const t = s.transitDetails;
      const step: TransitStep = {
        kind: "transit",
        minutes: toMin(seconds(s.staticDuration)),
        line: t.transitLine?.nameShort ?? t.transitLine?.name ?? "?",
        lineName: t.transitLine?.name ?? "",
        color: t.transitLine?.color ?? "#111111",
        textColor: t.transitLine?.textColor ?? "#FFFFFF",
        vehicle: t.transitLine?.vehicle?.type ?? "SUBWAY",
        headsign: t.headsign ?? "",
        from: t.stopDetails?.departureStop?.name ?? "",
        to: t.stopDetails?.arrivalStop?.name ?? "",
        stops: t.stopCount ?? 0,
      };
      steps.push(step);
    } else {
      const sec = seconds(s.staticDuration);
      const meters = s.distanceMeters ?? 0;
      if (sec === 0 && meters === 0) continue;
      const last = steps[steps.length - 1];
      if (last && last.kind === "walk") {
        last.minutes += sec / 60;
        last.meters += meters;
      } else {
        const step: WalkStep = {
          kind: "walk",
          minutes: sec / 60,
          meters,
          instruction: s.navigationInstruction?.instructions ?? "Walk",
        };
        steps.push(step);
      }
    }
  }
  return steps.map((s) =>
    s.kind === "walk" ? { ...s, minutes: Math.max(1, Math.round(s.minutes)) } : s,
  );
}

const legCache = new Map<string, Leg>();
const cacheKey = (o: LatLng, d: LatLng) =>
  `${o.lat.toFixed(4)},${o.lng.toFixed(4)}>${d.lat.toFixed(4)},${d.lng.toFixed(4)}`;

export async function computeLeg(origin: LatLng, destination: LatLng): Promise<Leg> {
  const key = cacheKey(origin, destination);
  const cached = legCache.get(key);
  if (cached) return cached;

  const straight = haversineMeters(origin, destination);
  let leg: Leg | null = null;

  if (straight >= 1100) {
    const route = await computeRoute(origin, destination, "TRANSIT");
    if (route?.legs?.[0]?.steps?.length) {
      const steps = parseSteps(route.legs[0].steps);
      const hasTransit = steps.some((s) => s.kind === "transit");
      leg = {
        mode: hasTransit ? "transit" : "walk",
        minutes: toMin(seconds(route.duration)),
        meters: route.distanceMeters ?? 0,
        steps,
      };
    }
  }

  if (!leg) {
    const route = await computeRoute(origin, destination, "WALK");
    if (!route) throw new Error("No route found between these stops.");
    const meters = route.distanceMeters ?? Math.round(straight);
    leg = {
      mode: "walk",
      minutes: toMin(seconds(route.duration)),
      meters,
      steps: [{ kind: "walk", minutes: toMin(seconds(route.duration)), meters, instruction: "Walk" }],
    };
  }

  legCache.set(key, leg);
  return leg;
}

/** Computes consecutive legs for a list of points with bounded concurrency. */
export async function computeLegs(points: LatLng[]): Promise<Leg[]> {
  const pairs = points.slice(1).map((p, i) => [points[i], p] as const);
  const results: Leg[] = new Array(pairs.length);
  const CONCURRENCY = 3;
  let cursor = 0;
  async function worker() {
    while (cursor < pairs.length) {
      const i = cursor++;
      const [o, d] = pairs[i];
      results[i] = await computeLeg(o, d);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pairs.length) }, worker));
  return results;
}
