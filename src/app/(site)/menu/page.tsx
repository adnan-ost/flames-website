import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { getMenuSections, uniqueDishCount } from "@/lib/menu-source";
import { HOURS } from "@/lib/site";
import { PRICE_NOTICE } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The complete Flames by the Indus menu — Pakistani BBQ, karahi, biryani, nihari, chai and more.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const sections = await getMenuSections();

  return (
    <>
      <section className="border-b border-line px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">The full menu</p>
          <h1 className="mt-3 text-4xl text-ink md:text-5xl">
            {uniqueDishCount(sections)} dishes, {sections.length} categories
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Charcoal BBQ, karahi cooked to order, slow-simmered nihari, breads straight from the
            tandoor and chai brewed all day. {HOURS.label}.
          </p>
          <p className="mt-4 max-w-2xl text-xs text-muted">{PRICE_NOTICE}</p>
        </div>
      </section>

      <MenuBrowser sections={sections} />
    </>
  );
}
