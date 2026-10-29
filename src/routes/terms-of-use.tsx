import { createFileRoute, Link } from "@tanstack/react-router";

import { TERMS_EFFECTIVE_DATE, TERMS_LAST_UPDATED } from "@/lib/terms";

const TITLE = "Terms of Use — NYsee NYC Transit Planner";
const DESC =
  "The agreement between you and the NYsee developer: app purchase and license, travel-information accuracy, third-party map services, disclaimers, and your rights.";
const URL = "https://nysee.lovable.app/terms-of-use";

type Block = { t: "p"; text: string } | { t: "list"; items: string[] };
type Section = { n: number; title: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    n: 1,
    title: "About NYsee",
    blocks: [
      {
        t: "p",
        text: "NYsee (“App”) is a travel planning application designed to help users explore and plan trips, including trips to New York City. Features may include attraction searches, hotel searches, itinerary planning, saved trips, maps, transportation information, and links to third-party services.",
      },
      { t: "p", text: "The App is offered by:" },
      {
        t: "list",
        items: [
          "Developer: Daniel Petrosene",
          "Contact Email: circadiantravelllc@gmail.com",
          "NYsee Website: https://nysee.lovable.app/",
          "Terms of Use: https://nysee.lovable.app/terms-of-use",
          "Privacy Policy: https://nysee.lovable.app/privacy-policy",
        ],
      },
      {
        t: "p",
        text: "In these Terms, “Developer,” “we,” “us,” and “our” refer to the developer identified above. “You” and “your” refer to the person using the App.",
      },
    ],
  },
  {
    n: 2,
    title: "Acceptance of These Terms",
    blocks: [
      {
        t: "p",
        text: "By selecting the checkbox or button labeled “I Agree” or similar language, you acknowledge that you have read, understood, and agreed to these Terms of Use.",
      },
      { t: "p", text: "If you do not agree, you must not proceed into the App." },
      {
        t: "p",
        text: "You represent that you are legally capable of entering into a binding agreement under the laws applicable to you. If you are under the age of majority where you live, you may use the App only as permitted by applicable law and with any required parental or guardian consent.",
      },
      {
        t: "p",
        text: "Your acceptance of these Terms is separate from your purchase of the App through Google Play.",
      },
    ],
  },
  {
    n: 3,
    title: "App Purchase and Payment",
    blocks: [
      {
        t: "p",
        text: "NYsee is offered as a paid application through Google Play at an advertised purchase price of $2.99 USD, subject to applicable taxes, regional pricing, and any pricing changes displayed by Google Play.",
      },
      {
        t: "p",
        text: "Payment processing, purchase verification, and applicable refund requests are handled in accordance with Google Play's applicable terms and policies.",
      },
      {
        t: "p",
        text: "Purchasing the App grants you a personal, limited, non-exclusive, non-transferable, revocable license to use the App for your own lawful, non-commercial purposes, subject to these Terms and applicable law.",
      },
      {
        t: "p",
        text: "Unless expressly stated otherwise, the purchase is a one-time payment and does not constitute a subscription or promise of future paid services.",
      },
      {
        t: "p",
        text: "We do not independently promise refunds outside the rights and procedures provided by Google Play and applicable law. Nothing in these Terms limits any refund or other consumer rights that cannot legally be excluded.",
      },
    ],
  },
  {
    n: 4,
    title: "License and Permitted Use",
    blocks: [
      {
        t: "p",
        text: "Subject to these Terms, we grant you a limited license to install and use NYsee on compatible devices that you own or control, in accordance with the applicable Google Play terms.",
      },
      {
        t: "p",
        text: "You may not, except as permitted by law or with our written permission:",
      },
      {
        t: "list",
        items: [
          "Copy, reproduce, distribute, or commercially exploit the App.",
          "Sell, rent, sublicense, or transfer the App or your license to another person.",
          "Reverse engineer, decompile, or attempt to extract the source code of the App, except where applicable law expressly permits such activity.",
          "Modify or create derivative works of the App.",
          "Circumvent security features or attempt to gain unauthorized access to systems or data.",
          "Use the App for unlawful purposes or in a manner that interferes with other users or third-party services.",
        ],
      },
      {
        t: "p",
        text: "All rights not expressly granted to you are reserved by the Developer or the applicable rights holder.",
      },
    ],
  },
  {
    n: 5,
    title: "Travel Information and Accuracy Disclaimer",
    blocks: [
      {
        t: "p",
        text: "NYsee may display or help organize information about attractions, hotels, restaurants, transportation, routes, destinations, operating hours, prices, availability, and other travel-related matters.",
      },
      {
        t: "p",
        text: "We make no guarantee that information provided through the App is accurate, complete, current, reliable, or suitable for your particular needs.",
      },
      {
        t: "p",
        text: "Travel information may change without notice. Errors, omissions, outdated information, technical problems, or third-party data limitations may affect the information displayed.",
      },
      {
        t: "p",
        text: "You are responsible for independently verifying important details before making travel arrangements, purchases, reservations, or other decisions.",
      },
      {
        t: "p",
        text: "NYsee is a planning aid only. It does not replace your own judgment or verification of travel details.",
      },
    ],
  },
  {
    n: 6,
    title: "Maps, Transportation, and Third-Party Services",
    blocks: [
      {
        t: "p",
        text: "The App may use, link to, or display information supplied by third parties, including mapping services, transportation providers, hotel platforms, attraction websites, search providers, and other external services.",
      },
      {
        t: "p",
        text: "Third-party services and information are outside our control. We do not guarantee their availability, accuracy, security, reliability, pricing, or continued operation.",
      },
      {
        t: "p",
        text: "External links may take you to websites or applications governed by separate terms and privacy policies. Your use of those services is at your own discretion and risk.",
      },
      {
        t: "p",
        text: "We are not responsible for transactions, reservations, cancellations, refunds, disputes, service interruptions, or losses arising from your dealings with third parties, except to the extent responsibility cannot legally be excluded.",
      },
      {
        t: "p",
        text: "The inclusion of a third-party link does not necessarily constitute an endorsement or guarantee of that provider.",
      },
    ],
  },
  {
    n: 7,
    title: "Disclaimer of Warranties",
    blocks: [
      {
        t: "p",
        text: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE APP IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS.",
      },
      {
        t: "p",
        text: "To the maximum extent permitted by law, we disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement, as well as warranties that the App will be uninterrupted, error-free, secure, compatible with every device, or free of harmful components.",
      },
      {
        t: "p",
        text: "We do not warrant that the App will meet your particular requirements or that defects will always be corrected.",
      },
      {
        t: "p",
        text: "Nothing in this section excludes any express warranty we have made or any warranty or consumer right that cannot legally be excluded.",
      },
    ],
  },
  {
    n: 8,
    title: "Limitation of Liability",
    blocks: [
      {
        t: "p",
        text: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE DEVELOPER SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, LOST REVENUE, LOST DATA, LOST OPPORTUNITIES, TRAVEL DISRUPTIONS, OR OTHER INTANGIBLE LOSSES ARISING OUT OF OR RELATED TO YOUR USE OF, OR INABILITY TO USE, THE APP.",
      },
      {
        t: "p",
        text: "To the maximum extent permitted by law, our total aggregate liability for all claims arising out of or relating to the App or these Terms shall not exceed the greater of:",
      },
      {
        t: "list",
        items: [
          "(a) the amount you paid directly for the App during the twelve months preceding the event giving rise to the claim; or",
          "(b) US $10.",
        ],
      },
      {
        t: "p",
        text: "This limitation applies regardless of the legal theory on which a claim is based, including contract, tort, negligence, or another theory, to the extent permitted by law.",
      },
      {
        t: "p",
        text: "These limitations do not apply to liability that cannot legally be limited or excluded, including where applicable liability for fraud, willful misconduct, or other non-waivable claims.",
      },
      {
        t: "p",
        text: "Some jurisdictions do not permit certain exclusions or limitations of liability. In those jurisdictions, our liability is limited only to the extent permitted by applicable law.",
      },
    ],
  },
  {
    n: 9,
    title: "Assumption of Risk and Travel Decisions",
    blocks: [
      {
        t: "p",
        text: "You are responsible for your travel plans, bookings, transportation choices, personal safety, and decisions made using information provided by the App.",
      },
      {
        t: "p",
        text: "You should independently verify transportation schedules, route conditions, attraction hours, ticket requirements, hotel details, accessibility information, safety advisories, and other information that may affect your plans.",
      },
      {
        t: "p",
        text: "We are not responsible for missed connections, missed reservations, additional expenses, delays, injuries, losses, or other consequences arising from travel decisions made using the App, except to the extent caused by liability that cannot legally be excluded.",
      },
      {
        t: "p",
        text: "The App is not an emergency service. In an emergency, contact the appropriate local emergency services.",
      },
    ],
  },
  {
    n: 10,
    title: "Indemnification",
    blocks: [
      {
        t: "p",
        text: "To the extent permitted by applicable law, you agree to be responsible for claims, losses, liabilities, damages, and reasonable legal expenses incurred by the Developer arising from:",
      },
      {
        t: "list",
        items: [
          "Your unlawful use of the App.",
          "Your material violation of these Terms.",
          "Your infringement of another person's rights.",
          "Your misuse of the App or interference with its operation.",
        ],
      },
      {
        t: "p",
        text: "This obligation applies only to the extent the claim or loss results from your conduct. It does not require you to indemnify the Developer for the Developer's own negligence, willful misconduct, violation of law, or other liability where such indemnification is prohibited by applicable law.",
      },
      {
        t: "p",
        text: "We will provide notice of an indemnifiable claim when reasonably practicable. Any indemnification obligation remains subject to applicable law.",
      },
    ],
  },
  {
    n: 11,
    title: "Intellectual Property",
    blocks: [
      {
        t: "p",
        text: "The App, including its original software, design, branding, text, graphics, and other original content, is owned by or licensed to the Developer and is protected by applicable intellectual property laws.",
      },
      {
        t: "p",
        text: "You do not acquire ownership of the App by purchasing or downloading it.",
      },
      {
        t: "p",
        text: "Third-party trademarks, content, map data, photographs, listings, and other materials remain the property of their respective owners and may be subject to separate restrictions.",
      },
      {
        t: "p",
        text: "You may not use our branding, logos, or original content in a manner that suggests sponsorship, affiliation, or endorsement without our written permission.",
      },
    ],
  },
  {
    n: 12,
    title: "User Conduct and Saved Information",
    blocks: [
      {
        t: "p",
        text: "You agree to use the App lawfully and not to interfere with its functionality, security, or availability.",
      },
      {
        t: "p",
        text: "If the App allows you to create itineraries, save trips, or store other information, you are responsible for keeping your own copies of important information where appropriate.",
      },
      {
        t: "p",
        text: "Saved information may be lost or become unavailable because of device problems, software updates, reinstallation, storage limitations, or other technical issues. We do not guarantee permanent storage or recovery of saved trips or other information.",
      },
      {
        t: "p",
        text: "You should not rely on the App as your sole record of reservations, tickets, confirmations, or important travel details.",
      },
    ],
  },
  {
    n: 13,
    title: "Privacy",
    blocks: [
      { t: "p", text: "Your use of the App is also subject to our Privacy Policy, available at:" },
      { t: "p", text: "https://nysee.lovable.app/privacy-policy" },
      {
        t: "p",
        text: "The Privacy Policy explains how personal information and device data are collected, used, stored, and shared, as applicable.",
      },
      {
        t: "p",
        text: "If these Terms and the Privacy Policy address different subjects, each applies to its respective subject matter. Privacy practices are governed by the Privacy Policy and applicable privacy laws.",
      },
    ],
  },
  {
    n: 14,
    title: "Availability, Updates, and Discontinuation",
    blocks: [
      {
        t: "p",
        text: "We may modify, update, suspend, or discontinue some or all features of the App when reasonably necessary, including for maintenance, security, technical, business, or legal reasons.",
      },
      {
        t: "p",
        text: "We do not guarantee that every feature will remain available indefinitely or that the App will work on every device or operating system version.",
      },
      {
        t: "p",
        text: "We may release updates or require compatible software versions to continue using certain features.",
      },
      {
        t: "p",
        text: "Nothing in these Terms eliminates any rights you may have under applicable consumer protection laws or any obligation that cannot legally be excluded.",
      },
    ],
  },
  {
    n: 15,
    title: "Suspension and Termination",
    blocks: [
      {
        t: "p",
        text: "We may suspend or terminate your permission to use the App if you materially violate these Terms, misuse the App, or create a security or legal risk, subject to applicable law.",
      },
      { t: "p", text: "You may stop using the App at any time by uninstalling it." },
      {
        t: "p",
        text: "Termination does not automatically entitle you to a refund. Refund eligibility remains subject to Google Play's applicable policies and mandatory legal rights.",
      },
      {
        t: "p",
        text: "Sections that by their nature should continue after termination, including intellectual property, disclaimers, limitations of liability, indemnification to the extent enforceable, and dispute-related provisions, will survive to the extent permitted by law.",
      },
    ],
  },
  {
    n: 16,
    title: "Changes to These Terms",
    blocks: [
      {
        t: "p",
        text: "We may update these Terms from time to time to reflect changes in the App, applicable law, or our business practices.",
      },
      {
        t: "p",
        text: "The updated Terms will be posted at the applicable Terms of Use URL with a revised “Last Updated” date.",
      },
      {
        t: "p",
        text: "Where required by law, we will provide notice of material changes and obtain renewed acceptance before applying those changes to continued use of the App.",
      },
      {
        t: "p",
        text: "Your continued use of the App after an update does not constitute acceptance where affirmative consent is legally required.",
      },
    ],
  },
  {
    n: 17,
    title: "Governing Law and Disputes",
    blocks: [
      {
        t: "p",
        text: "These Terms are governed by the laws of the State of California, without regard to conflict-of-law principles, except where mandatory law provides otherwise.",
      },
      {
        t: "p",
        text: "Subject to applicable law, disputes relating to these Terms or the App shall be brought in the state or federal courts located in California, and the parties consent to the jurisdiction of those courts.",
      },
      {
        t: "p",
        text: "Nothing in this section deprives consumers of mandatory rights or protections available under the laws of their place of residence or other applicable law.",
      },
    ],
  },
  {
    n: 18,
    title: "Severability and No Waiver",
    blocks: [
      {
        t: "p",
        text: "If any provision of these Terms is held invalid or unenforceable, it shall be modified to the minimum extent necessary to make it enforceable, where legally permitted. If it cannot be made enforceable, it will be severed, and the remaining provisions will remain in effect.",
      },
      {
        t: "p",
        text: "Our failure to enforce a provision does not waive our right to enforce it later.",
      },
    ],
  },
  {
    n: 19,
    title: "Entire Agreement",
    blocks: [
      {
        t: "p",
        text: "These Terms, together with the Privacy Policy and any additional terms expressly applicable to particular features, constitute the agreement between you and the Developer regarding your use of the App, except for separate agreements or mandatory terms that apply by law.",
      },
      {
        t: "p",
        text: "If a provision conflicts with a mandatory Google Play requirement or applicable law, the applicable mandatory requirement or law will control.",
      },
    ],
  },
  {
    n: 20,
    title: "Contact Information",
    blocks: [
      { t: "p", text: "For questions about these Terms, contact:" },
      {
        t: "list",
        items: [
          "Developer: Daniel Petrosene",
          "Email: circadiantravelllc@gmail.com",
          "Website: https://nysee.lovable.app/",
        ],
      },
      {
        t: "p",
        text: "By selecting “I Agree,” you confirm that you have read and agree to these Terms of Use.",
      },
    ],
  },
];

