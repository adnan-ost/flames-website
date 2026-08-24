import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { MENU_SECTIONS } from "@/data/menu";
import { dishImageUrl } from "@/lib/images";
import { SERVING_SUGGESTION } from "@/lib/copy";
import { SITE } from "@/lib/site";

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

export default function HomePage() {
  const featured = FEATURED.map(({ section, dish }) => {
    const found = MENU_SECTIONS.find((s) => s.title === section)?.items.find(
      (i) => i.name === dish,
    );
    return found ? { ...found, section } : null;
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <>
      <Hero />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-orange uppercase">A taste of it</p>
              <h2 className="mt-3 text-3xl font-light text-ink md:text-4xl">
                Six things worth ordering
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm text-orange underline underline-offset-4 transition-colors hover:text-orange-dark"
            >
              See all {MENU_SECTIONS.length} sections
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
                <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                  <Image
                    src={dishImageUrl(item)}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <h2 className="max-w-lg text-3xl font-light text-ink md:text-4xl">
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
