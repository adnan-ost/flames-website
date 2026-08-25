"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { CONTACT, NAV } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-[var(--brand-header-h)] items-center justify-between gap-4 border-b border-line bg-cream/94 px-5 backdrop-blur-md md:px-8">
      <Link href="/" aria-label={`${"Flames by the Indus"} home`} className="shrink-0">
        {/* Two files, one shown at a time — see the logo rules in globals.css. */}
        <Image
          src="/brand/flames-logo.svg"
          alt="Flames by the Indus"
          width={205}
          height={56}
          priority
          className="logo-on-dark h-14 w-auto"
        />
        <Image
          src="/brand/flames-logo-on-light.svg"
          alt="Flames by the Indus"
          width={205}
          height={56}
          priority
          className="logo-on-light h-14 w-auto"
        />
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
        {NAV.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`px-3 py-2 text-sm tracking-wide transition-colors ${
                isActive ? "text-orange" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/*
          The phone number is still pending sign-off. Rather than inventing one,
          the action stays visibly disabled — exactly as it behaves on the
          current site — and becomes a tel: link the moment CONTACT.phone is set.
        */}
        {CONTACT.phone ? (
          <a
            href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 border border-orange bg-orange px-4 py-2 text-sm text-white transition-colors hover:bg-orange-dark"
          >
            <PhoneIcon />
            <span className="hidden sm:inline">Call us</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Call Flames by the Indus. Phone number coming soon"
            className="flex cursor-not-allowed items-center gap-2 border border-line bg-paper/40 px-4 py-2 text-sm text-muted opacity-75"
          >
            <PhoneIcon />
            <span className="hidden sm:inline">Call us</span>
          </button>
        )}
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M7.2 3.5 4.8 5.9c-.8.8-.8 2.1-.2 3.4 2.1 4.4 5.7 8 10.1 10.1 1.3.6 2.6.6 3.4-.2l2.4-2.4-4-4-2.2 2.2c-2.2-1.2-4.1-3.1-5.3-5.3l2.2-2.2-4-4Z" />
    </svg>
  );
}
