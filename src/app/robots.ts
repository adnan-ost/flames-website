import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Served at /robots.txt. The Studio is a staff tool behind a Sanity login;
 * crawlers have no business there, and its page also carries a noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
