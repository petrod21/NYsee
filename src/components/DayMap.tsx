import { useState } from "react";
import { ImageOff, Minus, Plus, RotateCcw } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { Button } from "@/components/ui/button";
import type { LatLng } from "@/lib/itinerary";

interface Props {
  hotel: LatLng;
  stops: LatLng[];
  label: string;
}

const fmt = (p: LatLng) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;

/** Overview map of a day's loop, served through our own server so it works everywhere. */
export function DayMap({ hotel, stops, label }: Props) {
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

  const params = new URLSearchParams({ hotel: fmt(hotel) });
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
