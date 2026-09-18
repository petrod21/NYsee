import type { Attraction } from "@/data/attractions";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Hotel extends LatLng {
  name: string;
  address: string;
}

export interface WalkStep {
  kind: "walk";
  minutes: number;
  meters: number;
  instruction: string;
}

export interface TransitStep {
  kind: "transit";
  minutes: number;
  line: string;
  lineName: string;
  color: string;
  textColor: string;
  vehicle: string;
  headsign: string;
  from: string;
  to: string;
  stops: number;
}

export type LegStep = WalkStep | TransitStep;

export interface Leg {
  mode: "walk" | "transit";
  minutes: number;
  meters: number;
  steps: LegStep[];
}

export interface DayPlan {
  day: number;
  stopIds: string[];
}

export interface SavedTrip {
  days: number;
  hotel: Hotel;
  attractionIds: string[];
  plan: DayPlan[];
  legs: Record<string, Leg[]>;
  createdAt: number;
}

/** Sightseeing minutes per day before we start a new day. */
const DAY_BUDGET_MINUTES = 480;
export const DAY_START_MINUTES = 9 * 60;

export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Rough door-to-door estimate before live directions load. */
export function estimateMinutes(a: LatLng, b: LatLng): number {
  const m = haversineMeters(a, b);
  if (m < 1200) return Math.max(3, Math.round(m / 80));
  return Math.round(12 + m / 400);
}

function centroid(points: LatLng[]): LatLng {
  const n = points.length;
  return {
    lat: points.reduce((s, p) => s + p.lat, 0) / n,
    lng: points.reduce((s, p) => s + p.lng, 0) / n,
  };
}

function orderStops(hotel: LatLng, stops: Attraction[]): Attraction[] {
  const remaining = [...stops];
  const ordered: Attraction[] = [];
  let cur: LatLng = hotel;
  while (remaining.length) {
    let bi = 0;
    let bd = Infinity;
    remaining.forEach((a, i) => {
      const d = haversineMeters(cur, a);
      if (d < bd) {
        bd = d;
        bi = i;
      }
    });
    const next = remaining.splice(bi, 1)[0]!;
    ordered.push(next);
    cur = next;
  }
  // 2-opt pass to untangle crossings
  let improved = true;
  const dist = (p: LatLng, q: LatLng) => haversineMeters(p, q);
  while (improved && ordered.length > 3) {
    improved = false;
    for (let i = 0; i < ordered.length - 2; i++) {
      for (let j = i + 1; j < ordered.length - 1; j++) {
        const a = i === 0 ? hotel : ordered[i - 1]!;
        const b = ordered[i]!;
        const c = ordered[j]!;
        const d = ordered[j + 1]!;
        if (dist(a, b) + dist(c, d) > dist(a, c) + dist(b, d) + 1) {
          ordered.splice(i, j - i + 1, ...ordered.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }
  return ordered;
}

/**
 * Groups selected attractions into geographically tight days,
 * then orders each day as a loop starting from the hotel.
 */
export function buildItinerary(hotel: LatLng, selected: Attraction[], days: number): DayPlan[] {
  const remaining = [...selected];
  const groups: Attraction[][] = [];

  for (let d = 0; d < days; d++) {
    const daysLeft = days - d;
    if (remaining.length === 0) {
      groups.push([]);
      continue;
    }
    const target = Math.ceil(remaining.length / daysLeft);

    // Seed each day with the unplanned stop farthest from the hotel so
    // outlying sights get grouped with their neighbours.
    let seedIdx = 0;
    let best = -1;
    remaining.forEach((a, i) => {
      const dd = haversineMeters(hotel, a);
      if (dd > best) {
        best = dd;
        seedIdx = i;
      }
    });
    const stops: Attraction[] = [remaining.splice(seedIdx, 1)[0]!];
    let minutes = stops[0]!.minutes;

    while (stops.length < target && remaining.length) {
      const c = centroid(stops);
      let bi = 0;
      let bd = Infinity;
      remaining.forEach((a, i) => {
        const dd = haversineMeters(c, a);
        if (dd < bd) {
          bd = dd;
          bi = i;
        }
      });
      const next = remaining[bi]!;
      if (minutes + next.minutes > DAY_BUDGET_MINUTES && stops.length >= 2 && daysLeft > 1) break;
      stops.push(remaining.splice(bi, 1)[0]!);
      minutes += next.minutes;
    }
    groups.push(orderStops(hotel, stops));
  }

  // Closest cluster to the hotel becomes Day 1.
  groups.sort((a, b) => {
    if (!a.length) return 1;
    if (!b.length) return -1;
    return haversineMeters(hotel, centroid(a)) - haversineMeters(hotel, centroid(b));
  });

  return groups.map((g, i) => ({ day: i + 1, stopIds: g.map((a) => a.id) }));
}

export function pointsKey(points: LatLng[]): string {
  return points.map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join(">");
}

export function formatClock(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return `${Math.round(meters * 3.281)} ft`;
  return `${miles.toFixed(1)} mi`;
}

export interface PlaceSuggestion {
  placeId: string;
  main: string;
  secondary: string;
}
