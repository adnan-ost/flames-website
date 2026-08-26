/**
 * Single source of truth for restaurant facts used across pages, the footer,
 * and structured data.
 *
 * Anything still unknown is `null` rather than a plausible-looking placeholder,
 * so the UI can hide it and structured data can omit it. A fake address or
 * phone number is worse than a missing one: it ships to Google and to
 * customers as if it were true.
 */

export const SITE = {
  name: "Flames by the Indus",
  tagline: "Pakistani Menu",
  description:
    "Pakistani BBQ, karahi, biryani, chai and more at Flames by the Indus. Open 24 hours, every day.",
  url: "https://flamesbytheindus.com",
} as const;

export const CONTACT = {
  /** TODO: awaiting the final number. Until then the Call action stays disabled. */
  phone: null as string | null,
  /**
   * Supplied by the owner, August 2026. Region and postal code were not part of
   * what was supplied, so they stay null and are omitted from both the page and
   * the structured data rather than being inferred.
   */
  address: {
    /* Shop numbers dropped at the owner's request, 26 Aug 2026: the arena is
       what people navigate to, and the unit numbers only added noise. The map
       pin is unaffected — directions come from `coordinates` below. */
    street: "Gulberg Arena, Gulberg Greens",
    city: "Islamabad",
    region: null,
    /* From the restaurant's own Google listing, not inferred. */
    postalCode: "46000",
    country: "PK",
  } as {
    street: string;
    city: string;
    region: string | null;
    postalCode: string | null;
    country: string;
  } | null,
  email: "info@flamesbytheindus.com" as string | null,
  /**
   * The restaurant's own Google listing, addressed by its Maps CID so the link
   * stays stable — the long /maps/dir/ URL it came from carries session
   * parameters that expire.
   */
  mapsUrl: "https://maps.google.com/?cid=13619630918822370574" as string | null,
  /**
   * The pin itself, taken from the owner's Google Maps link. Not the map's
   * camera position, which sits ~1.2km north in that URL and would send people
   * to the wrong place.
   */
  coordinates: { lat: 33.6078959, lng: 73.1671237 } as {
    lat: number;
    lng: number;
  } | null,
} as const;

/**
 * A Google Maps directions link, or null if we have nowhere to send anyone.
 *
 * Prefers the restaurant's own map link when set. Otherwise builds a directions
 * query from the address the owner supplied — no invented coordinates.
 */
export function directionsUrl(): string | null {
  // Coordinates first: they route to the shop door rather than to whichever
  // building Google decides the street address means.
  if (CONTACT.coordinates) {
    const { lat, lng } = CONTACT.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`;
  }

  if (!CONTACT.address) return null;

  const destination = [
    CONTACT.address.street,
    CONTACT.address.city,
    CONTACT.address.region,
    CONTACT.address.postalCode,
    "Pakistan",
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/** Confirmed by the owner: the kitchen runs around the clock, every day. */
export const HOURS = {
  alwaysOpen: true,
  label: "Open 24 hours, 7 days a week",
} as const;

/**
 * Service charge and sales tax shown alongside menu prices.
 *
 * The restaurant is in Gulberg Greens, which is Islamabad Capital Territory, so
 * sales tax on restaurant services is federal (FBR) under the ICT (Tax on
 * Services) Ordinance 2001 — *not* the Punjab Revenue Authority regime. That
 * distinction matters: Punjab is separately raising its card rate from 5% to 8%
 * under its Finance Bill 2026-27, and those numbers do not apply here.
 *
 * ICT rates, verified for the 2026-27 year (1 Jul 2026 - 30 Jun 2027):
 *   - 5%  on debit/credit card, mobile wallet and QR payments
 *   - 15% on cash
 * The split is deliberate government policy to push digital payments.
 *
 * The 5% service charge is the restaurant's own, not a tax.
 *
 * These are statutory rates and they change with each Finance Act. Treat this
 * block as needing a check every July, and have the owner's accountant confirm
 * what the restaurant is actually registered to charge before launch.
 */
export const CHARGES = {
  /** The restaurant's own charge, not a government levy. */
  servicePercent: 5,
  tax: {
    cardPercent: 5,
    cashPercent: 15,
    /** Shown to customers so the rates are attributable. */
    jurisdiction: "Islamabad Capital Territory",
    authority: "FBR",
  },
} as const;

/** Supplied by the owner, August 2026. Emitted as `sameAs` in structured data. */
export const SOCIAL = {
  instagram: "https://www.instagram.com/flamesbytheindus/" as string | null,
  facebook: "https://www.facebook.com/flamesbytheindus/" as string | null,
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
