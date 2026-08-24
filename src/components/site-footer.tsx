import Link from "next/link";
import { CONTACT, HOURS, NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="text-lg font-light text-ink">{SITE.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{SITE.description}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Visit</p>
          <ul className="mt-3 space-y-1 text-sm text-ink">
            <li>{HOURS.label}</li>
            {CONTACT.address ? (
              <li className="text-muted">
                {CONTACT.address.street}, {CONTACT.address.city}
              </li>
            ) : null}
            {CONTACT.phone ? (
              <li>
                <a className="hover:text-orange" href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}>
                  {CONTACT.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Pages</p>
          <ul className="mt-3 space-y-1 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink transition-colors hover:text-orange">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted">
        &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </p>
    </footer>
  );
}
