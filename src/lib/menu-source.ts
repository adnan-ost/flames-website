import { client } from "@/sanity/client";
import {
  MENU_SECTIONS,
  type MenuFilter,
  type MenuItem,
  type MenuSection,
} from "@/data/menu";

/**
 * Where the menu comes from.
 *
 * Sanity is the source of truth once the Studio is populated; `src/data/menu.ts`
 * is the fallback, exactly as AGENTS.md describes. This module is the only place
 * that decides between them, so every page gets the same answer.
 *
 * The fallback is not just for "Sanity isn't configured yet" — it also covers a
 * failed request, a malformed document and an empty dataset. A restaurant menu
 * that renders stale-but-correct beats one that renders an error.
 */

const MENU_QUERY = `*[_type == "menuSection" && defined(slug.current)] | order(order asc, title asc){
  "id": slug.current,
  filter,
  title,
  intro,
  "items": items[]->{
    name,
    description,
    "slug": slug.current,
    image,
    price
  }
}`;

/** How long a published edit takes to appear on the site. */
const REVALIDATE_SECONDS = 60;

const VALID_FILTERS = new Set<MenuFilter>([
  "coals",
  "kitchen",
  "starters",
  "breakfast",
  "chai",
  "sweets",
]);

/**
 * Local masters keyed by slug. A Sanity dish whose image failed to upload still
 * has a photograph to fall back on, because `dishImageUrl()` uses `image` when
 * `sanityImage` resolves to nothing.
 */
const LOCAL_IMAGE_BY_SLUG = new Map(
  MENU_SECTIONS.flatMap((section) =>
    section.items.map((item) => [item.slug, item.image] as const),
  ),
);

interface RawItem {
  name?: string | null;
  description?: string | null;
  slug?: string | null;
  image?: { asset?: { _ref?: string } } | null;
  price?: number | null;
}

interface RawSection {
  id?: string | null;
  filter?: string | null;
  title?: string | null;
  intro?: string | null;
  items?: (RawItem | null)[] | null;
}

function toItem(raw: RawItem | null): MenuItem | null {
  if (!raw?.name || !raw.slug) return null;

  const hasPrice =
    typeof raw.price === "number" && Number.isFinite(raw.price) && raw.price > 0;

  return {
    name: raw.name,
    description: raw.description ?? "",
    slug: raw.slug,
    image: LOCAL_IMAGE_BY_SLUG.get(raw.slug) ?? "",
    sanityImage: raw.image ?? null,
    price: hasPrice ? (raw.price as number) : null,
  };
}

function toSection(raw: RawSection): MenuSection | null {
  if (!raw.id || !raw.title) return null;
  if (!raw.filter || !VALID_FILTERS.has(raw.filter as MenuFilter)) return null;

  const items = (raw.items ?? []).map(toItem).filter((i): i is MenuItem => i !== null);
  if (items.length === 0) return null;

  return {
    id: raw.id,
    filter: raw.filter as MenuFilter,
    title: raw.title,
    intro: raw.intro ?? "",
    items,
  };
}

/**
 * The menu, from Sanity when it can be had and from the local file otherwise.
 * Never throws: any failure falls back rather than taking the page down.
 */
export async function getMenuSections(): Promise<MenuSection[]> {
  if (!client) return MENU_SECTIONS;

  try {
    const raw = await client.fetch<RawSection[]>(
      MENU_QUERY,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    const sections = (raw ?? [])
      .map(toSection)
      .filter((s): s is MenuSection => s !== null);

    return sections.length > 0 ? sections : MENU_SECTIONS;
  } catch (error) {
    console.error("[menu] Sanity fetch failed, serving the local menu:", error);
    return MENU_SECTIONS;
  }
}

/** Channay appears in two sections, so rows and dishes are not the same number. */
export function uniqueDishCount(sections: MenuSection[]): number {
  return new Set(sections.flatMap((s) => s.items.map((i) => i.slug))).size;
}
