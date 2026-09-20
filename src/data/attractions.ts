export type Area =
  | "Midtown"
  | "Upper West Side"
  | "Upper East Side"
  | "Lower Manhattan"
  | "Chelsea & Village"
  | "SoHo & Downtown"
  | "Brooklyn"
  | "Uptown & Bronx";

export type LineColor =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "orange"
  | "purple"
  | "lime"
  | "brown"
  | "gray"
  | "ink";

export interface Attraction {
  id: string;
  rank: number;
  name: string;
  area: Area;
  lat: number;
  lng: number;
  /** Suggested visit length in minutes */
  minutes: number;
  /** Nearest subway lines */
  lines: string[];
  note?: string;
}

export const AREA_COLOR: Record<Area, LineColor> = {
  Midtown: "yellow",
  "Upper West Side": "red",
  "Upper East Side": "green",
  "Lower Manhattan": "blue",
  "Chelsea & Village": "gray",
  "SoHo & Downtown": "orange",
  Brooklyn: "lime",
  "Uptown & Bronx": "purple",
};

export const AREAS: Area[] = [
  "Midtown",
  "Lower Manhattan",
  "Chelsea & Village",
  "SoHo & Downtown",
  "Upper West Side",
  "Upper East Side",
  "Brooklyn",
  "Uptown & Bronx",
];

