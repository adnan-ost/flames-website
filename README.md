# Flames by the Indus — Website

Full website for Flames by the Indus: Pakistani BBQ, karahi, biryani, nihari
and chai. Open 24 hours, every day.

Ported from the previous single-page static menu (`~/flames-menu`, live at
`menu.flamesbytheindus.com`) to Next.js.

## Run it

```bash
npm install     # first time only
npm run dev     # http://localhost:3000
```

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint
npx tsc --noEmit
```

## Dish photography

Photos are **not in git** — they belong in Sanity's image CDN, and 26 MB of
binaries in history is permanent bloat. `public/menu-items` is gitignored.

If it is empty (fresh clone, or you cleaned it), repopulate from the old repo:

```bash
cd "../flames-menu/assets/menu-items/Flames Menu Images"
find . -name '*.webp' ! -name '*-400.webp' ! -name '*-600.webp' -print0 |
  while IFS= read -r -d '' f; do
    d="../../../../flames-website/public/menu-items/$(dirname "$f")"
    mkdir -p "$d" && cp "$f" "$d/"
  done
```

That copies the 125 800w masters. The `-400`/`-600` variants are deliberately
skipped — Next's image optimizer generates sizes now.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4, CSS-first config
- Sanity for the menu CMS — **not yet wired**, see below
- Deploys to Vercel

## Structure

```text
src/
├── app/
│   ├── layout.tsx        Root layout, metadata, pre-paint theme script
│   ├── globals.css       Brand tokens + Tailwind theme
│   ├── page.tsx          Home
│   ├── menu/             The full menu
│   ├── about/            Draft copy — see AGENTS.md
│   ├── gallery/          All 124 dish photos
│   └── contact/          Hours + Restaurant JSON-LD
├── components/
│   ├── site-header.tsx   Nav, theme toggle, Call action
│   ├── site-footer.tsx
│   ├── theme-toggle.tsx
│   ├── home/hero.tsx     Rotating compositions + embers
│   └── menu/             Browser, dish card, image preview
├── data/
│   ├── menu.ts           20 sections, 125 rows, 124 dishes
│   └── prices.ts         Keyed by dish name, with per-price status
└── lib/
    ├── site.ts           Restaurant facts — unknowns are null
    ├── images.ts         Single image-resolution point
    └── copy.ts           Shared copy (serving-suggestion notice)
```

## Menu features

Search with match highlighting, category filters, list/grid toggle (remembered,
grid by default on mobile), image lightbox, collapsible sections, shareable
`?filter=` and `?q=` URLs, and `#section-id` deep links.

The print stylesheet from the old site was intentionally dropped.

## Editing the menu

Until Sanity is connected, edit `src/data/menu.ts`. Prices are separate, in
`src/data/prices.ts` — read the status rules in `AGENTS.md` before adding any.

## Current state

Working: all five pages build and render, 125 dish rows, 20 sections, image
optimization, theming, every menu interaction.

### Outstanding

| Item              | Blocks                                  | Needed from   |
| ----------------- | --------------------------------------- | ------------- |
| Street address    | Contact map, `Restaurant` JSON-LD       | Owner         |
| Phone number      | Enabling the Call action                | Owner         |
| Sanity project ID | Studio at `/studio`, staff editing      | Owner (OAuth) |
| Vercel + DNS      | Apex domain, `menu.` → `/menu` redirect | Owner         |
| About-page facts  | Replacing draft copy                    | Owner         |
| Prices            | All 125 rows show `N/A`                 | See below     |

### On prices

The plan was to source prices from `themonal.com`. Their menu turns out to be
published as **scanned images**, not text — the site is a JS bundle containing
zero dish names, rendering a carousel of JPEGs. There is no price list to copy.

The 36 Islamabad à la carte scans are legible, so extraction is possible, but it
means reading each page and hand-mapping names onto our 124 dishes. Those
prices would import as `unconfirmed`, and dishes with no Monal equivalent as
`estimated` — both need the owner's sign-off before launch.

## Conventions

Read `AGENTS.md` before changing design, content, or data. It records the design
rules carried over from the previous site, the content-honesty rules, and the
architectural decisions already settled.
