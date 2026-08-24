import type { Metadata } from "next";
import Image from "next/image";
import { HOURS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The kitchen behind Flames by the Indus — charcoal grills, slow-cooked curries and chai brewed around the clock.",
  alternates: { canonical: "/about" },
};

/*
 * DRAFT COPY — written to the brand's voice, not from supplied facts.
 *
 * Everything below describes the food, which the menu itself evidences. It
 * deliberately makes no claim about founding dates, families, or provenance,
 * because none were provided and inventing them would put untruths on a real
 * business's website. Replace with the owner's account when available.
 */

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line px-5 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.2em] text-orange uppercase">About</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-light text-ink md:text-5xl">
            Cooked over coals, served around the clock
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div className="space-y-5 leading-relaxed text-muted">
            <p>
              Flames by the Indus is built around a charcoal grill and a row of karahi burners. Most
              of what leaves the kitchen is cooked to order: skewers pressed by hand, boti charred
              fast over open flame, karahi finished in the pan it is served in.
            </p>
            <p>
              The menu follows the river it is named for. Balochi sajji roasted slowly on the bone,
              Peshawari chapli kebab pressed flat and fried, Sindhi palla from the Indus itself,
              Punjabi nihari left to simmer overnight. Breads come out of the tandoor as they are
              ordered, and the chai station runs from first light to last.
            </p>
            <p>
              Nothing here is held under a lamp. {HOURS.label} — because the grill is worth keeping
              lit.
            </p>

            <p className="border-l-2 border-orange/50 pl-4 text-sm text-muted italic">
              Draft copy. Replace with the restaurant&apos;s own account — this text makes no claims
              about the restaurant&apos;s history because none were supplied.
            </p>
          </div>

          <div
            className="relative aspect-[4/3] overflow-hidden border border-line"
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
        </div>
      </div>
    </>
  );
}
