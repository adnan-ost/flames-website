/**
 * Replace one dish photograph in Sanity.
 *
 *   node --env-file=.env.local scripts/replace-dish-photo.ts "Rumali Roti" "path/to.png"
 *
 * Sanity's image CDN is what production serves dish photography from — the
 * masters under public/menu-items are gitignored dev convenience, so updating
 * one of those alone changes nothing on the live site. This script uploads the
 * asset and repoints the dish document at it.
 *
 * Runs from a laptop, never from CI or the server: it needs
 * SANITY_API_WRITE_TOKEN, which is deliberately not deployed anywhere.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import process from "node:process";

const [dishName, imagePath] = process.argv.slice(2);

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!dishName || !imagePath) {
  fail('usage: node --env-file=.env.local scripts/replace-dish-photo.ts "<Dish Name>" "<image path>"');
}
if (!process.env.SANITY_API_WRITE_TOKEN) fail("SANITY_API_WRITE_TOKEN is not set.");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-08-24",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const dish = await client.fetch<{ _id: string; name: string } | null>(
  `*[_type == "dish" && name == $name][0]{_id, name}`,
  { name: dishName },
);
// Matching on the exact name keeps this honest: a typo fails loudly rather
// than silently repointing some other dish's photograph.
if (!dish) fail(`No dish document is named "${dishName}".`);

const asset = await client.assets.upload("image", readFileSync(imagePath), {
  filename: basename(imagePath),
});
const d = asset.metadata?.dimensions;
console.log(`\n  uploaded ${asset._id}${d ? ` (${d.width}x${d.height})` : ""}`);

await client
  .patch(dish!._id)
  .set({ image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } })
  .commit();

console.log(`  ${dish!.name} now points at the new photograph.\n`);
