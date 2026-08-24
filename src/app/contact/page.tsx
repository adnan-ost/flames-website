import type { Metadata } from "next";
import { CONTACT, HOURS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Find Flames by the Indus. ${HOURS.label}.`,
  alternates: { canonical: "/contact" },
};

/**
 * LocalBusiness structured data is emitted only for facts we actually hold.
 * Google penalises structured data that contradicts the page, and a fabricated
 * address would do real harm to a real business, so address and telephone are
 * omitted entirely until supplied rather than filled with placeholders.
 */
function restaurantJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url: SITE.url,
    servesCuisine: "Pakistani",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    hasMenu: `${SITE.url}/menu`,
  };

  if (CONTACT.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    };
  }

  if (CONTACT.phone) data.telephone = CONTACT.phone;

  return data;
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />

      <section className="border-b border-line px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">Contact</p>
          <h1 className="mt-3 text-4xl font-light text-ink md:text-5xl">Come and eat</h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs tracking-[0.2em] text-muted uppercase">Hours</dt>
            <dd className="mt-2 text-lg font-light text-ink">{HOURS.label}</dd>
            <p className="mt-1 text-sm text-muted">
              The grill and the chai station run continuously.
            </p>
          </div>

          <div>
            <dt className="text-xs tracking-[0.2em] text-muted uppercase">Phone</dt>
            {CONTACT.phone ? (
              <dd className="mt-2 text-lg font-light">
                <a
                  className="text-ink transition-colors hover:text-orange"
                  href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                >
                  {CONTACT.phone}
                </a>
              </dd>
            ) : (
              <dd className="mt-2 text-lg font-light text-muted">Coming soon</dd>
            )}
          </div>

          <div>
            <dt className="text-xs tracking-[0.2em] text-muted uppercase">Address</dt>
            {CONTACT.address ? (
              <dd className="mt-2 leading-relaxed text-ink">
                {CONTACT.address.street}
                <br />
                {CONTACT.address.city}, {CONTACT.address.region}
                <br />
                {CONTACT.address.postalCode}
              </dd>
            ) : (
              <dd className="mt-2 text-lg font-light text-muted">Coming soon</dd>
            )}
          </div>
        </dl>

        {!CONTACT.address ? (
          <p className="mt-12 border border-line border-l-2 border-l-orange/60 bg-paper/40 p-4 text-sm text-muted">
            The map and directions appear here once the street address is supplied. Nothing is shown
            in the meantime rather than a placeholder location, so no one is sent to the wrong place.
          </p>
        ) : null}
      </div>
    </>
  );
}
