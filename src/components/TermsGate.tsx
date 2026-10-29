import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubwayBullet } from "@/components/SubwayBullet";
import { cn } from "@/lib/utils";
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_VERSION,
  hasAcceptedCurrentTerms,
  loadTermsAcceptance,
  saveTermsAcceptance,
} from "@/lib/terms";

/**
 * Pages that stay reachable before acceptance, so the links on the
 * acceptance screen actually open the documents they point at.
 */
const OPEN_PATHS = ["/terms-of-use", "/privacy-policy"];

function isOpenPath(pathname: string) {
  return OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Blocks the app until the traveler accepts the current Terms of Use.
 * The record lives in this device's own browser storage.
 */
export function TermsGate({ children }: { children: ReactNode }) {
  const pathname = useLocation({ select: (l) => l.pathname });
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(hasAcceptedCurrentTerms(loadTermsAcceptance()));
    setReady(true);
  }, []);

  if (isOpenPath(pathname)) return <>{children}</>;
  if (!ready) return <GateSplash />;
  if (accepted) return <>{children}</>;

  return (
    <TermsAcceptanceScreen
      onAccept={() => {
        saveTermsAcceptance();
        setAccepted(true);
      }}
    />
  );
}

function GateSplash() {
  return (
    <main className="min-h-screen">
      <div className="stripe-bar h-2" />
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-5 py-8">
        <SubwayBullet label="N" size="lg" />
        <SubwayBullet label="Y" size="lg" color="blue" />
        <SubwayBullet label="C" size="lg" color="red" />
      </div>
    </main>
  );
}

function TermsAcceptanceScreen({ onAccept }: { onAccept: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const [declined, setDeclined] = useState(false);

  return (
    <main className="min-h-screen">
      <div className="stripe-bar h-2" />
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="flex items-center gap-2">
          <SubwayBullet label="N" size="lg" />
          <SubwayBullet label="Y" size="lg" color="blue" />
          <SubwayBullet label="C" size="lg" color="red" />
        </div>
        <h1 className="display mt-4 text-4xl sm:text-5xl">NYsee</h1>
        <p className="mt-3 text-sm leading-relaxed">
          Before you plan a trip, please read the Terms of Use and tell us you accept them.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Terms version {TERMS_VERSION} · Effective {TERMS_EFFECTIVE_DATE}
        </p>

        <div className="ticket-sm mt-6 p-4">
          <label htmlFor="terms-agree" className="flex cursor-pointer items-start gap-3">
            <input
              id="terms-agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setDeclined(false);
              }}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                agreed ? "bg-primary text-primary-foreground" : "bg-card",
              )}
            >
              {agreed && <Check className="h-4 w-4" strokeWidth={3} />}
            </span>
            <span className="text-sm font-bold">
              I have read and agree to the{" "}
              <Link to="/terms-of-use" className="underline">
                Terms of Use
              </Link>
              .
            </span>
          </label>

          <p className="mt-3 text-sm">
            Questions about your data? Read the{" "}
            <Link to="/privacy-policy" className="font-bold underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {declined && (
          <div className="mt-4 border-2 bg-secondary p-3 text-sm">
            You'll need to accept the Terms of Use before you can use NYsee. You can read the
            agreement and come back, or close the app.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="mta" size="lg" disabled={!agreed} onClick={onAccept}>
            I Agree &amp; Continue
          </Button>
          <Button variant="outline" size="lg" onClick={() => setDeclined(true)}>
            I don't agree
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Accepting saves a record on this device only: the Terms version, the date and time you
          agreed, and that you agreed. No name, email address, or password is collected.
        </p>
      </div>
    </main>
  );
}
