import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { HotelSearch } from "@/components/HotelSearch";
import { SubwayBullet } from "@/components/SubwayBullet";
import { Button } from "@/components/ui/button";
import {
  AREAS,
  AREA_COLOR,
  ATTRACTIONS,
  formatOpeningHours,
  type Area,
} from "@/data/attractions";
import {
  addDays,
  buildItinerary,
  dateLabelForDay,
  daysBetween,
  PACE_LABEL,
  PACE_MINUTES,
  todayISO,
  type DayPace,
  type Hotel,
} from "@/lib/itinerary";
import { loadTrip, saveTrip } from "@/lib/trip-storage";
import { cn } from "@/lib/utils";

const TITLE = "NYC Transit Planner — Build your New York itinerary";
const DESC =
  "Enter your trip length and hotel, pick from Tripadvisor's top 50 New York City attractions, and get a day-by-day itinerary with subway lines and walking directions.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>(todayISO());
  const [endDate, setEndDate] = useState<string>(() => addDays(todayISO(), 2));
  const [paces, setPaces] = useState<DayPace[]>(["full", "full", "full"]);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [areaFilter, setAreaFilter] = useState<Area | "All">("All");
  const [hasSavedTrip, setHasSavedTrip] = useState(false);

  const days = daysBetween(startDate, endDate);

  useEffect(() => {
    const t = loadTrip();
    if (t) {
      setHasSavedTrip(true);
      const start = t.startDate ?? todayISO();
      setStartDate(start);
      setEndDate(t.endDate ?? addDays(start, Math.max(0, t.days - 1)));
      if (t.paces?.length) setPaces(t.paces);
      setHotel(t.hotel);
      setSelected(new Set(t.attractionIds));
    }
  }, []);

  // Keep one pace entry per date.
  useEffect(() => {
    setPaces((prev) =>
      Array.from({ length: days }, (_, i) => prev[i] ?? "full"),
    );
  }, [days]);

  function changeStart(value: string) {
    const next = value || todayISO();
    setStartDate(next);
    if (new Date(`${endDate}T12:00:00`) < new Date(`${next}T12:00:00`)) setEndDate(next);
  }

  function setPace(i: number, pace: DayPace) {
    setPaces((prev) => {
      const next = Array.from({ length: days }, (_, k) => prev[k] ?? "full");
      next[i] = pace;
      return next;
    });
  }

  const visible = useMemo(
    () => (areaFilter === "All" ? ATTRACTIONS : ATTRACTIONS.filter((a) => a.area === areaFilter)),
    [areaFilter],
  );

  const totalMinutes = useMemo(
    () => ATTRACTIONS.filter((a) => selected.has(a.id)).reduce((s, a) => s + a.minutes, 0),
    [selected],
  );

  const capacityMinutes = paces
    .slice(0, days)
    .reduce((s, p) => s + PACE_MINUTES[p], 0);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectTop(n: number) {
    setSelected(new Set(ATTRACTIONS.slice(0, n).map((a) => a.id)));
  }

  function build() {
    if (!hotel) {
      toast.error("Add your hotel first.");
      return;
    }
    if (selected.size === 0) {
      toast.error("Pick at least one attraction.");
      return;
    }
    const dayPaces = Array.from({ length: days }, (_, i) => paces[i] ?? "full");
    const chosen = ATTRACTIONS.filter((a) => selected.has(a.id));
    const plan = buildItinerary(hotel, chosen, days, startDate, dayPaces);
    const existing = loadTrip();
    saveTrip({
      days,
      startDate,
      endDate,
      paces: dayPaces,
      hotel,
      attractionIds: chosen.map((a) => a.id),
      plan,
      legs: existing?.hotel.lat === hotel.lat && existing?.hotel.lng === hotel.lng ? existing.legs : {},
      createdAt: Date.now(),
    });
    navigate({ to: "/itinerary" });
  }

  const overbooked = totalMinutes > capacityMinutes;
  const ready = !!hotel && selected.size > 0;

  return (
    <main className="min-h-screen pb-28">
      <div className="stripe-bar h-2" />
      <header className="border-b-2 px-5 pb-6 pt-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2">
            <SubwayBullet label="N" size="lg" />
            <SubwayBullet label="Y" size="lg" color="blue" />
            <SubwayBullet label="C" size="lg" color="red" />
          </div>
          <h1 className="display mt-4 text-5xl sm:text-6xl">
            Transit
            <br />
            Planner
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Pick from Tripadvisor's top 50 New York sights. We group them by neighborhood, build
            each day around your hotel, and map the subway and walking route between every stop.
          </p>
          {hasSavedTrip && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => navigate({ to: "/itinerary" })}
            >
              View saved itinerary <ArrowRight />
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 px-5 pt-8">
        {/* Step 1 */}
        <section>
          <StepHeading n={1} title="Trip length" />
          <div className="ticket-sm mt-3 flex items-center justify-between p-3">
            <button
              type="button"
              onClick={() => setDays((d) => Math.max(1, d - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 hover:bg-secondary"
              aria-label="Fewer days"
            >
              <Minus className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="display text-5xl">{days}</div>
              <div className="label-caps text-muted-foreground">{days === 1 ? "day" : "days"}</div>
            </div>
            <button
              type="button"
              onClick={() => setDays((d) => Math.min(10, d + 1))}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 hover:bg-secondary"
              aria-label="More days"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="ticket-sm mt-2 flex items-center justify-between gap-3 p-3">
            <label htmlFor="start-date" className="label-caps text-muted-foreground">
              First day of trip
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              min={todayISO()}
              onChange={(e) => setStartDate(e.target.value || todayISO())}
              className="rounded-md border-2 bg-background px-2 py-1.5 text-sm font-bold"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            So we never schedule a museum on the day it's closed.
          </p>
        </section>

        {/* Step 2 */}
        <section>
          <StepHeading n={2} title="Your hotel" />
          <div className="mt-3">
            <HotelSearch value={hotel} onChange={setHotel} />
          </div>
        </section>

        {/* Step 3 */}
        <section>
          <div className="flex items-end justify-between gap-3">
            <StepHeading n={3} title="Attractions" />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectTop(10)}
                className="label-caps rounded-full border-2 px-3 py-1.5 hover:bg-secondary"
              >
                Top 10
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="label-caps rounded-full border-2 px-3 py-1.5 hover:bg-secondary"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
            <AreaChip
              label="All"
              active={areaFilter === "All"}
              onClick={() => setAreaFilter("All")}
            />
            {AREAS.map((area) => (
              <AreaChip
                key={area}
                label={area}
                color={AREA_COLOR[area]}
                active={areaFilter === area}
                onClick={() => setAreaFilter(area)}
              />
            ))}
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {visible.map((a) => {
              const on = selected.has(a.id);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => toggle(a.id)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-center gap-3 border-2 p-3 text-left transition-colors",
                      on
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-ticket-sm)]"
                        : "bg-card hover:bg-secondary",
                    )}
                  >
                    <SubwayBullet
                      label={String(a.rank)}
                      color={on ? "ink" : AREA_COLOR[a.area]}
                      size="lg"
                      className={cn(on && "border-2 border-primary-foreground")}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold leading-tight">{a.name}</span>
                      <span
                        className={cn(
                          "mt-0.5 flex items-center gap-1.5 text-xs",
                          on ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        <span className="truncate">{a.area}</span>
                        <span>·</span>
                        <span className="shrink-0">{Math.round(a.minutes / 30) / 2}h</span>
                      </span>
                      <span
                        className={cn(
                          "block truncate text-[11px]",
                          on ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {formatOpeningHours(a.id)}
                      </span>
                      <span className="mt-1.5 flex gap-1">
                        {a.lines.slice(0, 6).map((l) => (
                          <SubwayBullet key={l} label={l} size="sm" />
                        ))}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                        on ? "border-primary-foreground bg-primary-foreground text-primary" : "",
                      )}
                    >
                      {on && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
          <div>
            <div className="font-black">
              {selected.size} {selected.size === 1 ? "stop" : "stops"}
            </div>
            <div className="text-xs text-muted-foreground">
              {selected.size ? `≈ ${perDay}h of sightseeing per day` : "Pick some attractions"}
            </div>
          </div>
          <Button variant="mta" size="lg" onClick={build} disabled={!ready}>
            Build itinerary <ArrowRight />
          </Button>
        </div>
      </div>
    </main>
  );
}

function StepHeading({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-black text-accent-foreground">
        {n}
      </span>
      <h2 className="display text-2xl">{title}</h2>
    </div>
  );
}

function AreaChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: keyof typeof CHIP;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary",
      )}
    >
      {color && <span className={cn("h-2.5 w-2.5 rounded-full", CHIP[color])} />}
      {label}
    </button>
  );
}

const CHIP = {
  red: "bg-line-red",
  blue: "bg-line-blue",
  yellow: "bg-line-yellow",
  green: "bg-line-green",
  orange: "bg-line-orange",
  purple: "bg-line-purple",
  lime: "bg-line-lime",
  brown: "bg-line-brown",
  gray: "bg-line-gray",
  ink: "bg-primary",
} as const;
