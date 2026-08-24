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
    street: "GF 13 to 15, Gulberg Arena, Gulberg Greens",
    city: "Islamabad",
    region: null,
    postalCode: null,
    country: "PK",
  } as {
    street: string;
    city: string;
    region: string | null;
    postalCode: string | null;
    country: string;
  } | null,
  email: "info@flamesbytheindus.com" as string | null,
} as const;

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
