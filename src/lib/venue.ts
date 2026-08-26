/**
 * Photographs of the restaurant itself — the sign, the room, the tables.
 *
 * Distinct from dish photography, which is CMS content and lives in Sanity
 * (see `dishImageUrl` in `images.ts`). These are site furniture: they change
 * only when the room does, so they are committed webp under /public/venue and
 * served straight through Next's image optimizer.
 *
 * Shot by the owner on 25 and 26 August 2026 and converted from the HEIC
 * originals. Every frame here is of the real premises at Gulberg Arena — none
 * is stock, and none has been retouched beyond resizing.
 *
 * Naming the alt text here rather than at each call site keeps one honest
 * description per photograph, however many places it appears.
 */
export interface VenuePhoto {
  src: string;
  alt: string;
  /** Intrinsic aspect, as a Tailwind arbitrary value — keeps containers honest. */
  aspect: string;
}

export const VENUE = {
  /** The lit sign from the pavement — the thing to look for on arrival. */
  storefrontWide: {
    src: "/venue/storefront-wide.webp",
    alt: "The lit Flames by the Indus sign above the restaurant's glass frontage at night",
    aspect: "aspect-[2000/1176]",
  },
  /** Closer, warmer, with the dining room glowing through the glass. */
  storefrontNight: {
    src: "/venue/storefront-night.webp",
    alt: "The Flames by the Indus frontage at night, the dining room lit behind the glass",
    aspect: "aspect-[4/3]",
  },
  /** The same frontage from further back, across the street planting. */
  storefrontStreet: {
    src: "/venue/storefront-street.webp",
    alt: "Flames by the Indus seen from across the street after dark",
    aspect: "aspect-[4/3]",
  },
  /** The desk you meet first, with the mark on the wall behind it. */
  reception: {
    src: "/venue/reception.webp",
    alt: "The reception desk at Flames by the Indus, the flame mark on the wall behind it",
    aspect: "aspect-[4/3]",
  },
  /** The long Indus mural above the banquette. */
  diningMural: {
    src: "/venue/dining-mural.webp",
    alt: "Tables along the banquette beneath the lit Indus river mural",
    aspect: "aspect-[3/4]",
  },
  /** The mural again, after dark, with the rattan pendants lit. */
  diningMuralNight: {
    src: "/venue/dining-mural-night.webp",
    alt: "The dining room at night, rattan pendants lit above the river mural",
    aspect: "aspect-[3/4]",
  },
  /** Wider evening view taking in the painting on the far wall. */
  diningEvening: {
    src: "/venue/dining-evening.webp",
    alt: "The dining room in the evening, looking along the banquette",
    aspect: "aspect-[3/4]",
  },
  /** Pendant detail — the woven shades that light the room. */
  lanterns: {
    src: "/venue/lanterns.webp",
    alt: "Woven rattan pendant lights above a marble table at Flames by the Indus",
    aspect: "aspect-[3/4]",
  },
  /** Laid tables along the window, pendants overhead. */
  windowTables: {
    src: "/venue/window-tables.webp",
    alt: "Laid tables along the window at Flames by the Indus",
    aspect: "aspect-[4/3]",
  },
  /** The mural wall with the palm in front of it, tables laid for service. */
  muralPalm: {
    src: "/venue/mural-palm.webp",
    alt: "A palm beside the Indus mural, tables laid for service",
    aspect: "aspect-[4/3]",
  },
  /** The mustard-field painting above the corner booth. */
  boothPainting: {
    src: "/venue/booth-painting.webp",
    alt: "A painting of a mustard field above the corner booth at Flames by the Indus",
    aspect: "aspect-[4/3]",
  },
} satisfies Record<string, VenuePhoto>;
