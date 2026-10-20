import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock,
  Hotel as HotelIcon,
  Navigation,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import { DayMap } from "@/components/DayMap";
import { LegDirections } from "@/components/LegDirections";
import { SubwayBullet } from "@/components/SubwayBullet";
import { Button } from "@/components/ui/button";
import {
  ATTRACTION_BY_ID,
  AREA_COLOR,
  formatOpeningHours,
  formatRange,
  hoursFor,
  openRangeOn,
  type Attraction,
} from "@/data/attractions";
import {
  closedReason,
  dateLabelForDay,
  DAY_START_MINUTES,
  estimateMinutes,
  formatClock,
  formatDuration,
  paceFor,
  PACE_SHORT,
  pointsKey,
  weekdayForDay,
  type LatLng,
  type Leg,
  type SavedTrip,
} from "@/lib/itinerary";
import { getDayLegs } from "@/lib/maps.functions";
import { MyTrips } from "@/components/MyTrips";
import { loadTrip, saveTrip } from "@/lib/trip-storage";
import { cn } from "@/lib/utils";

const TITLE = "Your NYC itinerary — NYC Transit Planner";
const DESC =
  "Day-by-day New York City itinerary with subway lines and walking directions between every stop.";

export const Route = createFileRoute("/itinerary")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ItineraryPage,
});

