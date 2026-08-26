import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { HERO_SLIDES } from "@/components/home/hero-slides";
import { getMenuSections, uniqueDishCount } from "@/lib/menu-source";
import { dishImageUrl } from "@/lib/images";
import { SERVING_SUGGESTION } from "@/lib/copy";
import { CONTACT, HOURS, SITE, directionsUrl } from "@/lib/site";
import { restaurantJsonLd } from "@/lib/structured-data";
import { DishPrice } from "@/components/menu/dish-price";
import type { MenuItem, MenuSection } from "@/data/menu";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/*
 * The house picks. Browsing by category is the doorways strip above; this is
 * the answer to "yes, but what should I actually order".
 *
 * Named as section + dish because two sections can hold dishes of the same
 * name, and the section is the only thing that disambiguates them.
 */
const FEATURED = [
  { section: "Chicken BBQ", dish: "Chicken Tikka" },
  { section: "Chicken Karahi", dish: "Chicken Karahi" },
  { section: "Rice & Pulao", dish: "Chicken Biryani" },
  { section: "Nihari, Paya & Haleem", dish: "Beef Nihari" },
  { section: "Everyday Chai", dish: "Doodh Patti" },
  { section: "Mithai and Sweet Endings", dish: "Gulab Jamun" },
];

/**
 * Doorways into the menu, one per filter.
 *
 * The menu page already seeds its filter from `?filter=`, so these links need
 * no new plumbing. Deliberately no dish counts — see AGENTS.md. The dishes
 * named here are chosen not to repeat FEATURED, so the page does not show the
 * same six plates twice.
 */
const CRAVINGS = [
  { filter: "coals", label: "Off the coals", line: "Charcoal BBQ, grilled to order", dish: "Chicken Seekh Kebab" },
  { filter: "karahi", label: "Karahi & handi", line: "Cooked to order in the pot", dish: "Mutton Karahi" },
  { filter: "curries", label: "Curries", line: "Slow-cooked, nihari and qorma", dish: "Chicken Makhani" },
  { filter: "rice", label: "Rice & biryani", line: "Pulao, biryani, kabuli", dish: "Mutton Biryani" },
  { filter: "breads", label: "From the tandoor", line: "Naan, roti, paratha", dish: "Garlic Naan" },
  { filter: "breakfast", label: "Subah ka nashta", line: "The morning table", dish: "Halwa Puri" },
  { filter: "chai", label: "Chai", line: "Brewed all day and all night", dish: "Karak Chai" },
  { filter: "sweets", label: "Something sweet", line: "Mithai and sweet endings", dish: "Ras Malai" },
];

/** The three chai the counter strip shows. */
const CHAI_SHOWCASE = ["Kashmiri Pink Chai", "Peshawari Qehwa", "Kesar Doodh Patti"];

