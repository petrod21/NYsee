import { useState } from "react";

import type { LatLng } from "@/lib/itinerary";

interface Props {
  hotel: LatLng;
  stops: LatLng[];
  label: string;
}

/** Static overview map of a day's loop, rendered with the browser Maps key. */
export function DayMap({ hotel, stops, label }: Props) {
  const [failed, setFailed] = useState(false);
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
  const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as
    | string
    | undefined;
  if (!key || failed || stops.length === 0) return null;

  const fmt = (p: LatLng) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
  const params = new URLSearchParams({
    size: "640x360",
    scale: "2",
    maptype: "roadmap",
    key,
  });
  if (channel) params.set("channel", channel);
  params.append("style", "feature:poi|visibility:off");
  params.append("style", "feature:transit.station|element:labels|visibility:off");
  params.append("style", "saturation:-70");
  params.append("markers", `color:0x111111|label:H|${fmt(hotel)}`);
  stops.forEach((s, i) => {
    params.append("markers", `color:0xEE352E|label:${i < 9 ? i + 1 : ""}|${fmt(s)}`);
  });
  const path = [hotel, ...stops, hotel].map(fmt).join("|");
  params.append("path", `color:0x111111ff|weight:3|${path}`);

  return (
    <img
      src={`https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`}
      alt={`Map of ${label}`}
      className="aspect-video w-full border-2 border-border object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
