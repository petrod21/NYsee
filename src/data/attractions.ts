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
 * Opening days & hours — published hours per weekday.
 * Minutes from midnight. Week index: 0 = Sunday … 6 = Saturday.
 * Hours shift for holidays and seasons; treat as a planning guide.
 * ------------------------------------------------------------------ */

export interface DayRange {
  open: number;
  close: number;
}

export interface OpeningHours {
  /** Public outdoor space with no meaningful closing day */
  alwaysOpen?: boolean | undefined;
  /** 0 = Sunday … 6 = Saturday; null means closed that day */
  week: (DayRange | null)[];
  /** Extra caveat shown to the traveller */
  caveat?: string | undefined;
}

const h = (hh: number, mm = 0) => hh * 60 + mm;

/**
 * Build a week from a default range, a list of closed weekdays and
 * per-weekday overrides.
 */
function hours(spec: {
  open: number;
  close: number;
  closed?: number[];
  per?: Partial<Record<number, [number, number]>>;
  caveat?: string | undefined;
  alwaysOpen?: boolean | undefined;
}): OpeningHours {
  const week: (DayRange | null)[] = [];
  for (let d = 0; d < 7; d++) {
    if (spec.closed?.includes(d)) {
      week.push(null);
      continue;
    }
    const o = spec.per?.[d];
    week.push(o ? { open: o[0], close: o[1] } : { open: spec.open, close: spec.close });
  }
  return { week, caveat: spec.caveat, alwaysOpen: spec.alwaysOpen };
}

/** Outdoor spaces: open every day, effectively all day. */
const open247 = (caveat?: string): OpeningHours =>
  hours({ open: h(6), close: h(23, 59), alwaysOpen: true, caveat });

export const ATTRACTION_HOURS: Record<string, OpeningHours> = {
  "central-park": open247("Paths open 6 AM – 1 AM"),
  // Closed Wednesdays; late Friday & Saturday
  "met-museum": hours({
    open: h(10),
    close: h(17),
    closed: [3],
    per: { 5: [h(10), h(21)], 6: [h(10), h(21)] },
  }),
  "empire-state": hours({ open: h(9), close: h(24), caveat: "Last elevator 11:15 PM" }),
  "top-of-the-rock": hours({ open: h(9), close: h(24), caveat: "Last elevator 11:10 PM" }),
  "statue-of-liberty": hours({
    open: h(9),
    close: h(17),
    caveat: "Ferry only — last boat leaves Battery Park about 3:30 PM, book ahead",
  }),
  // Museum closed Tuesdays; memorial plaza itself is open daily
  "911-memorial": hours({ open: h(9), close: h(19), closed: [2], caveat: "Memorial plaza open daily" }),
  "brooklyn-bridge": open247(),
  "high-line": hours({ open: h(7), close: h(22), caveat: "Closes 8 PM Dec–Mar" }),
  "one-world": hours({ open: h(9), close: h(21), caveat: "Last ticket 8 PM" }),
  amnh: hours({ open: h(10), close: h(17, 30), caveat: "Closed Thanksgiving & Christmas Day" }),
  "times-square": open247(),
  "grand-central": hours({ open: h(5, 15), close: h(26) }),
  // Daily 10:30–5:30, Saturdays until 7
  moma: hours({ open: h(10, 30), close: h(17, 30), per: { 6: [h(10, 30), h(19)] } }),
  rockefeller: open247("Plaza open daily; shops 10 AM – 8 PM"),
  "ellis-island": hours({ open: h(9), close: h(17), caveat: "Same ferry as the Statue" }),
  broadway: hours({
    open: h(19),
    close: h(22, 30),
    closed: [1],
    per: { 3: [h(14), h(22, 30)], 6: [h(14), h(22, 30)], 0: [h(15), h(20)] },
    caveat: "Most shows are dark Monday; matinees Wed, Sat & Sun",
  }),
  summit: hours({ open: h(9), close: h(22), caveat: "Last entry 9 PM" }),
  edge: hours({ open: h(10), close: h(22), caveat: "Winter hours 11 AM – 9 PM" }),
  // Mon–Sat 7 AM, Sunday 8 AM
  "chelsea-market": hours({ open: h(7), close: h(22), per: { 0: [h(8), h(22)] } }),
  "st-patricks": hours({ open: h(6, 30), close: h(20, 45), caveat: "Quiet hours during Mass" }),
  "bk-heights": open247(),
  dumbo: open247(),
  intrepid: hours({ open: h(10), close: h(17), caveat: "Open to 6 PM in summer; last entry 1h before close" }),
  "bryant-park": open247("7 AM – 10 PM; winter village Nov–Mar"),
  // Schwarzman building: closed Sundays, late Thursday
  nypl: hours({ open: h(10), close: h(18), closed: [0], per: { 4: [h(10), h(20)] } }),
  "fifth-ave": hours({ open: h(10), close: h(20), per: { 0: [h(11), h(19)] } }),
  "wall-street": open247("Charging Bull is outdoors; exchange floor is closed to the public"),
  "si-ferry": open247("Runs 24/7, every 15–30 min"),
  oculus: hours({ open: h(7), close: h(23), caveat: "Shops 10 AM – 9 PM, Sunday 11 AM – 7 PM" }),
  chinatown: hours({ open: h(10), close: h(22) }),
  soho: hours({ open: h(11), close: h(20), per: { 0: [h(12), h(19)] } }),
  "washington-sq": open247(),
  // Reopened on Fifth Avenue: closed Tuesdays, late Friday
  frick: hours({ open: h(10), close: h(18), closed: [2], per: { 5: [h(10), h(21)] } }),
  // Closed Thursdays, late Saturday
  guggenheim: hours({ open: h(11), close: h(18), closed: [4], per: { 6: [h(11), h(20)] } }),
  // Closed Tuesdays, late Friday
  whitney: hours({ open: h(10, 30), close: h(18), closed: [2], per: { 5: [h(10, 30), h(22)] } }),
  tenement: hours({
    open: h(10),
    close: h(18),
    per: { 4: [h(10), h(20, 30)] },
    caveat: "Guided tours only — book a time slot ahead",
  }),
  bbg: hours({ open: h(10), close: h(18), closed: [1], caveat: "Closes 4:30 PM Nov–Feb" }),
  "prospect-park": open247("5 AM – 1 AM"),
  "coney-island": hours({
    open: h(11),
    close: h(20),
    caveat: "Boardwalk open all year; Luna Park rides run Apr–Oct, weekends in shoulder season",
  }),
  "yankee-stadium": hours({
    open: h(11),
    close: h(22),
    caveat: "Game days only, or pre-booked stadium tours (typically noon–1:40 PM)",
  }),
  // Closed Wednesdays
  cloisters: hours({ open: h(10), close: h(17), closed: [3] }),
  "roosevelt-tram": hours({ open: h(6), close: h(26), caveat: "Runs to 3:30 AM Fri & Sat" }),
  flatiron: open247(),
  "union-square": open247("Greenmarket Mon, Wed, Fri & Sat 8 AM – 6 PM"),
  "radio-city": hours({ open: h(9, 30), close: h(17), caveat: "Stage Door Tours; times shift on show days" }),
  msg: hours({ open: h(9, 30), close: h(18), caveat: "All Access Tours; cancelled on some event days" }),
  // Closed Mondays & Tuesdays
  mcny: hours({ open: h(10), close: h(17), closed: [1, 2] }),
  "lincoln-center": hours({ open: h(10), close: h(22), caveat: "Plaza open daily; performances ticketed" }),
  "battery-park": open247(),
  "little-island": hours({ open: h(6), close: h(23), caveat: "Free timed entry required midday in summer" }),
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
  return ATTRACTION_HOURS[id] ?? open247();
}

