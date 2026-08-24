"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UNIQUE_DISH_COUNT } from "@/data/menu";
import { HOURS } from "@/lib/site";

/**
 * The five rotating compositions from the previous site, kept in the same
 * order. Paths are the 800w masters; Next resizes them per breakpoint.
 */
const SLIDES = [
  {
    key: "coals",
    dishes: [
      "Chicken BBQ/Chicken Tikka",
      "Mutton & Beef BBQ/Beef Seekh Kebab",
      "From the Sea/Fish Tikka",
    ],
  },
  {
    key: "karahi",
    dishes: [
      "Karahi/Chicken Karahi",
      "Karahi/Mutton Karahi",
      "Karahi/Chicken White Karahi",
    ],
  },
  {
    key: "rice",
    dishes: [
      "Rice & Pulao/Chicken Biryani",
      "Rice & Pulao/Mutton Kabuli Pulao",
      "Rice & Pulao/Kashmiri Pulao",
    ],
  },
  {
    key: "tandoor",
    dishes: [
      "Chicken BBQ/Chicken Sajji",
      "Breads from the Tandoor/Garlic Naan",
      "Mutton & Beef BBQ/Behari Boti",
    ],
  },
  {
    key: "breakfast",
    dishes: [
      "Breakfast (Subho ka Nashta)/Halwa Puri",
      "Everyday Chai/Doodh Patti",
      "Breakfast (Subho ka Nashta)/Channay",
    ],
  },
] as const;

const ROTATE_MS = 6000;

function toUrl(path: string) {
  return `/menu-items/${path.split("/").map(encodeURIComponent).join("/")}.webp`;
}

export function Hero() {
  const [active, setActive] = useState(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setInterval(
      () => setActive((current) => (current + 1) % SLIDES.length),
      ROTATE_MS,
    );

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line"
      style={{
        background:
          "radial-gradient(circle at 78% 58%, rgba(242,101,19,.22) 0%, rgba(242,101,19,.06) 34%, transparent 58%), linear-gradient(120deg, #0a0908 0%, #191411 52%, #241a13 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "url(/brand/ash-texture.svg)",
          backgroundSize: "260px",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
        <div>
          <p className="text-xs tracking-[0.2em] text-orange uppercase">{HOURS.label}</p>

          <h1 id="hero-title" className="mt-4 text-4xl leading-[1.1] font-light text-white md:text-6xl">
            Whatever you&apos;re{" "}
            <em className="relative not-italic">
              <span className="relative z-10">craving</span>
              <Sparks />
            </em>
            ,
            <br />
            it came off the coals.
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-white/70">
            {UNIQUE_DISH_COUNT} dishes of Pakistani BBQ, karahi, biryani, nihari and chai — grilled
            to order, day and night.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="border border-orange bg-orange px-6 py-3 text-sm text-white transition-colors hover:bg-orange-dark"
            >
              See the menu
            </Link>
            <Link
              href="/contact"
              className="border border-white/25 px-6 py-3 text-sm text-white transition-colors hover:border-white/60"
            >
              Find us
            </Link>
          </div>
        </div>

        {/* ----- rotating dish stage ----- */}
        <div className="relative aspect-square w-full" aria-hidden="true">
          {SLIDES.map((slide, slideIndex) => (
            <div
              key={slide.key}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                slideIndex === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute top-[8%] left-[10%] h-[62%] w-[62%] overflow-hidden rounded-full shadow-2xl ring-1 ring-white/10">
                <Image
                  src={toUrl(slide.dishes[0])}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 60vw, 30vw"
                  priority={slideIndex === 0}
                  className="object-cover"
                />
              </div>
              <div className="absolute top-0 right-0 h-[40%] w-[40%] overflow-hidden rounded-full shadow-xl ring-1 ring-white/10">
                <Image
                  src={toUrl(slide.dishes[1])}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 40vw, 20vw"
                  priority={slideIndex === 0}
                  className="object-cover"
                />
              </div>
              <div className="absolute right-[6%] bottom-[2%] h-[44%] w-[44%] overflow-hidden rounded-full shadow-xl ring-1 ring-white/10">
                <Image
                  src={toUrl(slide.dishes[2])}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 44vw, 22vw"
                  priority={slideIndex === 0}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----- slide pagination ----- */}
      <div className="relative flex justify-center gap-2 pb-8" role="group" aria-label="Hero slides">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show composition ${index + 1}`}
            aria-pressed={index === active}
            className={`h-1.5 w-6 transition-colors ${
              index === active ? "bg-orange" : "bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/** Live embers around "craving", carried over from the original hero. */
function Sparks() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        left: `${8 + index * 7.5}%`,
        delay: `${(index * 0.42) % 3.4}s`,
        duration: `${2.6 + ((index * 0.31) % 1.6)}s`,
      })),
    [],
  );

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-1 h-full">
      {particles.map((particle, index) => (
        <span
          key={index}
          className="absolute bottom-0 h-1 w-1 rounded-full bg-[#ffd9a8] motion-safe:animate-[spark_3s_ease-out_infinite] motion-reduce:hidden"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            boxShadow: "0 0 7px 2px rgba(255,180,90,.6)",
          }}
        />
      ))}
    </span>
  );
}
