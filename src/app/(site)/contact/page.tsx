import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, HOURS, SITE, SOCIAL, directionsUrl } from "@/lib/site";
import { restaurantJsonLd } from "@/lib/structured-data";
import { MapEmbed } from "@/components/contact/map-embed";

export const metadata: Metadata = {
  title: "Contact",
  description: `Find Flames by the Indus. ${HOURS.label}.`,
  alternates: { canonical: "/contact" },
};

/** The small uppercase label each block of facts opens with. */
function FactLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs tracking-[0.2em] text-muted uppercase">{children}</p>;
}

export default function ContactPage() {
  const directions = directionsUrl();

  return (
    /* The carbon weave lives on the (site) layout now, not here. */
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />

      <section className="px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">Contact</p>
          <h1 className="mt-3 text-4xl text-ink md:text-5xl">Come and eat</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            {CONTACT.address ? `Find us in ${CONTACT.address.city}. ` : ""}
            {HOURS.label} — the grill and the chai station run continuously.
          </p>
        </div>
      </section>

      {/* ----- the facts, as one slim strip instead of a pile of boxes ----- */}
      <section aria-label="Contact details" data-reveal className="border-y border-line">
        {/* The email column gets extra width so the address never breaks mid-word. */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 px-5 md:px-8 lg:grid-cols-[1fr_1fr_1.4fr_0.9fr]">
          <div className="border-line py-6 lg:border-r lg:pr-8">
            <FactLabel>Hours</FactLabel>
            <p className="mt-2.5 flex items-baseline gap-2.5 font-light text-ink">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-orange"
              />
              {HOURS.label}
            </p>
          </div>

          <div className="border-t border-line py-6 lg:border-t-0 lg:border-r lg:px-8">
            <FactLabel>Phone</FactLabel>
            {CONTACT.phone ? (
              <p className="mt-2.5 font-light">
                <a
                  className="text-ink transition-colors hover:text-orange"
                  href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                >
                  {CONTACT.phone}
                </a>
              </p>
            ) : (
              <p className="mt-2.5 font-light text-muted">
                Coming soon — being finalised
              </p>
            )}
          </div>

          <div className="border-t border-line py-6 lg:border-t-0 lg:border-r lg:px-8">
            <FactLabel>Email</FactLabel>
            {CONTACT.email ? (
              <p className="mt-2.5 font-light break-words">
                <a
                  className="text-ink transition-colors hover:text-orange"
                  href={`mailto:${CONTACT.email}`}
                >
                  {CONTACT.email}
                </a>
              </p>
            ) : (
              <p className="mt-2.5 font-light text-muted">Coming soon</p>
            )}
          </div>

          <div className="border-t border-line py-6 lg:border-t-0 lg:pl-8">
            <FactLabel>Follow</FactLabel>
            <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-light">
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
            </p>
          </div>
        </div>
      </section>

      {/* ----- finding the door ----- */}
      <section data-reveal className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl items-stretch gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.2em] text-orange uppercase">Find us</p>

            {CONTACT.address ? (
              <>
                <h2 className="mt-4 text-3xl leading-snug text-ink md:text-4xl">
                  {CONTACT.address.street}
                </h2>
                <p className="mt-3 text-lg font-light text-muted">
                  {[CONTACT.address.city, CONTACT.address.region]
                    .filter(Boolean)
                    .join(", ")}
                  {CONTACT.address.postalCode ? ` ${CONTACT.address.postalCode}` : null}
                </p>

                {CONTACT.coordinates ? (
                  <p className="mt-2 text-xs tracking-wide text-muted tabular-nums">
                    {CONTACT.coordinates.lat.toFixed(4)}° N,{" "}
                    {CONTACT.coordinates.lng.toFixed(4)}° E
                  </p>
                ) : null}

                <p className="mt-6 max-w-md leading-relaxed text-muted">
                  The pin comes from the restaurant&apos;s own listing, so
                  directions land at our door — not a guess at the block.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {directions ? (
                    <a
                      href={directions}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-orange bg-orange px-6 py-3 text-sm text-white transition-colors hover:bg-orange-dark"
                    >
                      Get directions
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4 fill-none stroke-current stroke-[1.5]"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  ) : null}
                  {CONTACT.mapsUrl ? (
                    <a
                      href={CONTACT.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-1 py-3 text-sm text-muted underline underline-offset-4 transition-colors hover:text-orange"
                    >
                      Open in Google Maps
                    </a>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                The street address is being finalised. Nothing is shown in the
                meantime rather than a placeholder location, so no one is sent
                to the wrong place.
              </p>
            )}
          </div>

          {CONTACT.coordinates ? (
            <MapEmbed
              lat={CONTACT.coordinates.lat}
              lng={CONTACT.coordinates.lng}
              name={SITE.name}
              className="aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]"
            />
          ) : null}
        </div>
      </section>

      {/* ----- and the reason they came ----- */}
      <section data-reveal className="border-t border-line px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p className="max-w-lg leading-relaxed text-muted">
            Deciding before you set out? The full menu is online — every dish,
            with prices.
          </p>
          <Link
            href="/menu"
            className="border border-orange px-5 py-2.5 text-sm text-orange transition-colors hover:bg-orange hover:text-white"
          >
            See the menu
          </Link>
        </div>
      </section>
    </>
  );
}
