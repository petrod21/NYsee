/**
 * Terms of Use acceptance record.
 *
 * Stored in the browser's own storage on the traveler's device (same approach as
 * saved trips), so no account, email address, or password is collected.
 */

export const TERMS_VERSION = "2026-10-29";
export const TERMS_EFFECTIVE_DATE = "October 29, 2026";
export const TERMS_LAST_UPDATED = "October 29, 2026";

export interface TermsAcceptance {
  /** Which version of the agreement was accepted. */
  version: string;
  /** When the traveler tapped "I Agree & Continue" (ISO date/time). */
  acceptedAt: string;
  status: "accepted";
}

const KEY = "nyc-transit-planner:terms-acceptance";

export function loadTermsAcceptance(): TermsAcceptance | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TermsAcceptance> | null;
    if (!parsed || typeof parsed.version !== "string" || typeof parsed.acceptedAt !== "string") {
      return null;
    }
    return { version: parsed.version, acceptedAt: parsed.acceptedAt, status: "accepted" };
  } catch {
    return null;
  }
}

/** True only when the stored record matches the version currently published. */
export function hasAcceptedCurrentTerms(
  record: TermsAcceptance | null,
): record is TermsAcceptance {
  return !!record && record.status === "accepted" && record.version === TERMS_VERSION;
}

/** Records acceptance of the current Terms version, with date/time and status. */
export function saveTermsAcceptance(): TermsAcceptance {
  const record: TermsAcceptance = {
    version: TERMS_VERSION,
    acceptedAt: new Date().toISOString(),
    status: "accepted",
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(record));
  }
  return record;
}

/** Forgets acceptance, so the traveler is asked again on the next launch. */
export function clearTermsAcceptance() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