function ItineraryPage() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<SavedTrip | null | undefined>(undefined);
  const [day, setDay] = useState(0);

  useEffect(() => {
    const t = loadTrip();
    setTrip(t);
    if (!t) navigate({ to: "/" });
  }, [navigate]);

  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="label-caps text-muted-foreground">Loading your trip…</p>
      </main>
    );
  }

  const active = trip.plan[day] ?? trip.plan[0]!;

  return (
    <main className="min-h-screen pb-16">
      <div className="stripe-bar h-2" />
      <header className="border-b-2 px-5 pb-4 pt-5">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="label-caps inline-flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Edit trip
            </Link>
            <span className="label-caps text-muted-foreground">
              {trip.attractionIds.length} stops · {trip.days} {trip.days === 1 ? "day" : "days"}
            </span>
          </div>
          <h1 className="display mt-3 text-4xl sm:text-5xl">Your itinerary</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <HotelIcon className="h-4 w-4" />
            <span className="truncate">{trip.hotel.name}</span>
          </p>
          <div className="mt-4"><MyTrips canSave /></div>

          <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
            {trip.plan.map((p, i) => (
              <button
                key={p.day}
                type="button"
                onClick={() => setDay(i)}
                className={cn(
                  "flex shrink-0 flex-col items-start border-2 px-3 py-2 text-left transition-colors",
                  i === day ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
                )}
              >
                <span className="label-caps">Day</span>
                <span className="display text-2xl">{p.day}</span>
                {trip.startDate && (
                  <span
                    className={cn(
                      "text-[11px] font-bold",
                      i === day ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {dateLabelForDay(trip.startDate, i)}
                  </span>
                )}
                <span
                  className={cn(
                    "text-[11px]",
                    i === day ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {p.stopIds.length} {p.stopIds.length === 1 ? "stop" : "stops"} ·{" "}
                  {PACE_SHORT[paceFor(trip, i)]}
                  {trip.startDate &&
                  p.stopIds.some((id) => closedReason(trip.startDate!, i, id))
                    ? " · ⚠"
                    : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pt-6">
        <DayView key={active.day} trip={trip} dayIndex={trip.plan.indexOf(active)} onTripUpdate={setTrip} />
      </div>
    </main>
  );
}

function DayView({
  trip,
  dayIndex,
  onTripUpdate,
}: {
  trip: SavedTrip;
  dayIndex: number;
  onTripUpdate: (t: SavedTrip) => void;
}) {
  const plan = trip.plan[dayIndex]!;
  const attractionById = useMemo(
    () => new Map([...ATTRACTION_BY_ID, ...(trip.customAttractions ?? []).map((a) => [a.id, a] as const)]),
    [trip.customAttractions],
  );
  const stops = useMemo(
    () => plan.stopIds.map((id) => attractionById.get(id)).filter((a): a is Attraction => !!a),
    [attractionById, plan.stopIds],
  );
  const points = useMemo(
    () => [trip.hotel, ...stops, trip.hotel].map((p) => ({ lat: p.lat, lng: p.lng })),
    [trip.hotel, stops],
  );
  const key = pointsKey(points);
  const cached = trip.legs[key];

  const query = useQuery({
    queryKey: ["legs", key],
    queryFn: async () => {
      const legs = await getDayLegs({ data: { points } });
      const latest = loadTrip();
      if (latest) {
        const updated = { ...latest, legs: { ...latest.legs, [key]: legs } };
        saveTrip(updated);
        onTripUpdate(updated);
      }
      return legs;
    },
    initialData: cached,
    enabled: stops.length > 0 && !cached,
    staleTime: Infinity,
    retry: false,
  });

  const legs: Leg[] | undefined = query.data;

  if (stops.length === 0) {
    return (
      <div className="ticket p-6 text-center">
        <p className="display text-2xl">Free day</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Nothing scheduled. Add more attractions or shorten your trip.
        </p>
      </div>
    );
  }

  const weekday = trip.startDate ? weekdayForDay(trip.startDate, dayIndex) : null;

  // Build the time schedule
  let clock = DAY_START_MINUTES;
  const schedule = stops.map((stop, i) => {
    const travel = legs?.[i]?.minutes ?? estimateMinutes(points[i]!, points[i + 1]!);
    clock += travel;
    const arrive = clock;
    clock += stop.minutes;
    return { stop, arrive, depart: clock };
  });
  const backHome = legs?.[stops.length]?.minutes ?? estimateMinutes(points[stops.length]!, points[stops.length + 1]!);
  const endOfDay = clock + backHome;
  const totalTravel = legs
    ? legs.reduce((s, l) => s + l.minutes, 0)
    : points.slice(1).reduce((s, p, i) => s + estimateMinutes(points[i]!, p), 0);

  return (
    <div className="space-y-5">
      <DayMap
        hotel={trip.hotel}
        stops={stops}
        label={`Day ${plan.day}`}
        weekday={weekday}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Stops" value={String(stops.length)} />
        <Stat label="Plan" value={PACE_SHORT[paceFor(trip, dayIndex)]} />
        <Stat label="Travel" value={formatDuration(totalTravel)} />
        <Stat label="Back by" value={formatClock(endOfDay)} />
      </div>

      {query.isError && (
        <div className="ticket-sm flex items-center justify-between gap-3 p-3 text-sm">
          <span>
            Live directions couldn't load. Showing estimates.
            <span className="block text-xs text-muted-foreground">
              {(query.error as Error).message}
            </span>
          </span>
          <Button variant="outline" size="sm" onClick={() => query.refetch()}>
            <RefreshCw /> Retry
          </Button>
        </div>
      )}

      <ol className="rail">
        <div className="rail-line" aria-hidden />
        <TimelineNode
          icon={<HotelIcon className="h-4 w-4" />}
          title={trip.hotel.name}
          subtitle={`Leave at ${formatClock(DAY_START_MINUTES)}`}
        />
        {schedule.map(({ stop, arrive, depart }, i) => (
          <li key={stop.id} className="relative">
            <LegDirections
              leg={legs?.[i]}
              estimateMinutes={estimateMinutes(points[i]!, points[i + 1]!)}
              loading={query.isFetching && !legs}
              error={query.isError ? "Estimate only" : undefined}
            />
            <LiveDirectionsLink from={points[i]!} to={points[i + 1]!} />
            <div className="relative flex items-start gap-3">
              <SubwayBullet
                label={String(i + 1)}
                color={AREA_COLOR[stop.area]}
                size="lg"
                className="relative z-10 border-2 border-background"
              />
              <div className="ticket-sm flex-1 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-black leading-tight">{stop.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {stop.custom ? "Added place" : `#${stop.rank} on Tripadvisor`} · {stop.area}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                      {stop.custom ? "Hours vary — check before visiting" : formatOpeningHours(stop.id)}
                    </p>
                    {!stop.custom && hoursFor(stop.id).caveat && (
                      <p className="text-[11px] italic text-muted-foreground">
                        {hoursFor(stop.id).caveat}
                      </p>
                    )}
                    {trip.startDate && closedReason(trip.startDate, dayIndex, stop.id) && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-black text-destructive">
                        <TriangleAlert className="h-3.5 w-3.5" />
                        {closedReason(trip.startDate, dayIndex, stop.id)} — consider swapping days
                      </p>
                    )}
                    {!stop.custom && weekday !== null &&
                      (() => {
                        const r = openRangeOn(stop.id, weekday);
                        if (!r || hoursFor(stop.id).alwaysOpen) return null;
                        if (arrive < r.open)
                          return (
                            <p className="mt-1 text-xs font-bold text-muted-foreground">
                              Doesn't open until {formatRange(r).split(" – ")[0]} today
                            </p>
                          );
                        if (arrive > r.close - 30)
                          return (
                            <p className="mt-1 flex items-center gap-1 text-xs font-black text-destructive">
                              <TriangleAlert className="h-3.5 w-3.5" />
                              Closes at {formatRange(r).split(" – ")[1]} today — visit earlier
                            </p>
                          );
                        return null;
                      })()}
                    {stop.note && <p className="mt-1 text-xs italic">{stop.note}</p>}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-bold">{formatClock(arrive)}</span>
                  <span className="text-muted-foreground">
                    – {formatClock(depart)} · {formatDuration(stop.minutes)}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
        <li className="relative">
          <LegDirections
            leg={legs?.[stops.length]}
            estimateMinutes={estimateMinutes(points[stops.length]!, points[stops.length + 1]!)}
            loading={query.isFetching && !legs}
            error={query.isError ? "Estimate only" : undefined}
          />
          <LiveDirectionsLink from={points[stops.length]!} to={points[stops.length + 1]!} />
        </li>
        <TimelineNode
          icon={<HotelIcon className="h-4 w-4" />}
          title="Back to hotel"
          subtitle={`Around ${formatClock(endOfDay)}`}
          last
        />
      </ol>
    </div>
  );
}

/** Deep link into the Google Maps app/site — live navigation happens on the user's device, no API cost. */
function mapsDirUrl(from: LatLng, to: LatLng) {
  const params = new URLSearchParams({
    api: "1",
    origin: `${from.lat},${from.lng}`,
    destination: `${to.lat},${to.lng}`,
    travelmode: "transit",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function LiveDirectionsLink({ from, to }: { from: LatLng; to: LatLng }) {
  return (
    <a
      href={mapsDirUrl(from, to)}
      target="_blank"
      rel="noreferrer"
      className="label-caps ml-11 inline-flex items-center gap-1 border-b-2 border-primary pb-0.5 text-primary hover:text-foreground"
    >
      <Navigation className="h-3 w-3" /> Open live directions in Google Maps
    </a>
  );
}

function TimelineNode({
  icon,
  title,
  subtitle,
  last,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  last?: boolean;
}) {
  return (
    <li className={cn("relative flex items-center gap-3", last && "bg-background")}>
      <span className="relative z-10 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
        {icon}
      </span>
      <div>
        <p className="font-black leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ticket-sm p-3">
      <div className="label-caps text-muted-foreground">{label}</div>
      <div className="display mt-1 text-xl">{value}</div>
    </div>
  );
}
