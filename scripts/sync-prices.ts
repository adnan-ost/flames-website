/**
 * Pushes src/data/prices.ts into the seeded Sanity dish documents.
 *
 *   npm run sanity:prices -- --dry-run   # report only, writes nothing
 *   npm run sanity:prices                # patch the documents
 *
 * Matches on the exact dish name, which is how prices.ts is keyed. Re-runnable:
 * it patches in place, so running it twice is a no-op the second time.
 *
 * Every price carries its status and its source string, so nothing unverified
 * can pass for signed-off inside the Studio either. The schema refuses a price
 * without a status, which this always sets.
 *
 * Dishes whose status is already "confirmed" are skipped. Once the restaurant
 * signs a price off in the Studio, that price wins and this file stops being
 * authoritative for it.
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
  priceStatus: string | null;
}

async function main() {
  const dishes = await client.fetch<DishDoc[]>(
    `*[_type == "dish"]{_id, name, price, priceStatus}`,
  );

  console.log(`\n  ${dishes.length} dish documents, ${Object.keys(PRICES).length} priced dishes\n`);

  const unmatched = dishes.filter((d) => !d.name || !PRICES[d.name]);
  if (unmatched.length) {
    console.warn(`  ! ${unmatched.length} dish(es) have no price entry and will be left alone:`);
    for (const d of unmatched) console.warn(`      ${d.name ?? "(unnamed)"}`);
    console.warn("");
  }

  // A price the restaurant has signed off in the Studio outranks this file.
  // Without this guard, running the script would silently revert real prices
  // back to derived ones.
  const confirmed = dishes.filter((d) => d.priceStatus === "confirmed");
  if (confirmed.length) {
    console.log(`  ${confirmed.length} dish(es) marked confirmed — leaving those alone:`);
    for (const d of confirmed) console.log(`      ${d.name}`);
    console.log("");
  }

  const toPatch = dishes.filter(
    (d) => d.name && PRICES[d.name] && d.priceStatus !== "confirmed",
  );

  if (DRY_RUN) {
    for (const d of toPatch.slice(0, 5)) {
      const p = PRICES[d.name!];
      console.log(`      ${d.name}: Rs ${p.amount} (${p.status})`);
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
      patch.set({
        price: p.amount,
        priceStatus: p.status,
        priceSource: p.source ?? "",
      }),
    );
  }

  await tx.commit({ visibility: "async" });

  const byStatus = toPatch.reduce<Record<string, number>>((acc, d) => {
    const s = PRICES[d.name!].status;
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`  Patched ${toPatch.length} dishes.`);
  console.log(`  By status: ${JSON.stringify(byStatus)}`);
  console.log(`  Confirmed: ${byStatus.confirmed ?? 0} — nothing is signed off yet.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