/** Top 50 NYC attractions as ranked on Tripadvisor "Things to Do". */
export const ATTRACTIONS: Attraction[] = [
  { id: "central-park", rank: 1, name: "Central Park", area: "Upper West Side", lat: 40.7729, lng: -73.9734, minutes: 150, lines: ["A", "B", "C", "D", "1"] },
  { id: "met-museum", rank: 2, name: "The Metropolitan Museum of Art", area: "Upper East Side", lat: 40.7794, lng: -73.9632, minutes: 180, lines: ["4", "5", "6"] },
  { id: "empire-state", rank: 3, name: "Empire State Building", area: "Midtown", lat: 40.7484, lng: -73.9857, minutes: 90, lines: ["B", "D", "F", "M", "N", "Q", "R", "W"] },
  { id: "top-of-the-rock", rank: 4, name: "Top of the Rock", area: "Midtown", lat: 40.7593, lng: -73.9794, minutes: 75, lines: ["B", "D", "F", "M"] },
  { id: "statue-of-liberty", rank: 5, name: "Statue of Liberty", area: "Lower Manhattan", lat: 40.7017, lng: -74.0156, minutes: 180, lines: ["1", "4", "5", "R", "W"], note: "Ferry departs from Battery Park" },
  { id: "911-memorial", rank: 6, name: "9/11 Memorial & Museum", area: "Lower Manhattan", lat: 40.7115, lng: -74.0134, minutes: 120, lines: ["E", "R", "W", "1"] },
  { id: "brooklyn-bridge", rank: 7, name: "Brooklyn Bridge", area: "Lower Manhattan", lat: 40.7081, lng: -74.0036, minutes: 60, lines: ["4", "5", "6", "J", "Z"] },
  { id: "high-line", rank: 8, name: "The High Line", area: "Chelsea & Village", lat: 40.748, lng: -74.0048, minutes: 75, lines: ["A", "C", "E", "L"] },
  { id: "one-world", rank: 9, name: "One World Observatory", area: "Lower Manhattan", lat: 40.713, lng: -74.0132, minutes: 75, lines: ["E", "R", "W", "1"] },
  { id: "amnh", rank: 10, name: "American Museum of Natural History", area: "Upper West Side", lat: 40.7813, lng: -73.974, minutes: 180, lines: ["B", "C", "1"] },
  { id: "times-square", rank: 11, name: "Times Square", area: "Midtown", lat: 40.758, lng: -73.9855, minutes: 45, lines: ["1", "2", "3", "7", "N", "Q", "R", "W", "S"] },
  { id: "grand-central", rank: 12, name: "Grand Central Terminal", area: "Midtown", lat: 40.7527, lng: -73.9772, minutes: 30, lines: ["4", "5", "6", "7", "S"] },
  { id: "moma", rank: 13, name: "Museum of Modern Art (MoMA)", area: "Midtown", lat: 40.7614, lng: -73.9776, minutes: 120, lines: ["E", "M"] },
  { id: "rockefeller", rank: 14, name: "Rockefeller Center", area: "Midtown", lat: 40.7587, lng: -73.9787, minutes: 45, lines: ["B", "D", "F", "M"] },
  { id: "ellis-island", rank: 15, name: "Ellis Island", area: "Lower Manhattan", lat: 40.7017, lng: -74.0156, minutes: 120, lines: ["1", "4", "5", "R", "W"], note: "Same ferry as Statue of Liberty" },
  { id: "broadway", rank: 16, name: "Broadway Show (Theater District)", area: "Midtown", lat: 40.759, lng: -73.9845, minutes: 180, lines: ["1", "2", "3", "N", "Q", "R", "W"] },
  { id: "summit", rank: 17, name: "SUMMIT One Vanderbilt", area: "Midtown", lat: 40.7527, lng: -73.9787, minutes: 90, lines: ["4", "5", "6", "7", "S"] },
  { id: "edge", rank: 18, name: "Edge at Hudson Yards", area: "Chelsea & Village", lat: 40.754, lng: -74.0007, minutes: 75, lines: ["7"] },
  { id: "chelsea-market", rank: 19, name: "Chelsea Market", area: "Chelsea & Village", lat: 40.7424, lng: -74.0061, minutes: 60, lines: ["A", "C", "E", "L"] },
  { id: "st-patricks", rank: 20, name: "St. Patrick's Cathedral", area: "Midtown", lat: 40.7585, lng: -73.976, minutes: 30, lines: ["E", "M", "B", "D", "F"] },
  { id: "bk-heights", rank: 21, name: "Brooklyn Heights Promenade", area: "Brooklyn", lat: 40.696, lng: -73.9974, minutes: 45, lines: ["2", "3", "4", "5", "R"] },
  { id: "dumbo", rank: 22, name: "DUMBO & Brooklyn Bridge Park", area: "Brooklyn", lat: 40.7033, lng: -73.9894, minutes: 75, lines: ["F", "A", "C"] },
  { id: "intrepid", rank: 23, name: "Intrepid Sea, Air & Space Museum", area: "Midtown", lat: 40.7645, lng: -73.9995, minutes: 120, lines: ["A", "C", "E"] },
  { id: "bryant-park", rank: 24, name: "Bryant Park", area: "Midtown", lat: 40.7536, lng: -73.9832, minutes: 30, lines: ["B", "D", "F", "M", "7"] },
  { id: "nypl", rank: 25, name: "New York Public Library", area: "Midtown", lat: 40.7532, lng: -73.9822, minutes: 45, lines: ["B", "D", "F", "M", "7"] },
  { id: "fifth-ave", rank: 26, name: "Fifth Avenue Shopping", area: "Midtown", lat: 40.762, lng: -73.974, minutes: 60, lines: ["E", "M", "N", "R", "W"] },
  { id: "wall-street", rank: 27, name: "Wall Street & Charging Bull", area: "Lower Manhattan", lat: 40.7056, lng: -74.0134, minutes: 30, lines: ["4", "5", "2", "3", "J", "Z"] },
  { id: "si-ferry", rank: 28, name: "Staten Island Ferry", area: "Lower Manhattan", lat: 40.7013, lng: -74.0133, minutes: 75, lines: ["1", "R", "W", "4", "5"] },
  { id: "oculus", rank: 29, name: "The Oculus at World Trade Center", area: "Lower Manhattan", lat: 40.7115, lng: -74.0112, minutes: 30, lines: ["E", "R", "W", "1", "2", "3", "A", "C"] },
  { id: "chinatown", rank: 30, name: "Chinatown & Little Italy", area: "SoHo & Downtown", lat: 40.7158, lng: -73.997, minutes: 75, lines: ["6", "J", "Z", "N", "Q", "R", "W"] },
  { id: "soho", rank: 31, name: "SoHo", area: "SoHo & Downtown", lat: 40.7233, lng: -74.003, minutes: 60, lines: ["N", "R", "W", "C", "E"] },
  { id: "washington-sq", rank: 32, name: "Washington Square Park & Greenwich Village", area: "Chelsea & Village", lat: 40.7308, lng: -73.9973, minutes: 60, lines: ["A", "B", "C", "D", "E", "F", "M"] },
  { id: "frick", rank: 33, name: "The Frick Collection", area: "Upper East Side", lat: 40.7711, lng: -73.9673, minutes: 90, lines: ["6", "F", "Q"] },
  { id: "guggenheim", rank: 34, name: "Guggenheim Museum", area: "Upper East Side", lat: 40.783, lng: -73.959, minutes: 90, lines: ["4", "5", "6", "Q"] },
  { id: "whitney", rank: 35, name: "Whitney Museum of American Art", area: "Chelsea & Village", lat: 40.7396, lng: -74.0089, minutes: 90, lines: ["A", "C", "E", "L"] },
  { id: "tenement", rank: 36, name: "Tenement Museum", area: "SoHo & Downtown", lat: 40.7188, lng: -73.99, minutes: 90, lines: ["F", "J", "M", "Z"] },
  { id: "bbg", rank: 37, name: "Brooklyn Botanic Garden", area: "Brooklyn", lat: 40.6676, lng: -73.9632, minutes: 90, lines: ["2", "3", "4", "5", "B", "Q"] },
  { id: "prospect-park", rank: 38, name: "Prospect Park", area: "Brooklyn", lat: 40.6602, lng: -73.969, minutes: 90, lines: ["B", "Q", "F", "G"] },
  { id: "coney-island", rank: 39, name: "Coney Island", area: "Brooklyn", lat: 40.5755, lng: -73.9707, minutes: 180, lines: ["D", "F", "N", "Q"] },
  { id: "yankee-stadium", rank: 40, name: "Yankee Stadium", area: "Uptown & Bronx", lat: 40.8296, lng: -73.9262, minutes: 180, lines: ["4", "B", "D"] },
  { id: "cloisters", rank: 41, name: "The Met Cloisters", area: "Uptown & Bronx", lat: 40.8649, lng: -73.9317, minutes: 120, lines: ["A"] },
  { id: "roosevelt-tram", rank: 42, name: "Roosevelt Island Tramway", area: "Upper East Side", lat: 40.7614, lng: -73.9642, minutes: 45, lines: ["N", "R", "W", "4", "5", "6"] },
  { id: "flatiron", rank: 43, name: "Flatiron Building & Madison Square Park", area: "Chelsea & Village", lat: 40.7411, lng: -73.9897, minutes: 30, lines: ["N", "R", "W", "6"] },
  { id: "union-square", rank: 44, name: "Union Square", area: "Chelsea & Village", lat: 40.7359, lng: -73.9911, minutes: 30, lines: ["4", "5", "6", "L", "N", "Q", "R", "W"] },
  { id: "radio-city", rank: 45, name: "Radio City Music Hall", area: "Midtown", lat: 40.76, lng: -73.98, minutes: 60, lines: ["B", "D", "F", "M"] },
  { id: "msg", rank: 46, name: "Madison Square Garden", area: "Midtown", lat: 40.7505, lng: -73.9934, minutes: 120, lines: ["1", "2", "3", "A", "C", "E"] },
  { id: "mcny", rank: 47, name: "Museum of the City of New York", area: "Uptown & Bronx", lat: 40.7924, lng: -73.9519, minutes: 90, lines: ["6"] },
  { id: "lincoln-center", rank: 48, name: "Lincoln Center", area: "Upper West Side", lat: 40.7725, lng: -73.9835, minutes: 45, lines: ["1"] },
  { id: "battery-park", rank: 49, name: "The Battery", area: "Lower Manhattan", lat: 40.7033, lng: -74.017, minutes: 45, lines: ["1", "4", "5", "R", "W"] },
  { id: "little-island", rank: 50, name: "Little Island", area: "Chelsea & Village", lat: 40.742, lng: -74.0101, minutes: 45, lines: ["A", "C", "E", "L"] },
];