function findDish(sections: MenuSection[], name: string): MenuItem | undefined {
  return sections.flatMap((section) => section.items).find((item) => item.name === name);
}

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

  const cravings = CRAVINGS.map((craving) => {
    // Fall back to the first dish of the matching family, so a renamed dish
    // costs the card its photo rather than the whole card.
    const item =
      findDish(sections, craving.dish) ??
      sections.find((s) => s.filter === craving.filter)?.items[0];
    return item ? { ...craving, item } : null;
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  // Counted from the live menu rather than typed in, so it cannot go stale.
  const chaiCount = sections
    .filter((section) => section.filter === "chai")
    .reduce((total, section) => total + section.items.length, 0);

  const chaiImages = CHAI_SHOWCASE.map((name) => findDish(sections, name)).filter(
    (item): item is MenuItem => item !== undefined,
  );

  const directions = directionsUrl();

  /* Spelled out, and counted from the list, so the heading cannot outlive it. */
  const COUNTS = ["no", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
  const featuredCount = COUNTS[featured.length] ?? String(featured.length);

  return (
    <>
      {/* Google reads the home page for the business entity — see structured-data.ts. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />

      <Hero slides={heroSlides} dishCount={uniqueDishCount(sections)} />

      {/* ----- doorways into the menu ----- */}
      <section data-reveal className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">What are you after</p>
          <h2 className="mt-3 text-3xl text-ink md:text-4xl">Start with a craving</h2>

          {/*
            Horizontal cards on purpose: the featured strip below is a grid of
            vertical photo cards, and two of those back to back read as the same
            section twice. This shape also matches the menu's list view, which
            is where these links land.
          */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cravings.map((craving, index) => (
              <Link
                key={craving.filter}
                href={`/menu?filter=${craving.filter}`}
                data-reveal="fade"
                className="flame-card group flex items-center gap-4 border border-line bg-paper/50 p-3 transition-colors hover:border-orange/40"
                style={
                  { borderRadius: "var(--brand-radius)", "--reveal-i": index } as React.CSSProperties
                }
              >
                <span
                  className="card-media relative h-20 w-20 shrink-0 overflow-hidden bg-cream"
                  style={{ borderRadius: "calc(var(--brand-radius) - 4px)" }}
                >
                  <Image
                    src={dishImageUrl(craving.item)}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-base text-ink">{craving.label}</span>
                  <span className="card-sub mt-1 block text-xs leading-relaxed text-muted">
                    {craving.line}
                  </span>
                </span>

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mr-1 h-4 w-4 shrink-0 fill-none stroke-current stroke-[1.5] text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-orange"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----- six specific plates ----- */}
      <section data-reveal className="border-t border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-orange uppercase">A taste of it</p>
              <h2 className="mt-3 text-3xl text-ink md:text-4xl">
                {featuredCount} things worth ordering
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
            {featured.map((item, index) => (
              <Link
                key={item.slug}
                href={`/menu?q=${encodeURIComponent(item.name)}`}
                data-reveal="fade"
                className="flame-card group block overflow-hidden border border-line bg-paper/50 transition-colors hover:border-orange/40"
                style={
                  { borderRadius: "var(--brand-radius)", "--reveal-i": index } as React.CSSProperties
                }
              >
                {/*
                  The masters are square, top-down plates. object-contain keeps
                  each dish whole — AGENTS.md asks for the photography to stay
                  fully visible — and the padding is on the image itself, since
                  a `fill` image is positioned against the padding box and would
                  ignore padding set on this wrapper.
                */}
                <div className="card-media relative aspect-square overflow-hidden bg-cream">
                  <Image
                    src={dishImageUrl(item)}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain p-3"
                  />
                </div>
                {/*
                  Name against price, then the description — the same shape as
                  a menu row, so a dish reads the same wherever it is met. The
                  price was the real omission here: a section headed "worth
                  ordering" that never says what anything costs.
                */}
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base text-ink">{item.name}</h3>
                    <DishPrice item={item} />
                  </div>
                  <p className="card-sub mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----- the round-the-clock band ----- */}
      <section
        data-reveal
        className="relative overflow-hidden border-t border-line px-5 py-16 md:px-8 md:py-24"
        style={{
          background:
            "radial-gradient(circle at 78% 50%, rgba(242,101,19,.16) 0%, rgba(242,101,19,.05) 36%, transparent 62%)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "url(/brand/ash-texture.svg)", backgroundSize: "260px" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">{HOURS.label}</p>
          <h2 className="mt-3 max-w-2xl text-3xl text-ink md:text-4xl">
            The grill never goes out.
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            There is no closing time. Whatever hour you arrive, the coals are lit and the
            chai station is running.
          </p>

          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="border-t border-line pt-5">
              <dt className="text-base text-ink">Charcoal, always lit</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                Every kebab, tikka and sajji goes over live coals.
              </dd>
            </div>
            <div className="border-t border-line pt-5">
              <dt className="text-base text-ink">Karahi cooked to order</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                It starts when you order, not before.
              </dd>
            </div>
            <div className="border-t border-line pt-5">
              <dt className="text-base text-ink">Chai around the clock</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                The chai station runs continuously, day and night.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ----- the chai counter ----- */}
      <section data-reveal className="border-t border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.2em] text-orange uppercase">Not an afterthought</p>
            <h2 className="mt-3 text-3xl text-ink md:text-4xl">The chai counter</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              {chaiCount} of them, brewing from doodh patti and karak through Kashmiri pink
              chai and Peshawari qehwa, to the saffron and pine-nut signatures — and iced,
              for the walk back out into the heat.
            </p>
            <Link
              href="/menu?filter=chai"
              className="mt-8 inline-flex items-center gap-2 border border-orange px-5 py-2.5 text-sm text-orange transition-colors hover:bg-orange hover:text-white"
            >
              See the chai
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-none stroke-current stroke-[1.5]"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {chaiImages.map((item) => (
              <div
                key={item.slug}
                className="card-media relative aspect-square overflow-hidden border border-line bg-cream"
                style={{ borderRadius: "var(--brand-radius)" }}
              >
                <Image
                  src={dishImageUrl(item)}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1024px) 30vw, 15vw"
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/*
          One notice, below every photograph on the page — the cravings grid,
          the featured plates and the chai above it all sit higher up. AGENTS.md
          asks for it wherever dish photography appears.
        */}
        <p className="mx-auto mt-14 max-w-6xl text-xs text-muted">{SERVING_SUGGESTION}</p>
      </section>

      {/* ----- the story, in the owner's own words ----- */}
      <section data-reveal className="border-t border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">Who we are</p>
          {/*
            Verbatim from the owner-supplied About copy — see AGENTS.md. Do not
            reword it here; it must stay identical to /about.
          */}
          <blockquote className="mt-5">
            <p className="font-display text-2xl leading-relaxed text-ink md:text-3xl">
              Inspired by the rich culinary traditions of the lands surrounding the Indus, we
              bring together time-honored recipes, bold spices, fresh ingredients, and the
              unmistakable character of cooking over flame.
            </p>
          </blockquote>
          <Link
            href="/about"
            className="mt-8 inline-block text-sm text-orange underline underline-offset-4 transition-colors hover:text-orange-dark"
          >
            Read our story
          </Link>
        </div>
      </section>

      {/* ----- how to actually get here ----- */}
      <section data-reveal className="border-t border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-xs tracking-[0.2em] text-orange uppercase">Find us</p>
            {CONTACT.address ? (
              <>
                <h2 className="mt-3 text-3xl leading-snug text-ink md:text-4xl">
                  {CONTACT.address.street}
                </h2>
                <p className="mt-3 text-lg font-light text-muted">
                  {[CONTACT.address.city, CONTACT.address.region].filter(Boolean).join(", ")}
                  {CONTACT.address.postalCode ? ` ${CONTACT.address.postalCode}` : null}
                </p>
              </>
            ) : (
              <h2 className="mt-3 text-3xl text-ink md:text-4xl">Come and eat</h2>
            )}
            <p className="mt-4 flex items-baseline gap-2.5 text-sm text-ink">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-orange"
              />
              {HOURS.label}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-orange bg-orange px-6 py-3 text-sm text-white transition-colors hover:bg-orange-dark"
              >
                Get directions
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-none stroke-current stroke-[1.5]"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex items-center border border-line px-6 py-3 text-sm text-ink transition-colors hover:border-orange/60"
            >
              Find {SITE.name}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
