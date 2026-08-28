/**
 * Exports every price on the menu, sizes included, as JSON for the sheet
 * builder. Reads the repo's own data so nothing is retyped, and carries the
 * confirmed/unconfirmed status through, since 44 of the larger sizes were
 * never signed off by the owner.
 */
import { writeFileSync } from "node:fs";
import { MENU_SECTIONS } from "../src/data/menu";
import { PRICES } from "../src/data/prices";

const seen = new Set<string>();
const rows: unknown[] = [];

for (const section of MENU_SECTIONS) {
  for (const item of section.items) {
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    const p = PRICES[item.name];
    if (!p) continue;
    const sizes = (p.sizes ?? []).length > 1 ? p.sizes ?? [] : [];
    rows.push({
      name: item.name,
      section: section.title,
      price: p.amount,
      status: p.status,
      source: p.source ?? "",
      sizes: sizes.map((s) => ({
        label: s.label, amount: s.amount, status: s.status, source: s.source ?? "",
      })),
    });
  }
}
writeFileSync(process.argv[2], JSON.stringify(rows, null, 1));
const sized = rows.filter((r: any) => r.sizes.length);
console.log(`dishes: ${rows.length} | sized: ${sized.length} | price points: ${
  rows.reduce((n: number, r: any) => n + (r.sizes.length || 1), 0)}`);
