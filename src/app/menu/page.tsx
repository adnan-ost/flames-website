import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { MENU_SECTIONS, UNIQUE_DISH_COUNT } from "@/data/menu";
import { HOURS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The complete Flames by the Indus menu — Pakistani BBQ, karahi, biryani, nihari, chai and more.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <section className="border-b border-line px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">The full menu</p>
          <h1 className="mt-3 text-4xl font-light text-ink md:text-5xl">
            {UNIQUE_DISH_COUNT} dishes, {MENU_SECTIONS.length} sections
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            Charcoal BBQ, karahi cooked to order, slow-simmered nihari, breads straight from the
            tandoor and chai brewed all day. {HOURS.label}.
          </p>
        </div>
      </section>

      <MenuBrowser />
    </>
  );
}
