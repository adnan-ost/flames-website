/**
 * Pushes src/data/prices.ts into the Sanity dish documents.
 *
 *   npm run sanity:prices -- --dry-run           # report only
 *   npm run sanity:prices -- --overwrite-studio  # actually write
 *
 * Sanity is the source of truth for prices now — the owner edits them in the
 * Studio. This script exists for one job: restoring prices from the file after
 * a data loss. It used to skip dishes marked `confirmed`, which protected
 * signed-off prices; that status field is gone, so the guard is now an explicit
 * flag instead. Without it the script refuses to write, because a stray run
 * would silently replace every price the restaurant has set.
 */

import { createClient } from "@sanity/client";
import process from "node:process";
import { PRICES } from "../src/data/prices.ts";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!projectId) fail("NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
if (!token && !DRY_RUN) fail("SANITY_API_WRITE_TOKEN is not set.");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-08-24",
  token,
  useCdn: false,
});

interface DishDoc {
  _id: string;
  name: string | null;
  price: number | null;
}

async function main() {
  const dishes = await client.fetch<DishDoc[]>(
    `*[_type == "dish"]{_id, name, price}`,
  );

  console.log(`\n  ${dishes.length} dish documents, ${Object.keys(PRICES).length} priced dishes\n`);

  const unmatched = dishes.filter((d) => !d.name || !PRICES[d.name]);
  if (unmatched.length) {
    console.warn(`  ! ${unmatched.length} dish(es) have no price entry and will be left alone:`);
    for (const d of unmatched) console.warn(`      ${d.name ?? "(unnamed)"}`);
    console.warn("");
  }

  const toPatch = dishes.filter((d) => d.name && PRICES[d.name]);

  const differing = toPatch.filter((d) => d.price !== PRICES[d.name!].amount);
  if (differing.length) {
    console.log(`  ${differing.length} price(s) in the Studio differ from this file:`);
    for (const d of differing.slice(0, 10)) {
      console.log(`      ${d.name}: Studio Rs ${d.price} -> file Rs ${PRICES[d.name!].amount}`);
    }
    if (differing.length > 10) console.log(`      ... and ${differing.length - 10} more`);
    console.log("");
  }

  if (!DRY_RUN && !process.argv.includes("--overwrite-studio")) {
    fail(
      "Refusing to run. This replaces every price in Sanity with the values in\n" +
        "  src/data/prices.ts, including any the restaurant has set in the Studio.\n" +
        "  Re-run with --dry-run to preview, or --overwrite-studio if that is genuinely\n" +
        "  what you want.",
    );
  }

  if (DRY_RUN) {
    for (const d of toPatch.slice(0, 5)) {
      const p = PRICES[d.name!];
      console.log(`      ${d.name}: Rs ${p.amount}`);
    }
    console.log(`      ... and ${Math.max(0, toPatch.length - 5)} more`);
    console.log(`\n  --dry-run: nothing written. Would patch ${toPatch.length} documents.\n`);
    return;
  }

  // One transaction so the menu never sits half-priced.
  let tx = client.transaction();
  for (const d of toPatch) {
    const p = PRICES[d.name!];
    tx = tx.patch(d._id, (patch) =>
      patch.set({ price: p.amount }),
    );
  }

  await tx.commit({ visibility: "async" });

  console.log(`  Patched ${toPatch.length} dishes from the file.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
