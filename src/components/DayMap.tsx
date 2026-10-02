import { useState } from "react";
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
  const xZoom = Math.log2(availableWidth / Math.max((maxX - minX) * 256, 1));
  const yZoom = Math.log2(availableHeight / Math.max((maxY - minY) * 256, 1));
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
              {stops.map((stop, index) => {
                const position = viewport.position(stop);
                const alignLeft = position.x > 68;
                return (
                  <div
                    key={stop.id}
                    className={`pointer-events-none absolute z-10 flex -translate-y-1/2 items-center ${alignLeft ? "-translate-x-full flex-row-reverse" : ""}`}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent ring-2 ring-background" />
                    <span className={`${alignLeft ? "mr-2" : "ml-2"} whitespace-nowrap border border-border bg-background px-1.5 py-1 text-[10px] font-bold leading-none text-foreground shadow-sm sm:text-xs`}>
                      {index + 1} · {openingLabel(stop, weekday)}
                    </span>
                  </div>
                );
              })}
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
