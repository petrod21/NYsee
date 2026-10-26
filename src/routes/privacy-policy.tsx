import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const TITLE = "Privacy Policy — NYsee NYC Transit Planner";
const DESC =
  "How NYsee NYC Transit Planner handles trip details, place searches, saved trips, and third-party map services.";
const URL = "https://nysee.lovable.app/privacy-policy";
const UPDATED = "October 26, 2026";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PrivacyPolicyPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="display text-2xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <div className="stripe-bar h-2" />
      <div className="mx-auto max-w-3xl space-y-8 px-5 py-8">
        <header>
          <Link to="/" className="label-caps text-muted-foreground hover:underline">
            ← Back to planner
          </Link>
          <h1 className="display mt-4 text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {UPDATED}</p>
          <p className="mt-4 text-sm leading-relaxed">
            This policy explains how NYsee NYC Transit Planner (the "App"), operated by{" "}
            <strong>[LEGAL BUSINESS NAME]</strong> ("we", "us"), handles information when you use
            the App.
          </p>
        </header>

        <Section title="Information we collect">
          <p><strong>Trip details you enter.</strong> Your travel dates, the pace you choose for each day, your hotel, the attractions you pick, and any places or addresses you add.</p>
          <p><strong>Search text.</strong> What you type into the hotel and attraction search boxes, sent so we can suggest matching New York places.</p>
          <p><strong>Saved trips and display name.</strong> If you save a trip or enter a name for "My trips", that information is kept in your own browser's storage on your device. We do not offer online accounts, and we do not ask for an email address or password.</p>
          <p><strong>Location.</strong> The App does not request your device's GPS location. It uses the locations of your chosen hotel and attractions to build routes and maps.</p>
          <p><strong>Technical and error data.</strong> Like most websites, our hosting provider receives standard request information (such as IP address, browser type, and pages requested). If the App hits an error, technical error details and the page path may be reported to our hosting platform so problems can be fixed.</p>
        </Section>

        <Section title="How we use information">
          <ul className="list-disc space-y-1 pl-5">
            <li>To suggest hotels and places as you type.</li>
            <li>To build your day-by-day itinerary, opening-hours warnings, maps, and subway and walking directions.</li>
            <li>To remember your current and saved trips on your device.</li>
            <li>To keep the App running, secure, and free of errors.</li>
          </ul>
          <p>We do not use your information for advertising, and the App does not show ads.</p>
        </Section>

        <Section title="Information sharing">
          <p>We do not sell your information. To provide the App's features, we share limited information with service providers:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Google Maps Platform</strong> receives your search text and the coordinates of your hotel and stops to return place suggestions, place details, directions, and map images. These requests are sent from our servers through our hosting platform's connection service.</li>
            <li><strong>Our hosting provider (Lovable)</strong> hosts the App, processes requests, and may receive error reports.</li>
            <li><strong>Google Fonts</strong> delivers the App's typeface, so your browser connects to Google when pages load.</li>
          </ul>
          <p>We may also disclose information if required by law or to protect the rights and safety of users or others.</p>
        </Section>

        <Section title="Data retention">
          <p>Trips, saved trips, and your display name stay in your browser until you delete them in the App or clear your browser data. Because they are stored only on your device, they do not sync to other devices and we cannot recover them.</p>
          <p>Search text and route requests are passed to service providers to answer your request; those providers keep data according to their own policies. Hosting and error logs are kept for a limited period by our hosting provider.</p>
        </Section>

        <Section title="Security">
          <p>The App is served over encrypted HTTPS connections, and map service keys are kept on our servers rather than in your browser. No method of storage or transmission is completely secure, so we cannot guarantee absolute security. Anyone with access to your device and browser may be able to see trips saved there.</p>
        </Section>

        <Section title="Children's privacy">
          <p>The App is not directed to children under 13, and we do not knowingly collect personal information from children. If you believe a child has provided personal information, contact us and we will take appropriate steps.</p>
        </Section>

        <Section title="Third-party services">
          <p>The App relies on services that have their own privacy practices:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Google Maps Platform and Google Fonts — <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a></li>
            <li>Lovable hosting — <a className="underline" href="https://lovable.dev/privacy" target="_blank" rel="noreferrer">Lovable Privacy Policy</a></li>
          </ul>
          <p>When you tap a "Open in Google Maps" link, you leave the App and Google's own terms and privacy policy apply. Opening hours and attraction lists are planning guidance only.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>We may update this policy from time to time. Changes will be posted on this page with a new "Last updated" date.</p>
        </Section>

        <Section title="Contact us">
          <p>Questions about this policy or your information? Contact <strong>[LEGAL BUSINESS NAME]</strong> at <strong>[PRIVACY CONTACT EMAIL]</strong>.</p>
        </Section>
      </div>
    </main>
  );
}
