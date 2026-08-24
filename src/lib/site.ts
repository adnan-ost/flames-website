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
  /** TODO: awaiting the street address. Contact map and LocalBusiness JSON-LD depend on it. */
  address: null as {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  } | null,
  email: null as string | null,
} as const;

/** Confirmed by the owner: the kitchen runs around the clock, every day. */
export const HOURS = {
  alwaysOpen: true,
  label: "Open 24 hours, 7 days a week",
} as const;

export const SOCIAL = {
  instagram: null as string | null,
  facebook: null as string | null,
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