/** Opening range on a weekday (0 = Sunday), or null when closed. */
export function openRangeOn(id: string, weekday: number): DayRange | null {
  return hoursFor(id).week[weekday] ?? null;
}

/** Is this sight open on the given weekday (0 = Sunday)? */
export function isOpenOnWeekday(id: string, weekday: number): boolean {
  return !!openRangeOn(id, weekday);
}

/** Weekdays this sight is closed. */
export function closedDaysFor(id: string): number[] {
  return [0, 1, 2, 3, 4, 5, 6].filter((d) => !isOpenOnWeekday(id, d));
}

function clock(mins: number): string {
  const wrapped = mins % (24 * 60);
  if (mins >= 24 * 60 && wrapped === 0) return "midnight";
  const h24 = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const hh = h24 % 12 === 0 ? 12 : h24 % 12;
  return m ? `${hh}:${m.toString().padStart(2, "0")} ${suffix}` : `${hh} ${suffix}`;
}

export function formatRange(r: DayRange): string {
  return `${clock(r.open)} – ${clock(r.close)}`;
}

/** Monday-first weekday order for display. */
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** "Tue–Sun 10 AM – 5 PM · Closed Mon" */
/** [1,2,4,0] → "Mon–Tue, Thu, Sun" */
function dayListLabel(days: number[]): string {
  const ordered = DISPLAY_ORDER.filter((d) => days.includes(d));
  const runs: number[][] = [];
  ordered.forEach((d) => {
    const last = runs[runs.length - 1];
    const prev = last?.[last.length - 1];
    if (last && prev !== undefined && DISPLAY_ORDER.indexOf(d) === DISPLAY_ORDER.indexOf(prev) + 1)
      last.push(d);
    else runs.push([d]);
  });
  return runs
    .map((run) =>
      run.length >= 3
        ? `${WEEKDAY_SHORT[run[0]!]}–${WEEKDAY_SHORT[run[run.length - 1]!]}`
        : run.map((d) => WEEKDAY_SHORT[d]).join(" & "),
    )
    .join(", ");
}

export function formatOpeningHours(id: string): string {
  const hrs = hoursFor(id);
  if (hrs.alwaysOpen) return "Open daily, all day";

  // Bucket weekdays by identical hours, keeping first-appearance order.
  const buckets: { label: string; days: number[] }[] = [];
  const closedDays: number[] = [];
  for (const d of DISPLAY_ORDER) {
    const r = hrs.week[d] ?? null;
    if (!r) {
      closedDays.push(d);
      continue;
    }
    const label = formatRange(r);
    const bucket = buckets.find((b) => b.label === label);
    if (bucket) bucket.days.push(d);
    else buckets.push({ label, days: [d] });
  }

  const parts =
    buckets.length === 1 && closedDays.length === 0
      ? [`${buckets[0]!.label} daily`]
      : buckets.map((b) => `${dayListLabel(b.days)} ${b.label}`);

  if (closedDays.length) {
    parts.push(`Closed ${closedDays.map((d) => WEEKDAY_SHORT[d]).join(" & ")}`);
  }
  return parts.join(" · ");
}
