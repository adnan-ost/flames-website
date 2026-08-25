import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Rendered for any URL that matches no route. This lives at the app root, so
 * it renders inside the deliberately bare root layout rather than the (site)
 * route group — the header and footer are composed in here so a dead link
 * still lands somewhere that looks like the site.
 *
 * Dead links are expected traffic, not an edge case: the Gallery page was
 * removed and the old menu subdomain is being retired without a redirect, so
 * this page's job is to hand people the menu.
 */
export default function NotFound() {
  return (
    /* Composes the (site) chrome by hand, weave included — see that layout. */
    <div className="carbon-surface min-h-screen">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs tracking-[0.2em] text-orange uppercase">404</p>
            <h1 className="mt-3 text-4xl text-ink md:text-5xl">
              That page is not on the menu.
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              The link you followed does not exist any more — but the food does.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="border border-orange bg-orange px-6 py-3 text-sm text-white transition-colors hover:bg-orange-dark"
              >
                See the menu
              </Link>
              <Link
                href="/"
                className="border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-orange/60"
              >
                Go to the home page
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
