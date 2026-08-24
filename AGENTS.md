<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Flames by the Indus — project rules

Full website for a Pakistani restaurant. Ported from a single-page static menu
site (previous repo: `~/flames-menu`, still live at `menu.flamesbytheindus.com`)
to Next.js in August 2026.

## Design rules to preserve

These carried over from the previous site and are deliberate, not incidental:

- **Fraunces** for display headings, **Inter** for everything else. Keep
  typography light — avoid heavy weights; the display face sits at 400 and
  nothing goes bolder. Dish names stay on Inter deliberately: 125 menu rows read
  better in the sans, and the serif is what makes the brand moments feel like a
  menu rather than an app.
- Typefaces are named in **exactly one place** — the FONTS block at the top of
  `globals.css`. Components use the `font-sans` / `font-display` utilities, never
  a hard-coded family, and never their own weight class on a display heading
  (that would override `--brand-display-weight`). Swapping a face is three steps,
  documented in that block. Both faces are self-hosted in `public/fonts`; the
  site makes no Google Fonts request.
- Base theme is black/charcoal with **minimal** Flames orange accents.
- **Dark is the default.** Light is the stored opt-in, on
  `html[data-theme="light"]` — _not_ `prefers-color-scheme`. The key is
  `flames-theme`, set by an inline script in the root layout before paint.
- The same pre-paint script stamps `html[data-menu-view]` from `flames-menu-view`,
  and the menu's list/grid layout is driven by CSS off that attribute, not by
  React state. This is deliberate: when React owned the layout, the server always
  rendered the list and the client jumped to the grid after hydration, which was
  a visible layout jump on every refresh. Keep list as the CSS base and grid as
  the override, and keep the card markup identical in both.
- Buttons have **sharp square corners**. Cards and panels may keep their radius
  (`--brand-radius`).
- Hero dish photography stays high-resolution, fully visible and top-down.
- Keep the **serving-suggestion notice** wherever dish photography appears
  (`SERVING_SUGGESTION` in `src/lib/copy.ts`).
- Do not add item-count badges to categories.

### How theming actually works

Raw values live on `--brand-*` custom properties in `globals.css`, and
`@theme inline` points Tailwind's utilities at those _variables_ rather than
copying their values. That indirection is what makes the runtime theme swap
work. If you redefine a colour directly inside `@theme` (without `inline`),
the light theme silently stops working.

## Content honesty rules

The previous README was explicit: **do not add fake prices**. That principle is
generalised here — this is a real business, and invented facts on its website
reach real customers and Google.

- Unknown facts are `null` in `src/lib/site.ts`, never a plausible placeholder.
  The UI hides what is null; structured data omits it.
- The phone number is **still pending**. The Call action stays visibly disabled
  until `CONTACT.phone` is set, at which point it becomes a `tel:` link
  automatically. Do not invent a number.
- The street address is **still pending**. `Restaurant` JSON-LD on `/contact`
  omits `address` and `telephone` entirely rather than publishing guesses.
- About-page copy was **supplied by the owner** (August 2026) and is reproduced
  verbatim in `src/app/about/page.tsx`. It replaced the earlier draft, which had
  deliberately avoided any claim about history, founding or people. Do not
  rewrite the supplied copy without the owner's say-so.

### Prices

`src/data/prices.ts` keys prices by exact dish name, in PKR, each with a status:

- `confirmed` — signed off by the restaurant. Safe to publish.
- `unconfirmed` — taken from a comparable restaurant's public menu.
- `estimated` — inferred from the price band of similar dishes in the section.

A dish absent from the map renders `N/A`, which is the default for anything
unsourced. The owner chose to allow `estimated` prices for dishes with no
comparable source, over a flagged concern about the no-guessing rule — hence
the status field, so nothing unverified can pass for signed-off.

The map was **populated in August 2026** from a comparable Islamabad
restaurant's published menu, at the owner's direction that Flames sit below the reference menu:

- every price is the reference price plus 5%, rounded to the nearest Rs 5;

124 dishes: 60 `unconfirmed`, 64 `estimated`, **0 `confirmed`**. Nothing is
signed off yet, and every entry records its derivation in `source`. the reference menu's
printed prices exclude tax and a 3% service charge, and its karahi/handi/BBQ are
sized "For 2-3 Persons" — the Half column was used throughout.

## Data and images

- The menu lives in `src/data/menu.ts`: **20 sections, 125 rows, 124 unique
  dishes** (`Channay` appears in two sections). It was extracted
  programmatically from the old `app.js`, not retyped.
- **Sanity is now the source of truth.** `src/lib/menu-source.ts` is the only
  place that decides where the menu comes from: it fetches from Sanity and falls
  back to this file when Sanity is unconfigured, unreachable, returns nothing, or
  returns malformed documents. That fallback is load-bearing and verified — a
  build against a bad project id still ships the full menu from local data. Do
  not remove it, and do not fetch the menu anywhere else.
- Pages stay statically prerendered with 60s ISR, so a Studio edit appears within
  a minute without giving up static rendering on the menu.
- **Dish photography is gitignored.** It belongs in Sanity's image CDN. The
  masters under `public/menu-items` are a local development convenience; see
  the README for how to repopulate them.
- All image lookups go through `dishImageUrl()` in `src/lib/images.ts`, so
  switching to Sanity touches that one function.
- Do not reintroduce the old `cwebp` 400/600/800 variant workflow or the
  `data-image-version` cache-busting attribute. Next's image optimizer and
  Sanity's CDN replace both.

## Decisions already made

Settled with the owner; do not relitigate without being asked:

- Next.js + TypeScript + Tailwind. Sanity for the menu CMS (Studio at
  `/studio`), chosen over Supabase because Supabase ships no editing UI for
  non-technical staff. Supabase remains the right choice if online ordering is
  added later — the two do not conflict.
- Pages: Home, Menu, About, Contact. No reservations or ordering.
  The Gallery page was **removed in August 2026** at the owner's request —
  "for now", so treat it as paused rather than abandoned. The dish
  photography it displayed is untouched. Recover the page with
  `git show 7c3a0c4:src/app/gallery/page.tsx`.
- The print stylesheet was **intentionally dropped** in the port.
- Target: `flamesbytheindus.com` on the apex, with
  `menu.flamesbytheindus.com` → 301 → `/menu` so existing QR codes survive.
