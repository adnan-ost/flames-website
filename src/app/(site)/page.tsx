import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { HERO_SLIDES } from "@/components/home/hero-slides";
import { getMenuSections, uniqueDishCount } from "@/lib/menu-source";
import { dishImageUrl } from "@/lib/images";
import { SERVING_SUGGESTION } from "@/lib/copy";
import { SITE } from "@/lib/site";
import { restaurantJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** One representative dish from each of the six menu families. */
const FEATURED = [
  { section: "Chicken BBQ", dish: "Chicken Tikka" },
  { section: "Chicken Karahi", dish: "Chicken Karahi" },
  { section: "Rice & Pulao", dish: "Chicken Biryani" },
  { section: "Nihari, Paya & Haleem", dish: "Beef Nihari" },
  { section: "Everyday Chai", dish: "Doodh Patti" },
  { section: "Mithai and Sweet Endings", dish: "Gulab Jamun" },
];

export default async function HomePage() {
  const sections = await getMenuSections();

  // One lookup for both the hero and the featured strip, so every image on this
  // page resolves through dishImageUrl and therefore through Sanity.
  const byName = new Map(
    sections.flatMap((section) => section.items.map((item) => [item.name, item] as const)),
  );

  const heroSlides = HERO_SLIDES.map((slide) => ({
    key: slide.key,
    images: slide.dishes
      .map((name) => byName.get(name))
      .filter((item) => item !== undefined)
      .map((item) => dishImageUrl(item)),
  })).filter((slide) => slide.images.length > 0);

  const featured = FEATURED.map(({ section, dish }) => {
    const found = sections.find((s) => s.title === section)?.items.find(
      (i) => i.name === dish,
    );
    return found ? { ...found, section } : null;
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <>
      {/* Google reads the home page for the business entity — see structured-data.ts. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />

      <Hero slides={heroSlides} dishCount={uniqueDishCount(sections)} />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-orange uppercase">A taste of it</p>
              <h2 className="mt-3 text-3xl text-ink md:text-4xl">
                Six things worth ordering
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm text-orange underline underline-offset-4 transition-colors hover:text-orange-dark"
            >
              See all {sections.length} categories
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={`/menu?q=${encodeURIComponent(item.name)}`}
                className="group block overflow-hidden border border-line bg-paper/50 transition-colors hover:border-orange/40"
                style={{ borderRadius: "var(--brand-radius)" }}
              >
                {/*
                  The masters are square, top-down plates. object-contain keeps
                  each dish whole — AGENTS.md asks for the photography to stay
                  fully visible — and the padding is on the image itself, since
                  a `fill` image is positioned against the padding box and would
                  ignore padding set on this wrapper.
                */}
                <div className="relative aspect-square overflow-hidden bg-cream">
                  <Image
                    src={dishImageUrl(item)}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-base text-ink">{item.name}</p>
                  <p className="mt-1 text-xs text-muted">{item.section}</p>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted">{SERVING_SUGGESTION}</p>
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-lg text-3xl text-ink md:text-4xl">
            The grill never goes out.
          </h2>
          <Link
            href="/contact"
            className="border border-orange bg-orange px-6 py-3 text-sm text-white transition-colors hover:bg-orange-dark"
          >
            Find {SITE.name}
          </Link>
        </div>
      </section>
    </>
  );
}
