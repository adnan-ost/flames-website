/**
 * Seeds Sanity from src/data/menu.ts and uploads the dish photography from
 * public/menu-items.
 *
 * Run it with:
 *
 *   npm run sanity:seed -- --dry-run    # report only, writes nothing
 *   npm run sanity:seed                 # upload and create
 *
 * The script is safe to re-run: it looks up what already exists by slug and
 * skips it, so a partial run can be resumed without creating duplicates.
 *
 * Deliberately absent: prices. src/data/prices.ts is empty and AGENTS.md is
 * explicit that unsourced prices stay unset, so seeded dishes have no price
 * and render N/A until someone signs numbers off.
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { MENU_SECTIONS, type MenuItem } from "../src/data/menu.ts";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!projectId) {
  fail("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. See README.md → Connecting Sanity.");
}
if (!token && !DRY_RUN) {
  fail("SANITY_API_WRITE_TOKEN is not set. Create an Editor token in Sanity Manage.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-08-24",
  token,
  useCdn: false,
});

/** Mirrors dishImageUrl()'s transform, but resolves to a path on disk. */
function localImagePath(item: MenuItem): string {
  const relative = item.image.replace(
    /^assets\/menu-items\/Flames Menu Images\//,
    "",
  );
  return path.join(process.cwd(), "public", "menu-items", relative);
}

async function main() {
  /* ----- collect the unique dishes ----- */
  // Channay appears in two sections; one document, referenced twice.
  const dishes = new Map<string, MenuItem>();
  let duplicates = 0;

  for (const section of MENU_SECTIONS) {
    for (const item of section.items) {
      const seen = dishes.get(item.slug);
      if (!seen) {
        dishes.set(item.slug, item);
        continue;
      }
      duplicates += 1;
      if (seen.description !== item.description || seen.image !== item.image) {
        console.warn(
          `  ! "${item.name}" appears twice with different content. Keeping the first.`,
        );
      }
    }
  }

  const rows = MENU_SECTIONS.reduce((n, s) => n + s.items.length, 0);
  console.log(
    `\n  ${MENU_SECTIONS.length} sections, ${rows} rows, ${dishes.size} unique dishes ` +
      `(${duplicates} repeated)\n`,
  );

  /* ----- every photo must exist before we write anything ----- */
  const missing: string[] = [];
  for (const item of dishes.values()) {
    try {
      await access(localImagePath(item));
    } catch {
      missing.push(`${item.name} → ${path.relative(process.cwd(), localImagePath(item))}`);
    }
  }

  if (missing.length) {
    console.error(`  ${missing.length} photo(s) missing:`);
    for (const m of missing) console.error(`    - ${m}`);
    fail("Repopulate public/menu-items first — see README.md → Dish photography.");
  }
  console.log(`  All ${dishes.size} photos found on disk.`);

  if (DRY_RUN) {
    console.log("\n  --dry-run: nothing written.\n");
    return;
  }

  /* ----- what is already there ----- */
  const existingDishes = await client.fetch<{ _id: string; slug: string | null }[]>(
    `*[_type == "dish"]{_id, "slug": slug.current}`,
  );
  const dishIdBySlug = new Map<string, string>();
  for (const d of existingDishes) if (d.slug) dishIdBySlug.set(d.slug, d._id);

  const existingSections = await client.fetch<{ _id: string; slug: string | null }[]>(
    `*[_type == "menuSection"]{_id, "slug": slug.current}`,
  );
  const sectionSlugs = new Set(existingSections.flatMap((s) => (s.slug ? [s.slug] : [])));

  /* ----- dishes ----- */
  let created = 0;
  let skipped = 0;

  for (const item of dishes.values()) {
    if (dishIdBySlug.has(item.slug)) {
      skipped += 1;
      continue;
    }

    const file = localImagePath(item);
    const asset = await client.assets.upload("image", createReadStream(file), {
      filename: path.basename(file),
    });

    const doc = await client.create({
      _type: "dish",
      name: item.name,
      slug: { _type: "slug", current: item.slug },
      description: item.description,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: item.name,
      },
    });

    dishIdBySlug.set(item.slug, doc._id);
    created += 1;
    console.log(`  + ${item.name}  (${created}/${dishes.size - skipped})`);
  }

  console.log(`\n  Dishes: ${created} created, ${skipped} already present.`);

  /* ----- sections ----- */
  let sectionsCreated = 0;
  let sectionsSkipped = 0;

  for (const [index, section] of MENU_SECTIONS.entries()) {
    if (sectionSlugs.has(section.id)) {
      sectionsSkipped += 1;
      continue;
    }

    await client.create({
      _type: "menuSection",
      title: section.title,
      slug: { _type: "slug", current: section.id },
      intro: section.intro,
      filter: section.filter,
      order: index,
      items: section.items.map((item) => ({
        _type: "reference",
        _ref: dishIdBySlug.get(item.slug),
        // Unique within the array; the slug already is.
        _key: item.slug,
      })),
    });

    sectionsCreated += 1;
    console.log(`  + ${section.title}`);
  }

  console.log(
    `\n  Sections: ${sectionsCreated} created, ${sectionsSkipped} already present.\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
