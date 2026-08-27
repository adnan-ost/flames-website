import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenuSections, uniqueDishCount } from "@/lib/menu-source";
import { HOURS } from "@/lib/site";
import { PRICE_NOTICE } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The complete Flames by the Indus menu: Pakistani BBQ, karahi, biryani, nihari, chai and more.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const sections = await getMenuSections();

  return (
    <>
      {/*
        The ember wash and ash texture are the hero's, so the menu opens the
        way the home page does. Both are transparent overlays, which is what
        keeps the carbon weave behind them visible.
      */}
      <section
        className="relative overflow-hidden border-b border-line px-5 pt-14 pb-9 md:px-8"
        style={{
          background:
            "radial-gradient(circle at 85% 30%, rgba(242,101,19,.15) 0%, rgba(242,101,19,.04) 38%, transparent 66%)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url(/brand/ash-texture.svg)", backgroundSize: "260px" }}
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
            <div>
              <p className="text-xs tracking-[0.2em] text-orange uppercase">The full menu</p>
              <h1 className="mt-3 text-4xl text-ink md:text-5xl">
                Everything off the coals
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                Charcoal BBQ, karahi cooked to order, slow-simmered nihari, breads straight
                from the tandoor and chai brewed all day.
              </p>
            </div>

            {/* The counts move out of the headline and into facts you can scan. */}
            <dl className="flex shrink-0 items-end gap-8">
              <div>
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">Dishes</dt>
                <dd className="mt-1.5 font-display text-3xl text-ink tabular-nums">
                  {uniqueDishCount(sections)}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">Categories</dt>
                <dd className="mt-1.5 font-display text-3xl text-ink tabular-nums">
                  {sections.length}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-5">
            <p className="flex items-baseline gap-2.5 text-sm text-ink">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-orange"
              />
              {HOURS.label}
            </p>
            <p className="max-w-2xl text-xs leading-relaxed text-muted">{PRICE_NOTICE}</p>
          </div>
        </div>
      </section>

      <MenuBrowser sections={sections} />
    </>
  );
}
