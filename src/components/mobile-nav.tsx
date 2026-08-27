"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CONTACT, HOURS, NAV, SOCIAL, directionsUrl } from "@/lib/site";

/**
 * The small-screen navigation. Below `md` the header carries no nav at all,
 * so this is the only way through the site on a phone.
 *
 * Built on <dialog> + showModal() for the same reasons as the dish preview:
 * the focus trap, Escape and inert background come from the platform rather
 * than from hand-rolled key handling. It also renders in the top layer, which
 * matters here — the carbon weave makes the site layout a stacking context,
 * and a plain fixed overlay inside it would be trapped beneath the header.
 *
 * The panel opens as a continuation of the header rather than a slab over it:
 * same logo in the same place, the close button where the trigger just was.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    // showModal() makes the background inert but does not reliably stop it
    // scrolling behind the panel on iOS.
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const directions = directionsUrl();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open the menu"
        className="grid h-11 w-11 place-items-center border border-line text-ink transition-colors hover:border-orange/55 md:hidden"
      >
        {/* The middle rule glows like an ember — the one orange thing in the header. */}
        <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-orange" />
          <span className="h-px w-full bg-current" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Site menu"
        className="mobile-nav"
      >
        <div className="carbon-surface relative flex h-full flex-col overflow-y-auto">
          {/* Ember glow, borrowed from the hero, so the panel is not a flat sheet. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 82% 88%, rgba(242,101,19,.20) 0%, rgba(242,101,19,.06) 38%, transparent 66%)",
            }}
          />

          {/* The mark, huge and barely there. */}
          <Image
            src="/brand/flames-mark.svg"
            alt=""
            aria-hidden="true"
            width={420}
            height={420}
            className="pointer-events-none absolute -right-16 -bottom-10 w-72 opacity-[0.05]"
          />

          <div className="relative flex h-[var(--brand-header-h)] shrink-0 items-center justify-between gap-4 border-b border-line px-5">
            <Image
              src="/brand/flames-logo.svg"
              alt="Flames by the Indus"
              width={205}
              height={56}
              className="logo-on-dark h-12 w-auto"
            />
            <Image
              src="/brand/flames-logo-on-light.svg"
              alt="Flames by the Indus"
              width={205}
              height={56}
              className="logo-on-light h-12 w-auto"
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the menu"
              className="grid h-11 w-11 shrink-0 place-items-center border border-line text-muted transition-colors hover:border-orange/55 hover:text-orange"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 stroke-current stroke-[1.5]">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Primary" className="relative px-5 pt-4">
            <ul>
              {NAV.map((item, index) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <li
                    key={item.href}
                    className="mobile-nav-item border-b border-line"
                    style={{ "--i": index } as React.CSSProperties}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-5"
                    >
                      <span
                        aria-hidden="true"
                        className={`text-xs tabular-nums transition-colors ${
                          isActive ? "text-orange" : "text-muted"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-3xl transition-colors ${
                          isActive ? "text-orange" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={`ml-auto h-4 w-4 self-center fill-none stroke-current stroke-[1.5] transition-transform ${
                          isActive ? "text-orange" : "text-muted"
                        }`}
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Everything below is the reason someone opens a restaurant's menu on a phone. */}
          <div
            className="mobile-nav-item relative mt-auto px-5 pt-8 pb-8"
            style={{ "--i": NAV.length } as React.CSSProperties}
          >
            <p className="flex items-baseline gap-2.5 text-sm text-ink">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-orange"
              />
              {HOURS.label}
            </p>

            {CONTACT.address ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {CONTACT.address.street}, {CONTACT.address.city}
              </p>
            ) : null}

            <div className="mt-5 grid gap-2.5">
              {directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 border border-orange bg-orange px-5 py-3.5 text-sm text-white"
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

              {/* Still no number to publish — the action stays visibly disabled. */}
              {CONTACT.phone ? (
                <a
                  href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 border border-line px-5 py-3.5 text-sm text-ink"
                >
                  Call {CONTACT.phone}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed items-center justify-center gap-2 border border-line bg-paper/40 px-5 py-3.5 text-sm text-muted opacity-75"
                >
                  Call us, number coming soon
                </button>
              )}
            </div>

            {SOCIAL.instagram || SOCIAL.facebook || CONTACT.email ? (
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {CONTACT.email ? (
                  <a className="transition-colors hover:text-orange" href={`mailto:${CONTACT.email}`}>
                    Email
                  </a>
                ) : null}
                {SOCIAL.instagram ? (
                  <a
                    className="transition-colors hover:text-orange"
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                ) : null}
                {SOCIAL.facebook ? (
                  <a
                    className="transition-colors hover:text-orange"
                    href={SOCIAL.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