export const ATTRACTION_BY_ID = new Map(ATTRACTIONS.map((a) => [a.id, a]));

/** MTA trunk colors by route letter/number. */
export function lineColor(line: string): LineColor {
  const l = line.toUpperCase();
  if (["1", "2", "3"].includes(l)) return "red";
  if (["4", "5", "6"].includes(l)) return "green";
  if (l === "7") return "purple";
  if (["A", "C", "E"].includes(l)) return "blue";
  if (["B", "D", "F", "M"].includes(l)) return "orange";
  if (l === "G") return "lime";
  if (["J", "Z"].includes(l)) return "brown";
  if (l === "L") return "gray";
  if (["N", "Q", "R", "W"].includes(l)) return "yellow";
  return "ink";
}

/* ------------------------------------------------------------------ *
 * Opening days & hours
 * Minutes from midnight. `closedDays`: 0 = Sunday … 6 = Saturday.
 * ------------------------------------------------------------------ */

export interface OpeningHours {
  /** Open 24h / outdoor space with no meaningful closing day */
  alwaysOpen?: boolean;
  open: number;
  close: number;
  closedDays: number[];
  /** Extra caveat shown to the traveller */
  caveat?: string;
}

const h = (hh: number, mm = 0) => hh * 60 + mm;

const open247: OpeningHours = { alwaysOpen: true, open: h(6), close: h(23, 59), closedDays: [] };

