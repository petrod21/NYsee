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

const NAME_KEY = "nyc-transit-planner:name";
const LIBRARY_KEY = "nyc-transit-planner:saved-trips";

export interface StoredTrip {
  id: string;
  name: string;
  savedAt: string;
  trip: SavedTrip;
}

export function loadAccountName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(NAME_KEY) ?? "";
}

export function saveAccountName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAME_KEY, name);
}

export function loadSavedTrips(): StoredTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LIBRARY_KEY);
    return raw ? (JSON.parse(raw) as StoredTrip[]) : [];
  } catch {
    return [];
  }
}

function writeSavedTrips(list: StoredTrip[]) {
  window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(list));
}

/** Saves a named copy of a trip on this device; same name overwrites. */
export function addSavedTrip(name: string, trip: SavedTrip): StoredTrip[] {
  const list = loadSavedTrips().filter((t) => t.name.toLowerCase() !== name.toLowerCase());
  const entry: StoredTrip = { id: `${Date.now()}`, name, savedAt: new Date().toISOString(), trip };
  const next = [entry, ...list];
  writeSavedTrips(next);
  return next;
}

export function deleteSavedTrip(id: string): StoredTrip[] {
  const next = loadSavedTrips().filter((t) => t.id !== id);
  writeSavedTrips(next);
  return next;
}
