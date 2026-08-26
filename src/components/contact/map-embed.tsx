import { CONTACT } from "@/lib/site";

/**
 * The map, shown straight away.
 *
 * It was behind a click-to-load facade so the page made no third-party
 * request on load; the owner asked for the map to be visible by default
 * (Aug 2026), so the facade is gone. `loading="lazy"` keeps the Google
 * request off the initial page load — the iframe only fetches once it is
 * near the viewport, which on this page means once the visitor scrolls to it.
 *
 * No longer a client component: with no open/closed state there is nothing
 * for React to run in the browser, so this ships zero JavaScript.
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
  return (
    <div
      className={`map-embed relative overflow-hidden border border-line bg-paper/40 ${className}`}
      style={{ borderRadius: "var(--brand-radius)" }}
    >
      <iframe
        src={`https://www.google.com/maps?q=${lat},${lng}&z=16&hl=en&output=embed`}
        title={`Map showing ${name}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/*
        The embed is a live Google map, so it swallows scroll and drag. The
        overlay lets the page scroll past it on a phone and sends a real tap
        to Google Maps, where directions actually work.
      */}
      {CONTACT.mapsUrl ? (
        <a
          href={CONTACT.mapsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${name} in Google Maps`}
          className="absolute inset-0 md:hidden"
        />
      ) : null}
    </div>
  );
}
