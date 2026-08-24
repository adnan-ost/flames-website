import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "./env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Returns null when Sanity is not configured, or when the source carries no
 * asset reference — callers fall back to the local master in that case.
 */
export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!builder || !source) return null;
  return builder.image(source);
}