export const ATTRACTION_HOURS: Record<string, OpeningHours> = {
  "central-park": open247,
  "met-museum": { open: h(10), close: h(17), closedDays: [3] },
  "empire-state": { open: h(9), close: h(23, 59), closedDays: [] },
  "top-of-the-rock": { open: h(9), close: h(23, 59), closedDays: [] },
  "statue-of-liberty": { open: h(9), close: h(17), closedDays: [], caveat: "Book the ferry ahead" },
  "911-memorial": { open: h(10), close: h(17), closedDays: [2] },
  "brooklyn-bridge": open247,
  "high-line": { open: h(7), close: h(22), closedDays: [] },
  "one-world": { open: h(9), close: h(21), closedDays: [] },
  amnh: { open: h(10), close: h(17, 30), closedDays: [] },
  "times-square": open247,
  "grand-central": { open: h(5, 15), close: h(23, 59), closedDays: [] },
  moma: { open: h(10, 30), close: h(17, 30), closedDays: [] },
  rockefeller: { open: h(7), close: h(23, 59), closedDays: [] },
  "ellis-island": { open: h(9), close: h(17), closedDays: [], caveat: "Same ferry as the Statue" },
  broadway: { open: h(14), close: h(22, 30), closedDays: [1], caveat: "Most shows go dark Monday" },
  summit: { open: h(9), close: h(22), closedDays: [] },
  edge: { open: h(10), close: h(22), closedDays: [] },
  "chelsea-market": { open: h(8), close: h(22), closedDays: [] },
  "st-patricks": { open: h(6, 30), close: h(20, 45), closedDays: [] },
  "bk-heights": open247,
  dumbo: open247,
  intrepid: { open: h(10), close: h(17), closedDays: [] },
  "bryant-park": open247,
  nypl: { open: h(10), close: h(18), closedDays: [0] },
  "fifth-ave": { open: h(10), close: h(20), closedDays: [] },
  "wall-street": open247,
  "si-ferry": open247,
  oculus: { open: h(6), close: h(23, 59), closedDays: [] },
  chinatown: { open: h(10), close: h(22), closedDays: [] },
  soho: { open: h(11), close: h(20), closedDays: [] },
  "washington-sq": open247,
  frick: { open: h(10), close: h(18), closedDays: [1, 2] },
  guggenheim: { open: h(11), close: h(18), closedDays: [4] },
  whitney: { open: h(10, 30), close: h(18), closedDays: [3] },
  tenement: { open: h(10), close: h(18), closedDays: [], caveat: "Guided tours only — book ahead" },
  bbg: { open: h(10), close: h(18), closedDays: [1] },
  "prospect-park": open247,
  "coney-island": { open: h(11), close: h(20), closedDays: [], caveat: "Rides run spring–fall only" },
  "yankee-stadium": { open: h(11), close: h(22), closedDays: [], caveat: "Game days or tour times only" },
  cloisters: { open: h(10), close: h(17), closedDays: [3] },
  "roosevelt-tram": { open: h(6), close: h(23, 59), closedDays: [] },
  flatiron: open247,
  "union-square": open247,
  "radio-city": { open: h(9, 30), close: h(17), closedDays: [], caveat: "Tours subject to events" },
  msg: { open: h(10), close: h(18), closedDays: [], caveat: "Tours subject to events" },
  mcny: { open: h(10), close: h(17), closedDays: [1, 2] },
  "lincoln-center": { open: h(10), close: h(22), closedDays: [] },
  "battery-park": open247,
  "little-island": { open: h(6), close: h(23), closedDays: [] },
};

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function hoursFor(id: string): OpeningHours {
  return ATTRACTION_HOURS[id] ?? open247;
}

/** Is this sight open on the given weekday (0 = Sunday)? */
export function isOpenOnWeekday(id: string, weekday: number): boolean {
  return !hoursFor(id).closedDays.includes(weekday);
}

function clock(mins: number): string {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const hh = h24 % 12 === 0 ? 12 : h24 % 12;
  return m ? `${hh}:${m.toString().padStart(2, "0")} ${suffix}` : `${hh} ${suffix}`;
}

/** "10 AM – 5 PM · Closed Wed" */
export function formatOpeningHours(id: string): string {
  const hrs = hoursFor(id);
  if (hrs.alwaysOpen) return "Open daily, all day";
  const range = `${clock(hrs.open)} – ${clock(hrs.close)}`;
  if (!hrs.closedDays.length) return `${range} daily`;
  return `${range} · Closed ${hrs.closedDays.map((d) => WEEKDAY_SHORT[d]).join(" & ")}`;
}
