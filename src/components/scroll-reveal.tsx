"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reveals `[data-reveal]` elements as they enter the viewport.
 *
 * Mounted once in the (site) layout, it observes the whole document rather
 * than wrapping anything. That is the point: pages stay server components and
 * stay statically prerendered — a <Reveal> wrapper component would drag every
 * section it wrapped across the client boundary, and the menu is the page that
 * most needs to remain in the static HTML.
 *
 * Elements already on screen at load intersect immediately, so the first
 * screenful reveals without waiting for a scroll. Each element is unobserved
 * once shown: this is an entrance, not something that replays on the way back
 * up. Under prefers-reduced-motion everything is shown at once and no observer
 * is created.
 *
 * Re-runs on navigation, because a client-side route change swaps the content
 * without remounting this component.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not(.is-revealed)",
    );
    if (targets.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      // A little inset at the bottom so a block starts moving once it is
      // properly in view rather than the instant its first pixel appears.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
