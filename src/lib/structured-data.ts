import { CONTACT, SITE, SOCIAL } from "./site";
import { PRICES } from "@/data/prices";

/**
 * Restaurant structured data, emitted on the home page (where Google builds
 * its picture of the business) and on /contact (where the facts are shown to
 * people). One function so the two can never disagree.
 *
 * Only facts we actually hold are emitted. Google penalises structured data
 * that contradicts the page, and a fabricated fact would do real harm to a
 * real business, so anything null in src/lib/site.ts — currently the phone
 * number — is omitted entirely rather than filled with a placeholder.
 */
export function restaurantJsonLd(): Record<string, unknown> {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url: SITE.url,
    servesCuisine: "Pakistani",
    // 00:00–23:59 on every day is how schema.org spells HOURS.alwaysOpen.
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
    priceRange: priceRange(),
  };

  if (CONTACT.address) {
    const address: Record<string, unknown> = {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressCountry: CONTACT.address.country,
    };
    // Region was never supplied; emitting an empty string would be worse than
    // leaving it out.
    if (CONTACT.address.region) address.addressRegion = CONTACT.address.region;
    if (CONTACT.address.postalCode) address.postalCode = CONTACT.address.postalCode;
    data.address = address;
  }

  if (CONTACT.mapsUrl) data.hasMap = CONTACT.mapsUrl;
  if (CONTACT.coordinates) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: CONTACT.coordinates.lat,
      longitude: CONTACT.coordinates.lng,
    };
  }
  if (CONTACT.phone) data.telephone = CONTACT.phone;
  if (CONTACT.email) data.email = CONTACT.email;

  const sameAs = [SOCIAL.instagram, SOCIAL.facebook].filter(
    (url): url is string => Boolean(url),
  );
  if (sameAs.length) data.sameAs = sameAs;

  return data;
}

/**
 * Derived from the owner-confirmed price map rather than typed by hand, so it
 * follows a price change instead of drifting. A staff edit in Sanity could put
 * a dish outside this range until the map catches up — acceptable slack for a
 * coarse range, unlike the per-dish prices themselves.
 */
function priceRange(): string {
  /*
   * Size prices count. A sized dish carries its SMALLER portion in `amount`,
   * so reading `amount` alone caps the range at the largest small portion and
   * hides every Full / 16-piece price above it. That understated the ceiling
   * by Rs 3,500 while the menu page rendered 16 dishes above it, which is
   * exactly the page/markup contradiction this file warns about.
   */
  const amounts = Object.values(PRICES).flatMap((price) =>
    price.sizes?.length ? price.sizes.map((size) => size.amount) : [price.amount],
  );
  const format = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
  return `${format(Math.min(...amounts))} – ${format(Math.max(...amounts))}`;
}
