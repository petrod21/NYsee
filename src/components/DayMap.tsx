import { useEffect, useRef, useState } from "react";
import { ImageOff, Minus, Plus, RotateCcw } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { Button } from "@/components/ui/button";
import { formatRange, hoursFor, openRangeOn, type Attraction } from "@/data/attractions";
import type { LatLng } from "@/lib/itinerary";

interface Props {
  hotel: LatLng;
  stops: Attraction[];
  label: string;
  weekday: number | null;
}

const fmt = (p: LatLng) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
const MAP_WIDTH = 640;
const MAP_HEIGHT = 360;
const MAP_PADDING = 64;

function worldPoint(point: LatLng) {
  const sinLat = Math.sin((point.lat * Math.PI) / 180);
  return {
    x: (point.lng + 180) / 360,
    y: 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI),
  };
}

function latFromWorldY(y: number) {
  return (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;
}

function mapViewport(points: LatLng[]) {
  const projected = points.map(worldPoint);
  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const availableWidth = MAP_WIDTH - MAP_PADDING * 2;
  const availableHeight = MAP_HEIGHT - MAP_PADDING * 2;
  const xZoom = Math.log2(availableWidth / Math.max((maxX - minX) * 256, 0.000001));
  const yZoom = Math.log2(availableHeight / Math.max((maxY - minY) * 256, 0.000001));
  const zoom = Math.max(9, Math.min(15, Math.floor(Math.min(xZoom, yZoom))));
  const centerWorld = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  const center = {
    lat: latFromWorldY(centerWorld.y),
    lng: centerWorld.x * 360 - 180,
  };
  const scale = 256 * 2 ** zoom;
  const position = (point: LatLng) => {
    const projectedPoint = worldPoint(point);
    return {
      x: 50 + ((projectedPoint.x - centerWorld.x) * scale * 100) / MAP_WIDTH,
      y: 50 + ((projectedPoint.y - centerWorld.y) * scale * 100) / MAP_HEIGHT,
    };
  };
  return { center, zoom, position };
}

function openingLabel(stop: Attraction, weekday: number | null) {
  if (stop.custom) return "Hours not listed";
  const hours = hoursFor(stop.id);
  if (hours.alwaysOpen) return "Open all day";
  if (weekday === null) return "See daily hours";
  const range = openRangeOn(stop.id, weekday);
  return range ? formatRange(range) : "Closed today";
}

type LabelBox = { x: number; y: number; width: number; height: number };

function MapHours({ hotel, stops, weekday, viewport }: {
  hotel: LatLng;
  stops: Attraction[];
  weekday: number | null;
  viewport: ReturnType<typeof mapViewport>;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ width: number; height: number; boxes: (LabelBox | null)[] } | null>(null);

  useEffect(() => {
    const element = layer.current;
    if (!element) return;
    const arrange = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      const dots = stops.map((stop) => {
        const p = viewport.position(stop);
        return { x: p.x * width / 100, y: p.y * height / 100 };
      });
      // Reserve the zoom toolbar and every map balloon (hotel + stops) before placing labels.
      // Google default markers are ~22x38 px at the 640px map width, tip at the point.
      const s = width / MAP_WIDTH;
      const hp = viewport.position(hotel);
      const pins = [{ x: hp.x * width / 100, y: hp.y * height / 100 }, ...dots];
      const occupied: LabelBox[] = [
        { x: width - 132, y: 0, width: 132, height: 52 },
        ...pins.map((p) => ({ x: p.x - 12 * s, y: p.y - 40 * s, width: 24 * s, height: 42 * s })),
      ];
      const overlaps = (a: LabelBox, b: LabelBox) =>
        a.x < b.x + b.width + 4 && a.x + a.width + 4 > b.x &&
        a.y < b.y + b.height + 4 && a.y + a.height + 4 > b.y;
      // Route path segments (hotel → stops → hotel), matching the static map request.
      const route = [...pins, pins[0]!];
      const segments = route.slice(1).map((b, i) => [route[i]!, b] as const);
      const crossesPath = (box: LabelBox) => {
        const pad = 3;
        const x0 = box.x - pad, x1 = box.x + box.width + pad;
        const y0 = box.y - pad, y1 = box.y + box.height + pad;
        return segments.some(([a, b]) => {
          // Liang–Barsky segment vs rectangle clip.
          const dx = b.x - a.x, dy = b.y - a.y;
          let t0 = 0, t1 = 1;
          const checks: [number, number][] = [[-dx, a.x - x0], [dx, x1 - a.x], [-dy, a.y - y0], [dy, y1 - a.y]];
          for (const [p, q] of checks) {
            if (p === 0) { if (q < 0) return false; continue; }
            const r = q / p;
            if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
            else { if (r < t0) return false; if (r < t1) t1 = r; }
          }
          return true;
        });
      };
      const labels = element.querySelectorAll<HTMLElement>("[data-map-hours]");
      const boxes = dots.map((dot, index) => {
        const label = labels[index];
        if (!label) return null;
        const w = label.offsetWidth;
        const h = label.offsetHeight;
        const search = (avoidPath: boolean) => {
          let best: LabelBox | null = null;
          let distance = Infinity;
          // Search all available slots, choosing the one closest to this stop.
          for (let y = 6; y <= height - h - 6; y += 4) {
            for (let x = 6; x <= width - w - 6; x += 4) {
              const box = { x, y, width: w, height: h };
              const score = (x + w / 2 - dot.x) ** 2 + (y + h / 2 - dot.y) ** 2;
              if (score >= distance || occupied.some((other) => overlaps(box, other))) continue;
              if (avoidPath && crossesPath(box)) continue;
              best = box;
              distance = score;
            }
          }
          return best;
        };
        // Prefer spots clear of the route; fall back only if none exist.
        const best = search(true) ?? search(false);
        if (best) occupied.push(best);
        return best;
      });
      setLayout({ width, height, boxes });
    };
    const observer = new ResizeObserver(arrange);
    observer.observe(element);
    element.querySelectorAll("[data-map-hours]").forEach((label) => observer.observe(label));
    arrange();
    return () => observer.disconnect();
  }, [hotel, stops, weekday, viewport]);

  return (
    <div ref={layer} className="pointer-events-none absolute inset-0">
      {layout && (
        <svg className="absolute inset-0 h-full w-full text-foreground" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden>
          {stops.map((stop, index) => {
            const box = layout.boxes[index];
            if (!box) return null;
            const dot = viewport.position(stop);
            const x = dot.x * layout.width / 100;
            const y = dot.y * layout.height / 100;
            return <line key={stop.id} x1={x} y1={y} x2={Math.max(box.x, Math.min(x, box.x + box.width))} y2={Math.max(box.y, Math.min(y, box.y + box.height))} stroke="currentColor" strokeWidth="1" />;
          })}
        </svg>
      )}
      {stops.map((stop, index) => {
        const dot = viewport.position(stop);
        const box = layout?.boxes[index];
        return (
          <div key={stop.id}>
            <span className="absolute z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-background" style={{ left: `${dot.x}%`, top: `${dot.y}%` }} />
            <span data-map-hours className="absolute z-10 w-max max-w-[calc(100%-12px)] border border-border bg-background px-1.5 py-1 text-[10px] font-bold leading-tight text-foreground shadow-sm sm:text-xs" style={{ left: box?.x ?? 0, top: box?.y ?? 0, visibility: box ? "visible" : "hidden" }}>
              {index + 1} · {openingLabel(stop, weekday)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Overview map of a day's loop, served through our own server so it works everywhere. */
export function DayMap({ hotel, stops, label, weekday }: Props) {
  const [failed, setFailed] = useState(false);
  if (stops.length === 0) return null;

  if (failed) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 border-2 border-border bg-secondary text-muted-foreground">
        <ImageOff className="h-5 w-5" />
        <p className="label-caps">Map unavailable</p>
      </div>
    );
  }

  const viewport = mapViewport([hotel, ...stops]);
  const params = new URLSearchParams({
    hotel: fmt(hotel),
    center: fmt(viewport.center),
    zoom: String(viewport.zoom),
  });
  stops.forEach((s) => params.append("stop", fmt(s)));

  return (
    <div className="relative aspect-video w-full overflow-hidden border-2 border-border bg-secondary">
      <TransformWrapper
        minScale={1}
        maxScale={5}
        centerOnInit
        centerZoomedOut
        limitToBounds
        wheel={{ step: 0.12 }}
        pinch={{ step: 4 }}
        doubleClick={{ mode: "toggle", step: 1.2 }}
        panning={{ velocityDisabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperClass="!h-full !w-full cursor-grab touch-none active:cursor-grabbing"
              contentClass="!h-full !w-full"
            >
              <img
                src={`/api/public/static-map?${params.toString()}`}
                alt={`Zoomable map of ${label}`}
                className="h-full w-full select-none object-cover"
                loading="lazy"
                draggable={false}
                onError={() => setFailed(true)}
              />
              <MapHours hotel={hotel} stops={stops} weekday={weekday} viewport={viewport} />
            </TransformComponent>

            <div
              className="absolute right-2 top-2 z-10 flex overflow-hidden border border-border bg-background shadow-sm"
              role="group"
              aria-label="Map zoom controls"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-none border-r border-border"
                aria-label="Zoom in"
                title="Zoom in"
                onClick={() => zoomIn()}
              >
                <Plus />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-none border-r border-border"
                aria-label="Zoom out"
                title="Zoom out"
                onClick={() => zoomOut()}
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-none"
                aria-label="Reset map"
                title="Reset map"
                onClick={() => resetTransform()}
              >
                <RotateCcw />
              </Button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
