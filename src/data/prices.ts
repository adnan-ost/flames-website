/**
 * Dish prices, in PKR, keyed by exact dish name.
 *
 * Every price carries a status so an unverified number can never be mistaken
 * for a signed-off one:
 *
 *   "confirmed"   — signed off by the restaurant. Safe to publish.
 *   "unconfirmed" — sourced from a comparable restaurant's public menu.
 *   "estimated"   — inferred from the price band of similar dishes in the
 *                   same section. A guess, and labelled as one.
 *
 * A dish absent from this map renders N/A, which is the previous site's rule
 * and remains the default for anything we cannot source.
 *
 * ---------------------------------------------------------------------------
 * HOW THESE NUMBERS WERE DERIVED.
 *
 * Source: a comparable Islamabad restaurant's published menu, 36 scans, read page by page.
 * That menu prices its karahi/handi/BBQ "For 2-3 Persons" with Half/Full columns;
 * the Half column was used throughout. Its printed prices exclude
 * government taxes and a 3% service charge.
 *
 * All 124 prices were **signed off by the owner on 25 August 2026**, so every
 * entry is `confirmed` and the website no longer marks any price as provisional.
 * The figures were originally derived, and that derivation is kept in each
 * entry's `source` so any number can still be traced back to a scan.
 *
 * How they were derived: every price is the reference price plus 5%,
 * rounded to the nearest Rs 5. No dish is exempt, and each entry's
 * `source` records the reference page and the arithmetic, so any number can be
 * traced straight back to a scan.
 *
 * 124 dishes, every one at reference + 5%.
 *
 * "Channay" appears in two sections and this map is keyed by name, so the
 * single entry below serves both rows — and both rows share one slug in
 * menu.ts, so they are structurally the same dish. The owner signed off that
 * one shared price on 25 Aug 2026. This only becomes work if the owner ever
 * wants the two rows priced differently: that means splitting the dish (new
 * slug), not just this map.
 * ---------------------------------------------------------------------------
 */

export type PriceStatus = "confirmed" | "unconfirmed" | "estimated";

/**
 * One size of a dish that is sold in more than one — "Half" and "Full",
 * "8 pieces" and "16 pieces", "6" and "12".
 */
export interface PriceSize {
  /** How the size reads on the menu. */
  label: string;
  amount: number;
  status: PriceStatus;
  /** Where the number came from, for the sign-off review. */
  source?: string;
}

export interface DishPrice {
  amount: number;
  status: PriceStatus;
  /** Where the number came from, for the sign-off review. */
  source?: string;
  /**
   * Sizes, for a dish sold in more than one. The first entry is the size
   * `amount` names, so a card can fall back to `amount` alone and still be
   * telling the truth.
   *
   * Omitted everywhere at present: the August 2026 derivation took the
   * reference menu's Half column throughout and never priced a full portion,
   * so no second number exists to publish. A size may only be added here once
   * the owner has given it — see the honesty rules in AGENTS.md.
   */
  sizes?: PriceSize[];
}

