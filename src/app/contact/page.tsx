import type { Metadata } from "next";
import { CONTACT, HOURS, SITE, SOCIAL } from "@/lib/site";

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
    const address: Record<string, unknown> = {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    };
    // Region and postal code were never supplied; emitting empty strings would
    // be worse than leaving them out.
    if (CONTACT.address.region) address.addressRegion = CONTACT.address.region;
    if (CONTACT.address.postalCode) address.postalCode = CONTACT.address.postalCode;
    data.address = address;
  }

  if (CONTACT.phone) data.telephone = CONTACT.phone;
  if (CONTACT.email) data.email = CONTACT.email;

  const sameAs = [SOCIAL.instagram, SOCIAL.facebook].filter(
    (url): url is string => Boolean(url),
  );
  if (sameAs.length) data.sameAs = sameAs;

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
          <h1 className="mt-3 text-4xl text-ink md:text-5xl">Come and eat</h1>
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
                {[CONTACT.address.city, CONTACT.address.region]
                  .filter(Boolean)
                  .join(", ")}
                {CONTACT.address.postalCode ? (
                  <>
                    <br />
                    {CONTACT.address.postalCode}
                  </>
                ) : null}
              </dd>
            ) : (
              <dd className="mt-2 text-lg font-light text-muted">Coming soon</dd>
            )}
          </div>
          {CONTACT.email ? (
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted uppercase">Email</dt>
              <dd className="mt-2 text-lg font-light">
                <a
                  className="text-ink transition-colors hover:text-orange"
                  href={`mailto:${CONTACT.email}`}
                >
                  {CONTACT.email}
                </a>
              </dd>
            </div>
          ) : null}

          {SOCIAL.instagram || SOCIAL.facebook ? (
            <div>
              <dt className="text-xs tracking-[0.2em] text-muted uppercase">Follow</dt>
              <dd className="mt-2 flex gap-4 text-lg font-light">
                {SOCIAL.instagram ? (
                  <a
                    className="text-ink transition-colors hover:text-orange"
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                ) : null}
                {SOCIAL.facebook ? (
                  <a
                    className="text-ink transition-colors hover:text-orange"
                    href={SOCIAL.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                ) : null}
              </dd>
            </div>
          ) : null}
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
