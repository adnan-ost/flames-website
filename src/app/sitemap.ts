import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Served at /sitemap.xml. Four static pages, so this stays a hand-kept list —
 * add a route here when one is added under (site).
 *
 * `lastModified` is deliberately absent: we do not track real per-page change
 * dates, and stamping every build's date on every URL would tell Google the
 * whole site changed when it did not.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/menu", "/about", "/contact"].map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    changeFrequency: path === "/menu" ? "weekly" : "monthly",
    priority: path === "/" || path === "/menu" ? 1 : 0.6,
  }));
}
