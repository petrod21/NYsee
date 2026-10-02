import { useEffect, useRef, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Attraction } from "@/data/attractions";
import { ATTRACTIONS } from "@/data/attractions";
import { getHotelPlace, searchHotelPlaces } from "@/lib/maps.functions";
import type { PlaceSuggestion } from "@/lib/itinerary";

interface Props {
  onAdd: (attraction: Attraction) => void;
}

export function AttractionSearch({ onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const id = ++requestRef.current;
    const timer = setTimeout(async () => {
      try {
        if (!tokenRef.current) tokenRef.current = crypto.randomUUID();
        const results = await searchHotelPlaces({
          data: { input: query, sessionToken: tokenRef.current },
        });
        if (id === requestRef.current) {
          setSuggestions(results);
          setOpen(true);
        }
      } catch (error) {
        console.error(error);
        toast.error("Couldn't search NYC places right now.");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  async function pick(suggestion: PlaceSuggestion) {
    setBusy(true);
    setOpen(false);
    try {
      const token = tokenRef.current ?? undefined;
      const place = await getHotelPlace({
        data: { placeId: suggestion.placeId, sessionToken: token },
      });
      tokenRef.current = null;
      const nearest = ATTRACTIONS.reduce((best, candidate) => {
        const bestDistance = (best.lat - place.lat) ** 2 + (best.lng - place.lng) ** 2;
        const candidateDistance =
          (candidate.lat - place.lat) ** 2 + (candidate.lng - place.lng) ** 2;
        return candidateDistance < bestDistance ? candidate : best;
      }, ATTRACTIONS[0]!);
      onAdd({
        id: `custom-${suggestion.placeId}`,
        rank: 0,
        name: place.name,
        area: nearest.area,
        lat: place.lat,
        lng: place.lng,
        minutes: 90,
        lines: [],
        note: place.address,
        custom: true,
      });
      setQuery("");
      setSuggestions([]);
      toast.success(`${place.name} added.`);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't add that place. Try another.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mt-3">
      <div className="ticket-sm flex items-center gap-2 px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Attraction name or NYC address"
          aria-label="Find another attraction or address"
          className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          disabled={busy}
          autoComplete="off"
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul className="ticket absolute z-20 mt-2 w-full overflow-hidden">
          {suggestions.map((suggestion) => (
            <li key={suggestion.placeId}>
              <Button
                type="button"
                variant="ghost"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(suggestion)}
                className="h-auto w-full justify-start rounded-none border-b px-3 py-2.5 text-left last:border-b-0"
              >
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold leading-tight">{suggestion.main}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {suggestion.secondary}
                  </span>
                </span>
                <Plus className="h-4 w-4 shrink-0" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}