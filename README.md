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
- Sanity for the menu CMS — **live**; the site reads from it, see below
- Deploys to Vercel

## Structure

```text
src/
├── app/
│   ├── layout.tsx        Root layout, metadata, pre-paint theme script
│   ├── globals.css       Brand tokens + Tailwind theme
│   ├── page.tsx          Home
│   ├── menu/             The full menu
│   ├── about/            Owner-supplied copy — see AGENTS.md
│   └── contact/          Hours + Restaurant JSON-LD
├── components/
│   ├── site-header.tsx   Nav, theme toggle, Call action
│   ├── site-footer.tsx
│   ├── theme-toggle.tsx
│   ├── home/hero.tsx     Rotating compositions
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

**Edit in the Studio at `/studio`.** Sanity is the source of truth: the site
fetches from it and re-renders within a minute (60s ISR). Dishes, categories,
photos and prices are all editable there.

`src/data/menu.ts` and `src/data/prices.ts` remain as the seed and as the
fallback the site serves if Sanity is unconfigured or unreachable — they are no
longer what the site normally renders. Read the price status rules in
`AGENTS.md` before touching prices.

`npm run sanity:prices` pushes `prices.ts` into Sanity, but **skips any dish
marked `confirmed`**, so a price the restaurant has signed off is never
overwritten by a derived one.

## Connecting Sanity

The schema, Studio and seed script are wired up but **not connected** — there is
no project id yet. Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set the site renders
from `src/data/menu.ts` and the local image masters exactly as before, and
`/studio` shows a short "not configured" notice instead of booting.

To connect it:

```bash
# 1. Log in and create (or pick) the project.
npx sanity@latest login
npx sanity@latest init --bare --dataset-default   # prints project id + dataset

# 2. Point the app at it.
cp .env.example .env.local                # then fill in the two values

# 3. Let the browser Studio talk to the API.
npx sanity cors add http://localhost:3000 --credentials

# 4. Push the schema so the Studio and MCP tools can see it.
npm run sanity:schema
```

Then create an **Editor** token (Sanity Manage → API → Tokens), put it in
`.env.local` as `SANITY_API_WRITE_TOKEN`, and seed:

```bash
npm run sanity:seed -- --dry-run   # checks all 124 photos resolve, writes nothing
npm run sanity:seed                # uploads the photos, creates the documents
```

The seed is re-runnable: it looks up what exists by slug and skips it, so an
interrupted run can simply be run again.

Optional, once content exists:

```bash
npm run sanity:typegen             # generates sanity.types.ts from the schema
```

### What the schema looks like

`menuSection` and `dish`, mirroring `src/data/menu.ts`. Sections hold an ordered
array of **references** to dishes rather than nesting them, so one dish can
appear in more than one section without being duplicated.

`dish` also carries `price`, `priceStatus` and `priceSource`, mirroring
`src/data/prices.ts` — staff editing prices is the reason the Studio exists.
Studio validation refuses to save a price without a status, so the
content-honesty rule in `AGENTS.md` is enforced at the point of entry. The seed
script writes **no** prices.

## Current state

Working: all five pages build and render, 125 dish rows, 20 sections, image
optimization, theming, every menu interaction.

### Outstanding

| Item              | Blocks                                  | Needed from   |
| ----------------- | --------------------------------------- | ------------- |
| Phone number      | Enabling the Call action                | Owner         |
| Sanity project ID | Studio at `/studio`, staff editing      | Owner (OAuth) |
| Vercel + DNS      | Apex domain, `menu.` → `/menu` redirect | Owner         |
| Price sign-off    | Publishing prices as `confirmed`        | Owner         |

Supplied by the owner in August 2026 and now live: the street address
(GF 13 to 15, Gulberg Arena, Gulberg Greens, Islamabad), `info@flamesbytheindus.com`,
and the Instagram and Facebook pages. `Restaurant` JSON-LD on `/contact` now
carries `address`, `email` and `sameAs`. **Region and postal code were not
supplied** and stay `null`, so the structured data omits them. The phone number
is still pending, so `telephone` is still omitted and the Call action stays
disabled.

### On prices

Every dish now carries a price. They were extracted by reading all 36 scans of a
comparable Islamabad restaurant's published menu page by page (it is published as
images, so there was no text to parse) and hand-mapping onto our 124 dishes.

At the owner's direction every price is the reference price plus 5%, rounded to
the nearest Rs 5. No dish is exempt.

**60 `unconfirmed`, 64 `estimated`, 0 `confirmed`.** Nothing is signed off. The
full working, with the the reference menu page and price behind every row, is in
`.reference/price-mapping.md`.

Two caveats worth re-reading before sign-off: the reference menu prices its
karahi/handi/BBQ "For 2-3 Persons" and the Half column was used throughout, and
its printed prices exclude government taxes plus a service charge.

## Conventions

Read `AGENTS.md` before changing design, content, or data. It records the design
rules carried over from the previous site, the content-honesty rules, and the
architectural decisions already settled.
