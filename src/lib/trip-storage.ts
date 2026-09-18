import type { SavedTrip } from "./itinerary";

const KEY = "nyc-transit-planner:trip";

export function loadTrip(): SavedTrip | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedTrip) : null;
  } catch {
    return null;
  }
}

export function saveTrip(trip: SavedTrip) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(trip));
}

export function clearTrip() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
