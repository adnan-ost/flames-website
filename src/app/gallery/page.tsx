import type { Metadata } from "next";
import Image from "next/image";
import { MENU_SECTIONS } from "@/data/menu";
import { dishImageUrl } from "@/lib/images";
import { SERVING_SUGGESTION } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from the Flames by the Indus kitchen — charcoal BBQ, karahi, biryani, breads and chai.",
  alternates: { canonical: "/gallery" },
};

/*
 * Built from the dish photography, which is what exists today. Interior and
 * ambience photographs were not supplied; when they are, they belong at the
 * top of this page ahead of the food.
 */

export default function GalleryPage() {
  const dishes = MENU_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title })),
  );

  return (
    <>
      <section className="border-b border-line px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">Gallery</p>
          <h1 className="mt-3 text-4xl font-light text-ink md:text-5xl">Everything off the grill</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">
            {dishes.length} photographs from the kitchen, in the order they appear on the menu.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {dishes.map((dish, index) => (
            <figure
              key={`${dish.section}-${dish.slug}`}
              className="group relative aspect-square overflow-hidden border border-line bg-paper"
              style={{ borderRadius: "var(--brand-radius)" }}
            >
              <Image
                src={dishImageUrl(dish)}
                alt={dish.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={index < 8 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                <span className="block text-xs text-white">{dish.name}</span>
                <span className="block text-[11px] text-white/60">{dish.section}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs text-muted">{SERVING_SUGGESTION}</p>
      </div>
    </>
  );
}
