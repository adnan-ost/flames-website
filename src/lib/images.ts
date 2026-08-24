import type { MenuItem } from "@/data/menu";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImage } from "@/sanity/image";

/**
 * Resolves a dish photo URL.
 *
 * Sanity's image CDN is the source for any dish that carries a `sanityImage`
 * asset. Everything else falls back to the local masters under
 * /public/menu-items (gitignored — see .gitignore), which is what the site
 * serves until the Studio is populated.
 *
 * Keeping both paths behind this one function is deliberate: it is the only
 * place in the app that decides where a dish photograph comes from.
 */
export function dishImageUrl(item: MenuItem): string {
  /*
   * The masters are 800x800, so asking for 1200 did nothing except return the
   * full-quality original — which Next then had to fetch and re-encode for every
   * srcset width, 125 times over on the menu page. Capping at the real source
   * width and setting quality cuts roughly a fifth off each fetch.
   */
  const fromSanity = item.sanityImage
    ? urlForImage(item.sanityImage as SanityImageSource)
        ?.width(800)
        .quality(75)
        .fit("max")
        .auto("format")
        .url()
    : null;

  if (fromSanity) return fromSanity;

  const withoutAssetPrefix = item.image.replace(
    /^assets\/menu-items\/Flames Menu Images\//,
    "",
  );

  return `/menu-items/${withoutAssetPrefix.split("/").map(encodeURIComponent).join("/")}`;
}
