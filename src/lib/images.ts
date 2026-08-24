import type { MenuItem } from "@/data/menu";

/**
 * Resolves a dish photo URL.
 *
 * Sanity's image CDN becomes the source once the Studio is populated; until
 * then this serves the local masters copied into /public/menu-items (which are
 * gitignored — see .gitignore). Keeping the lookup behind one function means
 * the switch to Sanity touches this file and nothing else.
 */
export function dishImageUrl(item: MenuItem): string {
  const withoutAssetPrefix = item.image.replace(
    /^assets\/menu-items\/Flames Menu Images\//,
    "",
  );

  return `/menu-items/${withoutAssetPrefix.split("/").map(encodeURIComponent).join("/")}`;
}
