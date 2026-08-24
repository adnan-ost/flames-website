/**
 * Sanity connection values.
 *
 * The project is not provisioned yet, so every value is read from the
 * environment and nothing throws when they are missing. `isSanityConfigured`
 * is the switch the rest of the code branches on: until it is true the site
 * keeps rendering from `src/data/menu.ts` and the local image masters, which
 * is the fallback behaviour AGENTS.md asks for.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Hard-coded per Sanity's guidance — an API version must never drift silently. */
export const apiVersion = "2026-08-24";

export const isSanityConfigured = projectId.trim().length > 0;
