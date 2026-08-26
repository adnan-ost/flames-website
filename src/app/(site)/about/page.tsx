import type { Metadata } from "next";
import Image from "next/image";
import { SERVING_SUGGESTION } from "@/lib/copy";

export const metadata: Metadata = {
  title: "About",
  description:
    "Where tradition meets the flame — the heritage, hospitality and fire behind Flames by the Indus.",
  alternates: { canonical: "/about" },
};

/*
 * Copy supplied by the owner, August 2026, and reproduced verbatim. It replaces
 * the earlier draft, which deliberately avoided any claim about the
 * restaurant's story because none had been supplied. Do not rewrite it without
 * the owner's say-so.
 */

/** Emphasis stays at normal weight — the brand's typography is light throughout. */
function Em({ children }: { children: React.ReactNode }) {
  return <strong className="font-normal text-ink">{children}</strong>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section data-reveal className="border-t border-line pt-10">
      <h2 className="text-2xl text-ink md:text-3xl">{title}</h2>
      <div className="mt-5 space-y-5 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">
            About Flames by the Indus
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl text-ink md:text-5xl">
            Where tradition meets the flame
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div className="space-y-5 leading-relaxed text-muted">
            <p>
              At <Em>Flames by the Indus</Em>, we believe great food is more than a meal. It is a
              celebration of heritage, hospitality, and the flavors that bring people together.
            </p>
            <p>
              Inspired by the rich culinary traditions of the lands surrounding the Indus, we bring
              together time-honored recipes, bold spices, fresh ingredients, and the unmistakable
              character of cooking over flame. From sizzling karahis to traditional Pakistani
              favorites, every dish is prepared with care and served with the warmth that defines
              true Pakistani hospitality.
            </p>
          </div>

          <div>
            <div
              className="relative aspect-[3/2] overflow-hidden border border-line"
              style={{ borderRadius: "var(--brand-radius)" }}
            >
              <Image
                src="/brand/pakistani-food-spread.webp"
                alt="A spread of Pakistani dishes at Flames by the Indus"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-xs text-muted">{SERVING_SUGGESTION}</p>
          </div>
        </div>

        <div className="mt-16 max-w-3xl space-y-12">
          <Section title="Our Story">
            <p>
              Flames by the Indus was created with a simple vision:{" "}
              <Em>
                to celebrate the soul of Pakistani cuisine while giving it a distinctive,
                contemporary dining experience.
              </Em>
            </p>
            <p>
              The Indus has been at the heart of civilizations, cultures, and culinary traditions
              for centuries. Its influence stretches across regions known for their rich food
              heritage, generous hospitality, and deep connection to the land.
            </p>
            <p>
              We take inspiration from that legacy and bring it to your table through food that is
              authentic, flavorful, and made to be shared.
            </p>
          </Section>

          <Section title="Crafted over flame">
            <p>Fire has always been at the heart of great cooking.</p>
            <p>
              At Flames by the Indus, flame is more than a cooking method. It is part of our
              identity. The heat, the aroma, the char, and the anticipation of a dish arriving at
              the table all come together to create an experience that goes beyond taste.
            </p>
            <p>
              We focus on bold flavors, carefully selected ingredients, traditional cooking
              techniques, and the perfect balance of spice and seasoning. Every dish is prepared to
              capture the richness and character of Pakistani cuisine.
            </p>
          </Section>

          <Section title="More than a restaurant">
            <p>We want every visit to feel like more than simply going out for dinner.</p>
            <p>
              Whether you&apos;re joining us for a family gathering, a meal with friends, a business
              dinner, or simply craving something exceptional, our goal is to make you feel welcome
              from the moment you walk through our doors.
            </p>
            <p className="border-l-2 border-orange/50 pl-4 text-ink">
              Good food brings people to the table. Great hospitality makes them want to stay.
            </p>
            <p>That is the experience we strive to create every day.</p>
          </Section>

          <Section title="Our promise">
            <p>
              We are committed to serving food that respects its roots while creating an experience
              that feels fresh, memorable, and distinctly Flames by the Indus.
            </p>
            <p>
              From the first sizzle to the final bite, we want every plate to tell a story of
              Pakistani flavor, craftsmanship, and tradition.
            </p>
          </Section>
        </div>

        <div className="mt-16 border-t border-line pt-10">
          <p className="font-display text-2xl text-ink md:text-3xl">
            Welcome to Flames by the Indus.
          </p>
          <p className="mt-3 text-lg font-light text-orange">
            Come for the flame. Stay for the flavor. Leave with a memory.
          </p>
        </div>
      </div>
    </>
  );
}
