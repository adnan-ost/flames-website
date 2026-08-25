---
name: cpanel
description: Deploying and operating flamesbytheindus.com on the GoDaddy dedicated server (cPanel box, nginx + systemd + GitHub Actions). Use when deploying, when a deploy fails, when the site is down or serving stale content, when changing domains or DNS, when TLS or nginx needs touching, or when Sanity content is not reaching the live site. Also the place to record any new operational learning so the same problem is never debugged twice.
---

# Running this site on the GoDaddy server

Living runbook. **Append to the Learnings log at the bottom every time something
bites** — that is the point of this file. A fix that only exists in a chat
transcript will be re-debugged from scratch in three months.

## The shape of it

```
GitHub (main)
   └─ push → Actions → ssh → /srv/flames/repo/deploy/release.sh <sha>
                                 │
                                 ├─ build into releases/<sha>/
                                 ├─ swap current → releases/<sha>   (only on success)
                                 └─ sudo systemctl restart flames
nginx :443 ── proxy ──> Next.js :3000  (systemd unit `flames`)
Sanity (byr90f6b/production) ── content, images, prices
```

- Releases are atomic. A failed build leaves the previous release serving.
- Last 5 releases are kept, so rollback is a symlink swap.
- Full setup steps live in `deploy/README.md` at the repo root.

## Everyday commands

```bash
systemctl status flames          # is it up
journalctl -u flames -n 100 -f   # why it is not
ls -1dt /srv/flames/releases/*/  # what is deployed, newest first
readlink /srv/flames/current     # what is live right now
nginx -t && systemctl reload nginx
```

**Roll back:**

```bash
ln -sfn /srv/flames/releases/<previous-sha> /srv/flames/current
sudo systemctl restart flames
```

**Deploy without a commit:** GitHub → Actions → Deploy → Run workflow.

## Before assuming a bug is in the code

Work down this list. Most "the site is broken" reports on this project have been
one of these, not a code defect.

1. **Is the running release the commit you think?** `readlink /srv/flames/current`
   against the SHA in Actions. A silently failed deploy leaves the old release up.
2. **Is it a browser cache?** Hard-reload. CSS and favicons are cached hard and
   have repeatedly looked like code bugs.
3. **Does it reproduce on the server?** `curl -s localhost:3000/menu | head`. If
   the server is right and the browser is wrong, it is nginx or cache.
4. **Are the env vars present in the *build*?** `NEXT_PUBLIC_*` are inlined at
   build time, not read at runtime. Adding one and restarting does nothing —
   it needs a rebuild.

## Known traps

**Node version.** Next 16 needs 20.9+. `release.sh` refuses to build below that
rather than failing halfway. If the box has an old system Node, check what
`sudo -u flames node -v` reports — cPanel boxes often carry several.

**`NEXT_PUBLIC_*` are build-time.** They are baked into the JS bundle. Changing
`shared/.env.local` requires a redeploy, not a restart.

**ISR needs a writable release directory.** The 60-second revalidation writes
under `.next/cache`. If the release dir is read-only the site still serves but
never picks up Sanity edits. `ReadWritePaths=/srv/flames` in the unit covers it.

**Anything under a gitignored path does not exist on the server.**
`public/menu-items/` is gitignored — 125 dish photos that are present locally and
absent in every deployment. Code that falls back to a local image path works on a
laptop and 404s in production. All image lookups must go through
`dishImageUrl()`, which prefers Sanity's CDN. This has already caused one live
outage of every hero image.

**Sanity CORS is per-origin.** Every origin that loads `/studio` needs adding —
apex, `www`, and any preview host. Use *Register Studio* rather than *Add CORS
origin* for a real domain: it also registers the schema, which powers
schema-aware search and Content Agent.

**Do not run `next build` while `next dev` is running** on the same checkout.
They share `.next`, and the dev server ends up serving new JS against old HTML —
which surfaces as a React hydration mismatch that looks like a component bug.
Use a separate `distDir` or stop dev first.

**nginx must not buffer.** `proxy_buffering off` — buffering defeats streaming
and Suspense.

## Changing the domain

1. Vercel is no longer the host — make sure nothing still points there.
2. Point the apex A/AAAA at this server; drop the old vhost serving the previous
   static site.
3. `certbot --nginx -d flamesbytheindus.com -d www.flamesbytheindus.com`
4. Add the new origin in Sanity, and re-run *Register Studio* from
   `https://<domain>/studio`.
5. `SITE.url` in `src/lib/site.ts` drives canonical tags and JSON-LD. If it does
   not match the live domain, every page advertises a canonical URL that is
   wrong — which is worse than having none.
6. `menu.flamesbytheindus.com` is **removed, with no redirect** (owner's
   decision, Aug 2026). Printed QR codes pointing at it no longer resolve.

## Content, not deploys

`npm run sanity:seed` and `npm run sanity:prices` run from a laptop, never from
CI or the server. They need `SANITY_API_WRITE_TOKEN`, which is deliberately not
on the server: the site never reads it, and it can destroy content.

`sanity:prices` skips any dish already marked `confirmed`, so signed-off prices
cannot be reverted by a stray run.

---

## Learnings log

Append here. Date, symptom, cause, fix. Symptom first — that is what you will be
searching for next time.

### 2026-08-25 — Every hero image 400s in production, fine locally
**Symptom:** hero images blank on the deployed site, perfect on localhost.
**Cause:** the hero built its own `/menu-items/...` URLs instead of going through
`dishImageUrl()`. Those masters are gitignored, so the files do not exist in a
deployment and Next's optimizer returned 400.
**Fix:** resolve hero images through the menu source like everything else.
**Rule:** if an asset is gitignored, no code path may depend on it at runtime.

### 2026-08-25 — Hydration mismatch after a deploy, header markup "from the past"
**Symptom:** React hydration error; server HTML had the old header classes,
client had the new ones.
**Cause:** `next build` was run while `next dev` was live on the same checkout;
they share `.next`.
**Fix:** `rm -rf .next`, restart dev. Never build against a running dev server.

### 2026-08-25 — Light theme text invisible on the hero
**Symptom:** hero heading unreadable in light mode, fine in dark.
**Cause:** Tailwind v4 puts utilities in a cascade layer, and *unlayered* CSS
beats any layered rule regardless of specificity. An unlayered
`h1,h2 { color: var(--brand-ink) }` overrode `text-white`. Dark mode hid it
because `--brand-ink` happens to be light there.
**Fix:** base element styles belong in `@layer base`.
**Rule:** in `globals.css`, element defaults go in `@layer base` or they will
silently outrank utilities.

### 2026-08-25 — Studio shows "Connect this Studio to your project"
**Symptom:** `/studio` loads on the live domain but cannot reach the API.
**Cause:** only `http://localhost:3000` was in Sanity's CORS origins.
**Fix:** click *Register Studio* on that screen. Repeat for every new domain.
