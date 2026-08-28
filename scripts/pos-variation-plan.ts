/**
 * Builds the POS variation plan straight from the repo's own menu and price
 * data, so nothing is retyped. Writes JSON for the browser automation to read.
 *
 * Local tooling only. Reads nothing secret and writes nothing to Sanity.
 */
import { writeFileSync } from "node:fs";
import { MENU_SECTIONS } from "../src/data/menu";
import { PRICES } from "../src/data/prices";

const out = process.argv[2];
if (!out) { console.error("usage: pos-variation-plan.ts <out.json>"); process.exit(1); }

// category title -> the dishes in it, first occurrence wins (Channay is in two)
const seen = new Set<string>();
const dishes: {
  name: string; section: string; desc: string; image: string;
  price: number; sizes: { label: string; amount: number }[];
}[] = [];

for (const section of MENU_SECTIONS) {
  for (const item of section.items) {
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    const p = PRICES[item.name];
    if (!p) continue;
    dishes.push({
      name: item.name,
      section: section.title,
      desc: item.description,
      image: item.image,
      price: p.amount,
      // fewer than two sizes is treated as none, same rule the site enforces
      sizes: (p.sizes ?? []).length > 1
        ? (p.sizes ?? []).map((s) => ({ label: s.label, amount: s.amount }))
        : [],
    });
  }
}

const sized = dishes.filter((d) => d.sizes.length > 0);
writeFileSync(out, JSON.stringify({ dishes, sized }, null, 1));

console.log(`dishes:        ${dishes.length}`);
console.log(`sized dishes:  ${sized.length}`);
console.log(`option rows:   ${sized.reduce((n, d) => n + d.sizes.length, 0)}`);
console.log(`sections:      ${new Set(dishes.map((d) => d.section)).size}`);
const labels = new Map<string, number>();
sized.forEach((d) => d.sizes.forEach((s) => labels.set(s.label, (labels.get(s.label) ?? 0) + 1)));
console.log("labels:", Object.fromEntries([...labels].sort((a, b) => b[1] - a[1])));
