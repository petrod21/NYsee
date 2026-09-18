import { useEffect, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { toast } from "sonner";

import { searchHotelPlaces, getHotelPlace } from "@/lib/maps.functions";
import type { Hotel } from "@/lib/itinerary";
import type { PlaceSuggestion } from "@/lib/itinerary";

interface Props {
  value: Hotel | null;
  onChange: (hotel: Hotel | null) => void;
}

export function HotelSearch({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const id = ++requestRef.current;
    const t = setTimeout(async () => {
      try {
        if (!tokenRef.current) tokenRef.current = crypto.randomUUID();
        const results = await searchHotelPlaces({
          data: { input: query, sessionToken: tokenRef.current },
        });
        if (id === requestRef.current) {
          setSuggestions(results);
          setOpen(true);
        }
      } catch (err) {
        console.error(err);
        toast.error("Couldn't search for hotels right now.");
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  async function pick(s: PlaceSuggestion) {
    setBusy(true);
    setOpen(false);
    try {
      const token = tokenRef.current ?? undefined;
      const place = await getHotelPlace({ data: { placeId: s.placeId, sessionToken: token } });
      tokenRef.current = null;
      onChange(place);
      setQuery("");
      setSuggestions([]);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load that location. Try another.");
    } finally {
      setBusy(false);
    }
  }

  if (value) {
    return (
      <div className="ticket-sm flex items-start gap-3 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <MapPin className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{value.name}</p>
          <p className="truncate text-xs text-muted-foreground">{value.address}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-full p-1 hover:bg-secondary"
          aria-label="Change hotel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="ticket-sm flex items-center gap-2 px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Hotel name or address in NYC"
          className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          disabled={busy}
          autoComplete="off"
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul className="ticket absolute z-20 mt-2 w-full overflow-hidden">
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="flex w-full flex-col items-start gap-0.5 border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-secondary"
              >
                <span className="font-bold leading-tight">{s.main}</span>
                <span className="text-xs text-muted-foreground">{s.secondary}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
