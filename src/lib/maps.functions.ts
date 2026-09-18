import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const latLngSchema = z.object({
  lat: z.number().min(40.45).max(40.95),
  lng: z.number().min(-74.3).max(-73.65),
});

export const searchHotelPlaces = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ input: z.string().trim().min(2).max(120), sessionToken: z.string().uuid() })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { autocompletePlaces } = await import("./maps.server");
    return autocompletePlaces(data.input, data.sessionToken);
  });

export const getHotelPlace = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({ placeId: z.string().min(3).max(300), sessionToken: z.string().uuid().optional() })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getPlace } = await import("./maps.server");
    return getPlace(data.placeId, data.sessionToken);
  });

export const getDayLegs = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ points: z.array(latLngSchema).min(2).max(14) }).parse(data))
  .handler(async ({ data }) => {
    const { computeLegs } = await import("./maps.server");
    return computeLegs(data.points);
  });
