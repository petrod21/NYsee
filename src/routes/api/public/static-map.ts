import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const pointSchema = z
  .string()
  .regex(/^-?\d{1,3}(\.\d{1,6})?,-?\d{1,3}(\.\d{1,6})?$/);

const querySchema = z.object({
  hotel: pointSchema,
  stops: z.array(pointSchema).min(1).max(12),
});

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

function buildParams(hotel: string, stops: string[]) {
  const params = new URLSearchParams({
    size: "640x360",
    scale: "2",
    maptype: "roadmap",
  });
  params.append("style", "feature:poi|visibility:off");
  params.append("style", "feature:transit.station|element:labels|visibility:off");
  params.append("style", "saturation:-70");
  params.append("markers", `color:0x111111|label:H|${hotel}`);
  stops.forEach((s, i) => {
    params.append("markers", `color:0xEE352E|label:${i < 9 ? i + 1 : ""}|${s}`);
  });
  params.append("path", `color:0x111111ff|weight:3|${[hotel, ...stops, hotel].join("|")}`);
  return params;
}

export const Route = createFileRoute("/api/public/static-map")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = querySchema.safeParse({
          hotel: url.searchParams.get("hotel") ?? "",
          stops: url.searchParams.getAll("stop"),
        });
        if (!parsed.success) return new Response("Bad request", { status: 400 });

        const lovableKey = process.env["LOVABLE_API_KEY"];
        const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
        if (!lovableKey || !mapsKey) return new Response("Not configured", { status: 503 });

        const params = buildParams(parsed.data.hotel, parsed.data.stops);

        let upstream = await fetch(`${GATEWAY_URL}/maps/api/staticmap?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": mapsKey,
          },
        });

        if (!upstream.ok || !(upstream.headers.get("content-type") ?? "").startsWith("image/")) {
          console.error(
            `Static map gateway [${upstream.status}] ${upstream.headers.get("content-type")}: ${(await upstream.clone().text()).slice(0, 300)}`,
          );
          const direct = new URLSearchParams(params);
          direct.set("key", mapsKey);
          upstream = await fetch(`https://maps.googleapis.com/maps/api/staticmap?${direct.toString()}`);
        }

        if (!upstream.ok || !(upstream.headers.get("content-type") ?? "").startsWith("image/")) {
          console.error(`Static map failed [${upstream.status}]: ${await upstream.text()}`);
          return new Response("Map unavailable", { status: 502 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/png",
            "cache-control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
