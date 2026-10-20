import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  addSavedTrip,
  deleteSavedTrip,
  loadAccountName,
  loadSavedTrips,
  loadTrip,
  saveAccountName,
  saveTrip,
  type StoredTrip,
} from "@/lib/trip-storage";

/** Device-only account name and saved-trip library. Nothing leaves this browser. */
export function MyTrips({ canSave }: { canSave: boolean }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tripName, setTripName] = useState("");
  const [trips, setTrips] = useState<StoredTrip[]>([]);

  useEffect(() => {
    setName(loadAccountName());
    setTrips(loadSavedTrips());
  }, []);

  const save = () => {
    const current = loadTrip();
    const label = tripName.trim();
    if (!current || !label) return;
    setTrips(addSavedTrip(label, current));
    setTripName("");
    toast.success(`Saved “${label}” on this device`);
  };

  const open = (t: StoredTrip) => {
    saveTrip(t.trip);
    navigate({ to: "/itinerary" });
    if (typeof window !== "undefined" && window.location.pathname === "/itinerary") window.location.reload();
  };

  return (
    <section className="border-2 border-border bg-background p-4">
      <label htmlFor="account-name" className="label-caps block text-muted-foreground">
        Your name
      </label>
      <input
        id="account-name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          saveAccountName(e.target.value);
        }}
        placeholder="e.g. Dan"
        className="mt-1 w-full border-2 border-border bg-background px-3 py-2 text-sm"
      />
      <h3 className="label-caps mt-4 text-muted-foreground">
        {name.trim() ? `${name.trim()}'s saved trips` : "Saved trips"}
      </h3>
      {canSave && (
        <div className="mt-2 flex gap-2">
          <input
            aria-label="Trip name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="Name this trip, e.g. Spring weekend"
            className="min-w-0 flex-1 border-2 border-border bg-background px-3 py-2 text-sm"
          />
          <Button onClick={save} disabled={!tripName.trim()}>
            <Save /> Save
          </Button>
        </div>
      )}
      {trips.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          No saved trips yet{canSave ? "." : " — build an itinerary, then save it here."}
        </p>
      ) : (
        <ul className="mt-2 divide-y-2 divide-border border-2 border-border">
          {trips.map((t) => (
            <li key={t.id} className="flex items-center gap-2 px-3 py-2">
              <button type="button" onClick={() => open(t)} className="min-w-0 flex-1 text-left hover:underline">
                <div className="truncate font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t.trip.days} {t.trip.days === 1 ? "day" : "days"} · {t.trip.attractionIds.length} stops
                  {t.trip.startDate ? ` · from ${t.trip.startDate}` : ""}
                </div>
              </button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${t.name}`}
                onClick={() => setTrips(deleteSavedTrip(t.id))}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-muted-foreground">Saved only on this device and browser.</p>
    </section>
  );
}