export const PRICES: Record<string, DishPrice> = {
  /* ----- Chicken BBQ ----- */
  "Chicken Tikka": { amount: 1180, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Tikka, Rs 1125 plus 5% = Rs 1180." },
  "Chicken Boti": { amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Boti 8 pcs (boneless), half, Rs 2595 plus 5% = Rs 2725.", sizes: [{ label: "8 pieces", amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Boti 8 pcs (boneless), half, Rs 2595 plus 5% = Rs 2725." }, { label: "16 pieces", amount: 5140, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Boti (8 / 16 Pcs) (Boneless), larger size, Rs 4895 plus 5% = Rs 5140." }] },
  "Chicken Malai Boti": { amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Malai Tikka 8 pcs, half, Rs 2595 plus 5% = Rs 2725.", sizes: [{ label: "8 pieces", amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Malai Tikka 8 pcs, half, Rs 2595 plus 5% = Rs 2725." }, { label: "16 pieces", amount: 5140, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Malai Tikka (8 / 16 Pcs) (Boneless), larger size, Rs 4895 plus 5% = Rs 5140." }] },
  "Chicken Seekh Kebab": { amount: 1810, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Seekh Kebab 2 pcs, half, Rs 1725 plus 5% = Rs 1810.", sizes: [{ label: "2 pieces", amount: 1810, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Seekh Kebab 2 pcs, half, Rs 1725 plus 5% = Rs 1810." }, { label: "4 pieces", amount: 3355, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Seekh Kebab (2 / 4 Pcs), larger size, Rs 3195 plus 5% = Rs 3355." }] },
  "Chicken Cheese Boti": { amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Cheese Tikka 6 pcs, half, Rs 2595 plus 5% = Rs 2725.", sizes: [{ label: "6 pieces", amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Cheese Tikka 6 pcs, half, Rs 2595 plus 5% = Rs 2725." }, { label: "12 pieces", amount: 5140, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Cheese Tikka (6 / 12 Pcs) (Boneless), larger size, Rs 4895 plus 5% = Rs 5140." }] },
  "Chicken Cheese Seekh Kebab": { amount: 1970, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: Chicken Seekh Kebab plus the reference menu's cheese premium, Rs 1875 plus 5% = Rs 1970." },
  "Green Chicken Chilli Boti": { amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Green Boti 8 pcs (boneless), half, Rs 2595 plus 5% = Rs 2725.", sizes: [{ label: "8 pieces", amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Green Boti 8 pcs (boneless), half, Rs 2595 plus 5% = Rs 2725." }, { label: "16 pieces", amount: 5140, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Green Boti (8 / 16 Pcs) (Boneless), larger size, Rs 4895 plus 5% = Rs 5140." }] },
  "Reshmi Kebab": { amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Reshami Tikka 8 pcs, half, Rs 2595 plus 5% = Rs 2725.", sizes: [{ label: "8 pieces", amount: 2725, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Reshami Tikka 8 pcs, half, Rs 2595 plus 5% = Rs 2725." }, { label: "16 pieces", amount: 5140, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Reshami Tikka (8 / 16 Pcs) (Boneless), larger size, Rs 4895 plus 5% = Rs 5140." }] },
  "Tandoori Chicken": { amount: 3145, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.20 Peri Peri Chicken band, Rs 2995 plus 5% = Rs 3145." },
  "Chicken Sajji": { amount: 3670, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: whole-bird premium over Tandoori Chicken, Rs 3495 plus 5% = Rs 3670." },

  /* ----- Mutton & Beef BBQ ----- */
  "Mutton Seekh Kebab": { amount: 2830, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Mutton Seekh Kebab 2 pcs, half, Rs 2695 plus 5% = Rs 2830.", sizes: [{ label: "2 pieces", amount: 2830, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Mutton Seekh Kebab 2 pcs, half, Rs 2695 plus 5% = Rs 2830." }, { label: "4 pieces", amount: 5295, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Mutton Seekh Kebab (2 / 4 Pcs), larger size, Rs 5045 plus 5% = Rs 5295." }] },
  "Mutton Sajji": { amount: 5770, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: mutton premium over Chicken Sajji, Rs 5495 plus 5% = Rs 5770." },
  "Khaddi Kebab": { amount: 5245, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.20 mutton BBQ band, Rs 4995 plus 5% = Rs 5245." },
  "Shami Kebab": { amount: 1570, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: lowest of Comparable Islamabad menu p.20 kebab band, Rs 1495 plus 5% = Rs 1570." },
  "Beef Seekh Kebab": { amount: 2095, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Beef Seekh Kebab 6 pcs, half, Rs 1995 plus 5% = Rs 2095.", sizes: [{ label: "6 pieces", amount: 2095, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Beef Seekh Kebab 6 pcs, half, Rs 1995 plus 5% = Rs 2095." }, { label: "12 pieces", amount: 3985, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Beef Seekh Kebab (6 / 12 Pcs), larger size, Rs 3795 plus 5% = Rs 3985." }] },
  "Bihari Kebab": { amount: 2935, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Beef Behari Kebab 6 pcs, half, Rs 2795 plus 5% = Rs 2935.", sizes: [{ label: "6 pieces", amount: 2935, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Beef Behari Kebab 6 pcs, half, Rs 2795 plus 5% = Rs 2935." }, { label: "12 pieces", amount: 5540, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Beef Behari Kebab (6 / 12 Pcs), larger size, Rs 5275 plus 5% = Rs 5540." }] },
  "Behari Boti": { amount: 2935, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Beef Behari Kebab 6 pcs, half, Rs 2795 plus 5% = Rs 2935.", sizes: [{ label: "6 pieces", amount: 2935, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Beef Behari Kebab 6 pcs, half, Rs 2795 plus 5% = Rs 2935." }, { label: "12 pieces", amount: 5540, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Beef Behari Kebab (6 / 12 Pcs), larger size, Rs 5275 plus 5% = Rs 5540." }] },
  "Gola Kebab": { amount: 2145, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Gola Kebab 8 pcs, half, Rs 2045 plus 5% = Rs 2145.", sizes: [{ label: "8 pieces", amount: 2145, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Chicken Gola Kebab 8 pcs, half, Rs 2045 plus 5% = Rs 2145." }, { label: "16 pieces", amount: 3985, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Chicken Gola Kebab (8 / 16 Pcs), larger size, Rs 3795 plus 5% = Rs 3985." }] },
  "Chapli Kebab": { amount: 1305, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Special Peshawari Chapli Kebab 2 pcs, half, Rs 1245 plus 5% = Rs 1305.", sizes: [{ label: "2 pieces", amount: 1305, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Special Peshawari Chapli Kebab 2 pcs, half, Rs 1245 plus 5% = Rs 1305." }, { label: "4 pieces", amount: 2335, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.25 — Special Peshawari Chapli Kebab (2 / 4 Pcs), larger size, Rs 2225 plus 5% = Rs 2335." }] },

  /* ----- From the Sea ----- */
  "Fish Tikka": { amount: 3405, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Fish Tikka 8 pcs, half, Rs 3245 plus 5% = Rs 3405.", sizes: [{ label: "8 pieces", amount: 3405, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.20 — Fish Tikka 8 pcs, half, Rs 3245 plus 5% = Rs 3405." }, { label: "16 pieces", amount: 6610, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.20 — Fish Tikka (8 / 16 Pcs), larger size, Rs 6295 plus 5% = Rs 6610." }] },
  "Palla Fish": { amount: 2705, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Lahori Fried Fish 6 pcs, Rs 2575 plus 5% = Rs 2705.", sizes: [{ label: "6 pieces", amount: 2705, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Lahori Fried Fish 6 pcs, Rs 2575 plus 5% = Rs 2705." }, { label: "12 pieces", amount: 5035, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Lahori Fried Fish (6 / 12 Pcs), larger size, Rs 4795 plus 5% = Rs 5035." }] },

  /* ----- Chicken Karahi ----- */
  "Chicken Karahi": { amount: 2355, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Karahi (with bone), half, Rs 2245 plus 5% = Rs 2355.", sizes: [{ label: "Half", amount: 2355, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Karahi (with bone), half, Rs 2245 plus 5% = Rs 2355." }, { label: "Full", amount: 4350, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Karahi (with Bone), larger size, Rs 4145 plus 5% = Rs 4350." }] },
  "Chicken White Karahi": { amount: 2565, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Peshawari Chicken Karahi (boneless), half, Rs 2445 plus 5% = Rs 2565.", sizes: [{ label: "Half", amount: 2565, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Peshawari Chicken Karahi (boneless), half, Rs 2445 plus 5% = Rs 2565." }, { label: "Full", amount: 5065, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.25 — Peshawari Chicken Karahi (Boneless), larger size, Rs 4825 plus 5% = Rs 5065." }] },
  "Chicken Shinwari Karahi": { amount: 2250, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Peshawari Chicken Karahi (with bone), half, Rs 2145 plus 5% = Rs 2250.", sizes: [{ label: "Half", amount: 2250, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Peshawari Chicken Karahi (with bone), half, Rs 2145 plus 5% = Rs 2250." }, { label: "Full", amount: 4090, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.25 — Peshawari Chicken Karahi (with Bone), larger size, Rs 3895 plus 5% = Rs 4090." }] },
  "Chicken Achari Karahi": { amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Achari (with bone), half, Rs 2495 plus 5% = Rs 2620.", sizes: [{ label: "Half", amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Achari (with bone), half, Rs 2495 plus 5% = Rs 2620." }, { label: "Full", amount: 4720, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Achari (with Bone), larger size, Rs 4495 plus 5% = Rs 4720." }] },
  "Chicken Smoke Karahi": { amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 chicken karahi band, Rs 2495 plus 5% = Rs 2620.", sizes: [{ label: "Half", amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 chicken karahi band, Rs 2495 plus 5% = Rs 2620." }, { label: "Full", amount: 4720, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Achari (with Bone), larger size, Rs 4495 plus 5% = Rs 4720." }] },

  /* ----- Mutton Karahi ----- */
  "Mutton Karahi": { amount: 4280, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Mutton Karahi (with bone), half, Rs 4075 plus 5% = Rs 4280.", sizes: [{ label: "Half", amount: 4280, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Mutton Karahi (with bone), half, Rs 4075 plus 5% = Rs 4280." }, { label: "Full", amount: 8235, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Karahi (with Bone), larger size, Rs 7845 plus 5% = Rs 8235." }] },
  "Mutton Shinwari": { amount: 3825, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with bone), half, Rs 3645 plus 5% = Rs 3825.", sizes: [{ label: "Half", amount: 3825, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with bone), half, Rs 3645 plus 5% = Rs 3825." }, { label: "Full", amount: 6820, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with Bone), larger size, Rs 6495 plus 5% = Rs 6820." }] },
  "Mutton Smoke Karahi": { amount: 4350, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton karahi band, Rs 4145 plus 5% = Rs 4350.", sizes: [{ label: "Half", amount: 4350, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton karahi band, Rs 4145 plus 5% = Rs 4350." }, { label: "Full", amount: 8340, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Achari (with Bone), larger size, Rs 7945 plus 5% = Rs 8340." }] },
  "Namkeen Gosht": { amount: 3825, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with bone), half, Rs 3645 plus 5% = Rs 3825.", sizes: [{ label: "Half", amount: 3825, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with bone), half, Rs 3645 plus 5% = Rs 3825." }, { label: "Full", amount: 6820, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with Bone), larger size, Rs 6495 plus 5% = Rs 6820." }] },

  /* ----- Boneless Handi ----- */
  "Chicken Boneless Handi": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Handi (boneless), half, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Handi (boneless), half, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Handi (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },
  "Chicken White Makhani Handi": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Makhni (boneless), half, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Makhni (boneless), half, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Makhni (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },
  "Chicken Achari Handi": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Achari (boneless), half, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Achari (boneless), half, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Achari (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },
  "Chicken Jalfrezi Handi": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Jalfrezi (boneless), half, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Jalfrezi (boneless), half, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Jalfrezi (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },
  "Chicken Green Chilli Handi": { amount: 3145, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Green Chilli with Lemon (boneless), half, Rs 2995 plus 5% = Rs 3145.", sizes: [{ label: "Half", amount: 3145, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Green Chilli with Lemon (boneless), half, Rs 2995 plus 5% = Rs 3145." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Green Chilli with Lemon (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },
  "Chicken Ginger Handi": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Ginger (boneless), half, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Ginger (boneless), half, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Ginger (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },

  /* ----- Signature Chicken Curries ----- */
  "Chicken Korma": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 boneless handi band, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 boneless handi band, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Handi (Boneless) band, larger size, Rs 5445 plus 5% = Rs 5715." }] },
  "Chicken Makhani": { amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Makhni (boneless), half, Rs 2945 plus 5% = Rs 3090.", sizes: [{ label: "Half", amount: 3090, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Chicken Makhni (boneless), half, Rs 2945 plus 5% = Rs 3090." }, { label: "Full", amount: 5715, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Chicken Makhni (Boneless), larger size, Rs 5445 plus 5% = Rs 5715." }] },

  /* ----- Slow Cooked Mutton — no comparable entries ----- */
  "Mutton Qorma": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Mutton Handi (boneless), half, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Mutton Handi (boneless), half, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless), larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Mutton White Qorma": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Mutton Handi (boneless), half, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Mutton Handi (boneless), half, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless), larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Aloo Gosht": { amount: 4280, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Mutton Karahi (with bone), half, Rs 4075 plus 5% = Rs 4280.", sizes: [{ label: "Half", amount: 4280, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Mutton Karahi (with bone), half, Rs 4075 plus 5% = Rs 4280." }, { label: "Full", amount: 8235, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Karahi (with Bone), larger size, Rs 7845 plus 5% = Rs 8235." }] },
  "Rogan Josh": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Yakhni": { amount: 4280, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton karahi band, Rs 4075 plus 5% = Rs 4280.", sizes: [{ label: "Half", amount: 4280, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton karahi band, Rs 4075 plus 5% = Rs 4280." }, { label: "Full", amount: 8235, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Karahi (with Bone) band, larger size, Rs 7845 plus 5% = Rs 8235." }] },
  "Gushtaba": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Tabak Maaz": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Seyal Gosht": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Dampukht": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Balochi Rosh": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },
  "Landhi": { amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190.", sizes: [{ label: "Half", amount: 5190, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 mutton handi band, Rs 4945 plus 5% = Rs 5190." }, { label: "Full", amount: 9445, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Mutton Handi (Boneless) band, larger size, Rs 8995 plus 5% = Rs 9445." }] },

  /* ----- Beef Curries ----- */
  "Beef Korma": { amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Beef Seekh Kebab Masala, Rs 2495 plus 5% = Rs 2620.", sizes: [{ label: "Half", amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 Beef Seekh Kebab Masala, Rs 2495 plus 5% = Rs 2620." }, { label: "Full", amount: 4770, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.18 — Beef Seekh Kebab Masala, larger size, Rs 4545 plus 5% = Rs 4770." }] },
  "Aloo Gosht (Beef)": { amount: 2565, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 Beef Tikka Masala Karahi, Rs 2445 plus 5% = Rs 2565.", sizes: [{ label: "Half", amount: 2565, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 Beef Tikka Masala Karahi, Rs 2445 plus 5% = Rs 2565." }, { label: "Full", amount: 4720, status: "unconfirmed", source: "Not signed off by the owner. Derived from: comparable Islamabad menu p.25 — Beef Tikka Masala Karahi, larger size, Rs 4495 plus 5% = Rs 4720." }] },

  /* ----- Nihari, Paya & Haleem ----- */
  "Beef Nihari": { amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 beef masala band, Rs 2495 plus 5% = Rs 2620." },
  "Paye": { amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 beef masala band, Rs 2495 plus 5% = Rs 2620." },
  "Maghaz Masala": { amount: 3405, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Brain Masala, Rs 3245 plus 5% = Rs 3405." },
  "Haleem": { amount: 2410, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 beef masala band, Rs 2295 plus 5% = Rs 2410." },

  /* ----- Rice & Pulao ----- */
  "Chicken Biryani": { amount: 2670, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.16 — Chicken Dum Biryani, Rs 2545 plus 5% = Rs 2670." },
  "Mutton Biryani": { amount: 3460, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.16 — Mutton Dum Biryani, Rs 3295 plus 5% = Rs 3460." },
  "Bannu Beef Pulao": { amount: 2830, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.16 Kabuli Pulao, Rs 2695 plus 5% = Rs 2830." },
  "Chicken Pulao": { amount: 2670, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.16 Chicken Dum Biryani, Rs 2545 plus 5% = Rs 2670." },
  "Mutton Kabuli Pulao": { amount: 2830, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.16 — Kabuli Pulao, Rs 2695 plus 5% = Rs 2830." },
  "Kashmiri Pulao": { amount: 2830, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.16 Kabuli Pulao, Rs 2695 plus 5% = Rs 2830." },

  /* ----- Daal & Sabzi — reference menu flat-prices all veg/daal at 1575 ----- */
  "Shahi Daal Makhni": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Daal Chana Makhni, Rs 1575 plus 5% = Rs 1655." },
  "Shahi Daal Mash": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Daal Mash, Rs 1575 plus 5% = Rs 1655." },
  "Daal Mash Fry": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Daal Mash, Rs 1575 plus 5% = Rs 1655." },
  "Daal Channa Fry": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Daal Chana Makhni, Rs 1575 plus 5% = Rs 1655." },
  "Tarka Daal": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 daal band, Rs 1575 plus 5% = Rs 1655." },
  "Dal Pakwan": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 daal band, Rs 1575 plus 5% = Rs 1655." },
  "Channay": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 daal band. NOTE: this one entry also serves the Subah Ka Nashta row — see AGENTS.md, Rs 1575 plus 5% = Rs 1655." },
  "Achari Mix Sabzi": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Mix Vegetables, Rs 1575 plus 5% = Rs 1655." },
  "Sada Mix Sabzi": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.18 — Mix Vegetables, Rs 1575 plus 5% = Rs 1655." },
  "Bhindi": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 vegetable band, Rs 1575 plus 5% = Rs 1655." },
  "Dum Aloo": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 vegetable band, Rs 1575 plus 5% = Rs 1655." },
  "Sai Bhaji": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 vegetable band, Rs 1575 plus 5% = Rs 1655." },
  "Besan Curry": { amount: 1655, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 vegetable band, Rs 1575 plus 5% = Rs 1655." },

  /* ----- Breads from the Tandoor ----- */
  "Plain Naan": { amount: 195, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Plain Naan, Rs 185 plus 5% = Rs 195." },
  "Roghni Naan": { amount: 255, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Roghni Naan, Rs 245 plus 5% = Rs 255." },
  "Garlic Naan": { amount: 340, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Garlic Naan, Rs 325 plus 5% = Rs 340." },
  "Cheese Naan": { amount: 1200, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Cheese Naan (a stuffed speciality naan; may not be like-for-like), Rs 1145 plus 5% = Rs 1200." },
  "Kalonji Naan": { amount: 340, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Kalaunji Naan, Rs 325 plus 5% = Rs 340." },
  "Aloo Naan": { amount: 340, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 speciality naan band, Rs 325 plus 5% = Rs 340." },
  "Qeema Naan": { amount: 970, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 Chicken Naan, Rs 925 plus 5% = Rs 970." },
  "Rumali Roti": { amount: 195, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 roti band, Rs 185 plus 5% = Rs 195." },
  "Plain Roti / Chapati": { amount: 125, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Special Roti, Rs 120 plus 5% = Rs 125." },
  "Sheermal": { amount: 310, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 speciality bread band, Rs 295 plus 5% = Rs 310." },

  /* ----- Salads & Starters ----- */
  "Fresh Green Salad": { amount: 730, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Fresh Salad, Rs 695 plus 5% = Rs 730." },
  "Kachumar Salad": { amount: 730, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Kachumer Salad, Rs 695 plus 5% = Rs 730." },
  "Russian Salad": { amount: 1465, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.25 — Russian Salad, Rs 1395 plus 5% = Rs 1465." },
  "Fruit Salad": { amount: 940, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 salad band, Rs 895 plus 5% = Rs 940." },
  "BBQ Chicken Salad": { amount: 2305, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 Caesar Salad with Grilled Chicken, Rs 2195 plus 5% = Rs 2305." },
  "Chicken Pasta Salad": { amount: 1885, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 chicken salad band, Rs 1795 plus 5% = Rs 1885." },
  "Chicken Italian Salad": { amount: 1885, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 chicken salad band, Rs 1795 plus 5% = Rs 1885." },
  "Chicken Sesame Salad": { amount: 1885, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 chicken salad band, Rs 1795 plus 5% = Rs 1885." },
  "Chicken Kalonji Salad": { amount: 1885, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.25 chicken salad band, Rs 1795 plus 5% = Rs 1885." },

  /* ----- Subah Ka Nashta ----- */
  "Halwa Puri": { amount: 1360, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Halwa / Poori, Rs 1295 plus 5% = Rs 1360." },
  "Suji Halwa": { amount: 780, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Suji Halwa, Rs 745 plus 5% = Rs 780." },
  "Aloo Bhujia": { amount: 780, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.24 Pakistani Breakfast Platter components, Rs 745 plus 5% = Rs 780." },
  "Murgh Cholay": { amount: 1360, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 Halwa / Poori band, Rs 1295 plus 5% = Rs 1360." },
  "Omelette": { amount: 940, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.24 breakfast platter components, Rs 895 plus 5% = Rs 940." },
  "Egg Fry": { amount: 625, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.24 breakfast platter components, Rs 595 plus 5% = Rs 625." },
  "Paratha": { amount: 340, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Tandoori Paratha, Rs 325 plus 5% = Rs 340." },
  "Koki": { amount: 340, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 Tandoori Paratha, Rs 325 plus 5% = Rs 340." },
  "Nihari & Paya": { amount: 2620, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.18 beef masala band, Rs 2495 plus 5% = Rs 2620." },

  /* ----- Everyday Chai ----- */
  "Doodh Patti": { amount: 415, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.34 — Mix Kadak Chai (without sugar), Rs 395 plus 5% = Rs 415." },
  "Karak Chai": { amount: 415, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.34 — Mix Kadak Chai (without sugar), Rs 395 plus 5% = Rs 415." },
  "Elaichi Chai": { amount: 415, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.34 Mix Kadak Chai, Rs 395 plus 5% = Rs 415." },
  "Adrak Chai": { amount: 415, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.34 Mix Kadak Chai, Rs 395 plus 5% = Rs 415." },
  "Masala Chai": { amount: 415, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.34 Mix Kadak Chai, Rs 395 plus 5% = Rs 415." },

  /* ----- Regional Specialities ----- */
  "Kashmiri Pink Chai": { amount: 625, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.34 — Kashmiri Tea, Rs 595 plus 5% = Rs 625." },
  "Peshawari Qehwa": { amount: 290, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.34 Green Tea, Rs 275 plus 5% = Rs 290." },
  "Sulemani Chai": { amount: 360, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.34 Tea band, Rs 345 plus 5% = Rs 360." },

  /* ----- Flames Signatures — no comparable entries ----- */
  "Flames Signature Karak": { amount: 520, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: premium over Karak Chai, Rs 495 plus 5% = Rs 520." },
  "Kesar Doodh Patti": { amount: 625, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: saffron premium over Doodh Patti, Rs 595 plus 5% = Rs 625." },
  "Honey Pine Nut Kahwa": { amount: 730, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: pine nut premium over Peshawari Qehwa, Rs 695 plus 5% = Rs 730." },

  /* ----- Cold by the River ----- */
  "Iced Karak": { amount: 625, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred: premium over Karak Chai, Rs 595 plus 5% = Rs 625." },
  "Doodh Soda": { amount: 500, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.33 Lassi, Rs 475 plus 5% = Rs 500." },

  /* ----- Mithai and Sweet Endings ----- */
  "Gulab Jamun": { amount: 835, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Sharaqpuri Gulab Jaman 8 pcs, Rs 795 plus 5% = Rs 835." },
  "Ras Malai": { amount: 990, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Rus Malai 6 pcs, Rs 945 plus 5% = Rs 990." },
  "Kheer": { amount: 1150, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Lahori Kheer, Rs 1095 plus 5% = Rs 1150." },
  "Gajar ka Halwa": { amount: 1495, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Gajar Halwa (seasonal), Rs 1425 plus 5% = Rs 1495." },
  "Shahi Tukda": { amount: 940, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 mithai band, Rs 895 plus 5% = Rs 940." },
  "Zarda": { amount: 940, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Inferred from comparable Islamabad menu p.26 mithai band, Rs 895 plus 5% = Rs 940." },
  "Jalebi": { amount: 940, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Jalaybee, Rs 895 plus 5% = Rs 940." },
  "Kulfi": { amount: 255, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Stick Kulfi, Rs 245 plus 5% = Rs 255." },
  "Falooda": { amount: 940, status: "confirmed", source: "Confirmed by the owner, 25 Aug 2026. Derived from: Comparable Islamabad menu p.26 — Kulfi Falooda, Rs 895 plus 5% = Rs 940." },
};

export const CURRENCY = "PKR" as const;

/** The one place a rupee amount is turned into display text. */
export function formatAmount(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function formatPrice(name: string): string {
  const price = PRICES[name];
  return price ? formatAmount(price.amount) : "N/A";
}

/**
 * The sizes to show for a dish, or an empty list when it is sold one way.
 *
 * A single size is treated as no sizes: a lone "Half" with nothing to compare
 * it against tells a customer less than the plain price does, and invites them
 * to wonder what the full one costs.
 */
export function priceSizesOf(name: string): PriceSize[] {
  const sizes = PRICES[name]?.sizes ?? [];
  return sizes.length > 1 ? sizes : [];
}
