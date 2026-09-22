import { isOpenOnWeekday, WEEKDAY_NAMES, type Attraction } from "@/data/attractions";

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

/** How much sightseeing time a given date has. */
export type DayPace = "full" | "half" | "short";

export const PACE_MINUTES: Record<DayPace, number> = {
  full: 480,
  half: 270,
  short: 150,
};

export const PACE_LABEL: Record<DayPace, string> = {
  full: "Full day",
  half: "Half day",
  short: "3 hours or less",
};

export const PACE_SHORT: Record<DayPace, string> = {
  full: "Full day",
  half: "Half day",
  short: "≤ 3 hrs",
};

export interface SavedTrip {
  days: number;
  /** First day of the trip, "YYYY-MM-DD" local date */
  startDate?: string;
  /** Last day of the trip, "YYYY-MM-DD" local date */
  endDate?: string;
  /** Time available per trip day, index 0 = first day */
  paces?: DayPace[];
  hotel: Hotel;
  attractionIds: string[];
  plan: DayPlan[];
  legs: Record<string, Leg[]>;
  createdAt: number;
}

export const DAY_START_MINUTES = 9 * 60;

export function paceFor(trip: SavedTrip, dayIndex: number): DayPace {
  return trip.paces?.[dayIndex] ?? "full";
}

/** Inclusive number of days between two "YYYY-MM-DD" dates. */
export function daysBetween(startDate: string, endDate: string): number {
  const a = new Date(`${startDate}T12:00:00`).getTime();
  const b = new Date(`${endDate}T12:00:00`).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 1;
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

/** Add `n` days to a "YYYY-MM-DD" date. */
export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + n);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

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
export function buildItinerary(
  hotel: LatLng,
  selected: Attraction[],
  days: number,
  startDate?: string,
): DayPlan[] {
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

  if (startDate) repairClosedDays(groups, startDate);

  return groups.map((g, i) => ({ day: i + 1, stopIds: g.map((a) => a.id) }));
}

/** Weekday (0 = Sunday) of trip day `dayIndex` (0-based), given a start date. */
export function weekdayForDay(startDate: string, dayIndex: number): number {
  const d = new Date(`${startDate}T12:00:00`);
  d.setDate(d.getDate() + dayIndex);
  return d.getDay();
}

/** "Mon, Sep 22" style label for a trip day. */
export function dateLabelForDay(startDate: string, dayIndex: number): string {
  const d = new Date(`${startDate}T12:00:00`);
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** Today's date as "YYYY-MM-DD", for the date picker's minimum. */
export function todayISO(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * After geographic grouping, swap stops between days so no sight is
 * scheduled on a weekday it's closed. Stops that can't be moved (no open
 * day left, or every open day conflicts with a swap partner) stay put and
 * get flagged on the itinerary instead.
 */
function repairClosedDays(groups: Attraction[][], startDate: string): void {
  for (let pass = 0; pass < 4; pass++) {
    let fixed = true;
    for (let d = 0; d < groups.length; d++) {
      const wd = weekdayForDay(startDate, d);
      for (let i = 0; i < groups[d]!.length; i++) {
        const stop = groups[d]![i]!;
        if (isOpenOnWeekday(stop.id, wd)) continue;
        fixed = false;
        // Try swapping with a stop on another day that is open here.
        let moved = false;
        for (let od = 0; od < groups.length && !moved; od++) {
          if (od === d) continue;
          const owd = weekdayForDay(startDate, od);
          if (!isOpenOnWeekday(stop.id, owd)) continue;
          for (let j = 0; j < groups[od]!.length; j++) {
            const other = groups[od]![j]!;
            if (isOpenOnWeekday(other.id, wd) && isOpenOnWeekday(other.id, owd)) {
              groups[d]![i] = other;
              groups[od]![j] = stop;
              moved = true;
              break;
            }
          }
        }
        if (moved) continue;
        // Fallback: plain move into a day where it's open and has no conflicts.
        for (let od = 0; od < groups.length && !moved; od++) {
          if (od === d) continue;
          const owd = weekdayForDay(startDate, od);
          if (!isOpenOnWeekday(stop.id, owd)) continue;
          const conflicts = groups[od]!.filter((a) => !isOpenOnWeekday(a.id, owd)).length;
          if (conflicts > 0) continue;
          groups[d]!.splice(i, 1);
          groups[od]!.push(stop);
          moved = true;
        }
        // If still not moved, it stays and the itinerary page flags it.
      }
    }
    if (fixed) break;
  }
}

/** Human-readable reason a stop conflicts with its scheduled day. */
export function closedReason(startDate: string, dayIndex: number, id: string): string | null {
  const wd = weekdayForDay(startDate, dayIndex);
  if (isOpenOnWeekday(id, wd)) return null;
  return `Closed on ${WEEKDAY_NAMES[wd]}s`;
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
