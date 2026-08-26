import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollReveal } from "@/components/scroll-reveal";

/**
 * Chrome for the public site only.
 *
 * This exists as a route group so /studio does not inherit it. The Studio is
 * a full application of its own — it was rendering underneath our nav bar,
 * inside our <main>, wearing our fonts and colours.
 *
 * The carbon-fibre weave is applied here, once, so it backs every public page
 * (see globals.css). The header sits on it at 94% opacity and the footer's
 * solid `bg-paper` covers it, which frames the textured content between them.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="carbon-surface min-h-screen">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
