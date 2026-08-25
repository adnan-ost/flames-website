import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Chrome for the public site only.
 *
 * This exists as a route group so /studio does not inherit it. The Studio is
 * a full application of its own — it was rendering underneath our nav bar,
 * inside our <main>, wearing our fonts and colours.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
