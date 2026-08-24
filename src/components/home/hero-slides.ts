/**
 * The five rotating hero compositions from the previous site, in the same order.
 *
 * These are dish *names*, not paths. The hero used to build /menu-items/ URLs
 * itself, which bypassed dishImageUrl() — the single image-resolution point
 * AGENTS.md requires — and meant the hero never used Sanity. Worse, those local
 * masters are gitignored, so the files do not exist in a deployment and every
 * hero image failed in production.
 *
 * This file deliberately has no "use client": the home page is a Server
 * Component and needs the real array. A plain constant exported from a client
 * module is not a value on the server, only a client reference.
 */
export const HERO_SLIDES = [
  { key: "coals", dishes: ["Chicken Tikka", "Beef Seekh Kebab", "Fish Tikka"] },
  { key: "karahi", dishes: ["Chicken Karahi", "Mutton Karahi", "Chicken White Karahi"] },
  { key: "rice", dishes: ["Chicken Biryani", "Mutton Kabuli Pulao", "Kashmiri Pulao"] },
  { key: "tandoor", dishes: ["Chicken Sajji", "Garlic Naan", "Behari Boti"] },
  { key: "breakfast", dishes: ["Halwa Puri", "Doodh Patti", "Channay"] },
] as const;

/** A slide once the page has resolved each dish name to an image URL. */
export interface HeroSlide {
  key: string;
  images: string[];
}
