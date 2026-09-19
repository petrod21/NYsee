import { useState } from "react";
import { MapOff } from "lucide-react";

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
        <MapOff className="h-5 w-5" />
        <p className="label-caps">Map unavailable</p>
      </div>
    );
  }

  const params = new URLSearchParams({ hotel: fmt(hotel) });
  stops.forEach((s) => params.append("stop", fmt(s)));

  return (
    <img
      src={`/api/public/static-map?${params.toString()}`}
      alt={`Map of ${label}`}
      className="aspect-video w-full border-2 border-border object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
