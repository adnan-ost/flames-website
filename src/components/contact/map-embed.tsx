"use client";

import { useState } from "react";

/**
 * Click-to-load map. The site deliberately makes no third-party request —
 * fonts are self-hosted, images come from our own CDN — and an auto-loading
 * Google iframe would quietly break that. So the map is a facade until the
 * visitor asks for it, and the placeholder says who it loads from.
 *
 * Google's keyless embed only comes in light; globals.css inverts it under
 * the dark theme (see the .map-embed rule) so the page's darkness holds.
 */
export function MapEmbed({
  lat,
  lng,
  name,
  className = "",
}: {
  lat: number;
  lng: number;
  name: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`map-embed relative overflow-hidden border border-line bg-paper/40 ${className}`}
      style={{ borderRadius: "var(--brand-radius)" }}
    >
      {loaded ? (
        <iframe
          src={`https://www.google.com/maps?q=${lat},${lng}&z=16&hl=en&output=embed`}
          title={`Map showing ${name}`}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 grid place-items-center transition-colors hover:bg-paper/70"
        >
          {/* Same ash texture as the hero, so the waiting state belongs to the brand. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "url(/brand/ash-texture.svg)", backgroundSize: "260px" }}
          />
          <span className="relative flex flex-col items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-8 w-8 fill-none stroke-orange stroke-[1.5] transition-transform group-hover:-translate-y-0.5"
            >
              <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="text-sm text-ink">Show the map</span>
            <span className="text-xs text-muted">Loads from Google Maps</span>
          </span>
        </button>
      )}
    </div>
  );
}
