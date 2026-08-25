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

/** Small uppercase label every card on this page opens with. */
function CardLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs tracking-[0.2em] text-muted uppercase">{children}</p>;
}

export default function ContactPage() {
  const directions = directionsUrl();

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
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            {CONTACT.address ? `Find us in ${CONTACT.address.city}. ` : ""}
            {HOURS.label} — the grill and the chai station run continuously.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid items-start gap-5 lg:grid-cols-5">
          {/* ----- visit: the reason most people open this page ----- */}
          <section
            className="border border-line bg-paper/50 p-6 md:p-8 lg:col-span-3"
            style={{ borderRadius: "var(--brand-radius)" }}
            aria-labelledby="visit-label"
          >
            <CardLabel>
              <span id="visit-label">Visit</span>
            </CardLabel>

            {CONTACT.address ? (
              <>
                <p className="mt-4 text-2xl font-light leading-snug text-ink md:text-3xl">
                  {CONTACT.address.street}
                  <br />
                  {[CONTACT.address.city, CONTACT.address.region]
                    .filter(Boolean)
                    .join(", ")}
                  {CONTACT.address.postalCode ? ` ${CONTACT.address.postalCode}` : null}
                </p>

                {CONTACT.coordinates ? (
                  <p className="mt-3 text-xs tracking-wide text-muted tabular-nums">
                    {CONTACT.coordinates.lat.toFixed(4)}° N,{" "}
                    {CONTACT.coordinates.lng.toFixed(4)}° E
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {directions ? (
                    <a
                      href={directions}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-orange bg-orange px-5 py-2.5 text-sm text-white transition-colors hover:bg-orange-dark"
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
                      className="px-1 py-2.5 text-sm text-muted underline underline-offset-4 transition-colors hover:text-orange"
                    >
                      Open in Google Maps
                    </a>
                  ) : null}
                </div>

                {CONTACT.coordinates ? (
                  <MapEmbed
                    lat={CONTACT.coordinates.lat}
                    lng={CONTACT.coordinates.lng}
                    name={SITE.name}
                  />
                ) : null}
              </>
            ) : (
              <p className="mt-4 leading-relaxed text-muted">
                The street address is being finalised. Nothing is shown in the
                meantime rather than a placeholder location, so no one is sent to
                the wrong place.
              </p>
            )}
          </section>

          {/* ----- the quick facts rail ----- */}
          <div className="grid gap-5 lg:col-span-2">
            <section
              className="border border-line bg-paper/50 p-6"
              style={{ borderRadius: "var(--brand-radius)" }}
              aria-labelledby="hours-label"
            >
              <CardLabel>
                <span id="hours-label">Hours</span>
              </CardLabel>
              <p className="mt-3 flex items-baseline gap-2.5 text-lg font-light text-ink">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-orange"
                />
                {HOURS.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Breakfast, BBQ and chai — whenever the craving lands.
              </p>
            </section>

            <section
              className="border border-line bg-paper/50 p-6"
              style={{ borderRadius: "var(--brand-radius)" }}
              aria-labelledby="phone-label"
            >
              <CardLabel>
                <span id="phone-label">Phone</span>
              </CardLabel>
              {CONTACT.phone ? (
                <p className="mt-3 text-lg font-light">
                  <a
                    className="text-ink transition-colors hover:text-orange"
                    href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                  >
                    {CONTACT.phone}
                  </a>
                </p>
              ) : (
                <>
                  <p className="mt-3 text-lg font-light text-muted">Coming soon</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    The number is being finalised. Until then, email us or come
                    by — we are always open.
                  </p>
                </>
              )}
            </section>

            {CONTACT.email ? (
              <section
                className="border border-line bg-paper/50 p-6"
                style={{ borderRadius: "var(--brand-radius)" }}
                aria-labelledby="email-label"
              >
                <CardLabel>
                  <span id="email-label">Email</span>
                </CardLabel>
                <p className="mt-3 text-lg font-light break-words">
                  <a
                    className="text-ink transition-colors hover:text-orange"
                    href={`mailto:${CONTACT.email}`}
                  >
                    {CONTACT.email}
                  </a>
                </p>
              </section>
            ) : null}

            {SOCIAL.instagram || SOCIAL.facebook ? (
              <section
                className="border border-line bg-paper/50 p-6"
                style={{ borderRadius: "var(--brand-radius)" }}
                aria-labelledby="follow-label"
              >
                <CardLabel>
                  <span id="follow-label">Follow</span>
                </CardLabel>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-lg font-light">
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
                </div>
              </section>
            ) : null}
          </div>
        </div>

        {/* ----- and the reason they came ----- */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
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
      </div>
    </>
  );
}