export const Route = createFileRoute("/terms-of-use")({
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
  component: TermsOfUsePage,
});

const isUrl = (s: string) => /^https?:\/\//.test(s);

function RichText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        isUrl(part) ? (
          <a key={i} className="underline break-all" href={part} target="_blank" rel="noreferrer">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Section({ n, title, blocks }: Section) {
  return (
    <section className="space-y-3">
      <h2 className="display text-2xl">
        {n}. {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed">
        {blocks.map((block, i) =>
          block.t === "p" ? (
            <p key={i}>
              <RichText text={block.text} />
            </p>
          ) : (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {block.items.map((item, k) => (
                <li key={k}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          ),
        )}
      </div>
    </section>
  );
}

function TermsOfUsePage() {
  return (
    <main className="min-h-screen">
      <div className="stripe-bar h-2" />
      <div className="mx-auto max-w-3xl space-y-8 px-5 py-8">
        <header>
          <Link to="/" className="label-caps text-muted-foreground hover:underline">
            ← Back to planner
          </Link>
          <h1 className="display mt-4 text-4xl sm:text-5xl">Terms of Use</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Effective Date: {TERMS_EFFECTIVE_DATE} · Last Updated: {TERMS_LAST_UPDATED}
          </p>
          <p className="mt-4 text-sm leading-relaxed font-bold">
            PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING NYsee. BY SELECTING “I AGREE” AND
            CONTINUING INTO THE APP, YOU AGREE TO BE BOUND BY THESE TERMS.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            If you do not agree to these Terms of Use, do not select “I Agree” and do not use the
            app.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            The complete agreement is below. See also our{" "}
            <Link to="/privacy-policy" className="font-bold underline">
              Privacy Policy
            </Link>
            .
          </p>
        </header>

        {SECTIONS.map((section) => (
          <Section key={section.n} {...section} />
        ))}

        <footer className="border-t-2 pt-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>NYsee Terms of Use · Version {TERMS_EFFECTIVE_DATE}</span>
            <span aria-hidden>·</span>
            <Link to="/privacy-policy" className="font-bold hover:underline">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <Link to="/" className="font-bold hover:underline">
              Back to planner
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

