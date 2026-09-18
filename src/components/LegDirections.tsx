import { Footprints, TrainFront } from "lucide-react";

import { SubwayBullet } from "@/components/SubwayBullet";
import { formatDistance, formatDuration, type Leg } from "@/lib/itinerary";

interface Props {
  leg?: Leg;
  estimateMinutes: number;
  loading: boolean;
  error?: string;
}

export function LegDirections({ leg, estimateMinutes, loading, error }: Props) {
  if (loading || (!leg && !error)) {
    return (
      <div className="rail-line-dashed-wrapper py-3 pl-11">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Loading directions · ~{formatDuration(estimateMinutes)}
        </div>
      </div>
    );
  }

  if (!leg) {
    return (
      <div className="py-3 pl-11 text-xs text-muted-foreground">
        Directions unavailable · about {formatDuration(estimateMinutes)}
        {error ? <span className="block text-destructive">{error}</span> : null}
      </div>
    );
  }

  return (
    <div className="space-y-2 py-3 pl-11">
      <p className="label-caps text-muted-foreground">
        {formatDuration(leg.minutes)} · {formatDistance(leg.meters)}
      </p>
      <ol className="space-y-2">
        {leg.steps.map((step, i) =>
          step.kind === "walk" ? (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Footprints className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Walk <strong>{formatDuration(step.minutes)}</strong> ({formatDistance(step.meters)})
              </span>
            </li>
          ) : (
            <li key={i} className="flex items-start gap-2 text-sm">
              {step.vehicle === "SUBWAY" ? (
                <SubwayBullet
                  label={step.line}
                  hex={{ bg: step.color, text: step.textColor }}
                  size="md"
                />
              ) : (
                <span className="flex items-center gap-1">
                  <TrainFront className="h-4 w-4" />
                  <SubwayBullet label={step.line} hex={{ bg: step.color, text: step.textColor }} />
                </span>
              )}
              <span className="min-w-0">
                <span className="block">
                  <strong>{step.from}</strong> → <strong>{step.to}</strong>
                </span>
                <span className="block text-xs text-muted-foreground">
                  {step.headsign ? `toward ${step.headsign} · ` : ""}
                  {step.stops ? `${step.stops} stop${step.stops === 1 ? "" : "s"} · ` : ""}
                  {formatDuration(step.minutes)}
                </span>
              </span>
            </li>
          ),
        )}
      </ol>
    </div>
  );
}
