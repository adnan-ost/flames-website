"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "./hero-slides";
import { HOURS } from "@/lib/site";

const ROTATE_MS = 6000;

/*
 * `dishCount` comes from whatever the home page actually fetched — Sanity, or
 * the local fallback — so the number here can never disagree with the menu
 * page once the Studio menu diverges from the fixture in src/data/menu.ts.
 */
export function Hero({ slides, dishCount }: { slides: HeroSlide[]; dishCount: number }) {
  const [active, setActive] = useState(0);

  /*
   * Auto-rotation must be stoppable (WCAG 2.2.2): picking a slide by hand
   * stops it for good — nothing is worse than watching your choice rotate
   * away six seconds later — and hovering the stage holds it while the
   * pointer is there.
   */
  const [stopped, setStopped] = useState(false);
  const [hovered, setHovered] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || stopped || hovered) return;

    const timer = setInterval(
      () => setActive((current) => (current + 1) % Math.max(slides.length, 1)),
      ROTATE_MS,
    );

    return () => clearInterval(timer);
  }, [prefersReducedMotion, stopped, hovered, slides.length]);

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

          <h1 id="hero-title" className="mt-4 text-4xl leading-[1.1] text-white md:text-6xl">
            Whatever you&apos;re{" "}
            craving,
            <br />
            it came off the coals.
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-white/70">
            {dishCount} dishes of Pakistani BBQ, karahi, biryani, nihari and chai — grilled
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
        <div
          className="relative aspect-square w-full"
          aria-hidden="true"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.key}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                slideIndex === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute top-[8%] left-[10%] h-[62%] w-[62%] overflow-hidden rounded-full shadow-2xl ring-1 ring-white/10">
                {slide.images[0] ? (
                  <Image
                    src={slide.images[0]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 60vw, 30vw"
                    priority={slideIndex === 0}
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="absolute top-0 right-0 h-[40%] w-[40%] overflow-hidden rounded-full shadow-xl ring-1 ring-white/10">
                {slide.images[1] ? (
                  <Image
                    src={slide.images[1]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    priority={slideIndex === 0}
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="absolute right-[6%] bottom-[2%] h-[44%] w-[44%] overflow-hidden rounded-full shadow-xl ring-1 ring-white/10">
                {slide.images[2] ? (
                  <Image
                    src={slide.images[2]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 44vw, 22vw"
                    priority={slideIndex === 0}
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----- slide pagination ----- */}
      <div className="relative flex justify-center gap-2 pb-8" role="group" aria-label="Hero slides">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => {
              setStopped(true);
              setActive(index);
            }}
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

