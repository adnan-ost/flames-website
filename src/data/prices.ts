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
 * HOW THESE NUMBERS WERE DERIVED — none of them are signed off yet.
 *
 * Source: a comparable Islamabad restaurant's published menu, 36 scans, read page by page.
 * That menu prices its karahi/handi/BBQ "For 2-3 Persons" with Half/Full columns;
 * the Half column was used throughout. Its printed prices exclude
 * government taxes and a 3% service charge.
 *
 * One rule, applied uniformly: **every price is the reference price plus 5%**,
 * rounded to the nearest Rs 5. No dish is exempt, and each entry's
 * `source` records the reference page and the arithmetic, so any number can be
 * traced straight back to a scan.
 *
 * 124 dishes, every one at reference + 5%.
 *
 * Still to resolve: "Channay" appears in two sections but this map is keyed by
 * name, so the single entry below serves both rows. Splitting the slug is the
 * real fix.
 * ---------------------------------------------------------------------------
 */

export type PriceStatus = "confirmed" | "unconfirmed" | "estimated";

export interface DishPrice {
  amount: number;
  status: PriceStatus;
  /** Where the number came from, for the sign-off review. */
  source?: string;
}

export const PRICES: Record<string, DishPrice> = {
  /* ----- Chicken BBQ ----- */
  "Chicken Tikka": { amount: 1180, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Tikka. Rs 1125 plus 5% = Rs 1180." },
  "Chicken Boti": { amount: 2725, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Boti 8 pcs (boneless), half. Rs 2595 plus 5% = Rs 2725." },
  "Chicken Malai Boti": { amount: 2725, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Malai Tikka 8 pcs, half. Rs 2595 plus 5% = Rs 2725." },
  "Chicken Seekh Kebab": { amount: 1810, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Seekh Kebab 2 pcs, half. Rs 1725 plus 5% = Rs 1810." },
  "Chicken Cheese Boti": { amount: 2725, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Cheese Tikka 6 pcs, half. Rs 2595 plus 5% = Rs 2725." },
  "Chicken Cheese Seekh Kebab": { amount: 1970, status: "estimated", source: "Inferred: Chicken Seekh Kebab plus the reference menu's cheese premium. Rs 1875 plus 5% = Rs 1970." },
  "Green Chicken Chilli Boti": { amount: 2725, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Green Boti 8 pcs (boneless), half. Rs 2595 plus 5% = Rs 2725." },
  "Reshmi Kebab": { amount: 2725, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Reshami Tikka 8 pcs, half. Rs 2595 plus 5% = Rs 2725." },
  "Tandoori Chicken": { amount: 3145, status: "estimated", source: "Inferred from comparable Islamabad menu p.20 Peri Peri Chicken band. Rs 2995 plus 5% = Rs 3145." },
  "Chicken Sajji": { amount: 3670, status: "estimated", source: "Inferred: whole-bird premium over Tandoori Chicken. Rs 3495 plus 5% = Rs 3670." },

  /* ----- Mutton & Beef BBQ ----- */
  "Mutton Seekh Kebab": { amount: 2830, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Mutton Seekh Kebab 2 pcs, half. Rs 2695 plus 5% = Rs 2830." },
  "Mutton Sajji": { amount: 5770, status: "estimated", source: "Inferred: mutton premium over Chicken Sajji. Rs 5495 plus 5% = Rs 5770." },
  "Khaddi Kebab": { amount: 5245, status: "estimated", source: "Inferred from comparable Islamabad menu p.20 mutton BBQ band. Rs 4995 plus 5% = Rs 5245." },
  "Shami Kebab": { amount: 1570, status: "estimated", source: "Inferred: lowest of Comparable Islamabad menu p.20 kebab band. Rs 1495 plus 5% = Rs 1570." },
  "Beef Seekh Kebab": { amount: 2095, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Beef Seekh Kebab 6 pcs, half. Rs 1995 plus 5% = Rs 2095." },
  "Bihari Kebab": { amount: 2935, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Beef Behari Kebab 6 pcs, half. Rs 2795 plus 5% = Rs 2935." },
  "Behari Boti": { amount: 2935, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Beef Behari Kebab 6 pcs, half. Rs 2795 plus 5% = Rs 2935." },
  "Gola Kebab": { amount: 2145, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Chicken Gola Kebab 8 pcs, half. Rs 2045 plus 5% = Rs 2145." },
  "Chapli Kebab": { amount: 1305, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Special Peshawari Chapli Kebab 2 pcs, half. Rs 1245 plus 5% = Rs 1305." },

  /* ----- From the Sea ----- */
  "Fish Tikka": { amount: 3405, status: "unconfirmed", source: "Comparable Islamabad menu p.20 — Fish Tikka 8 pcs, half. Rs 3245 plus 5% = Rs 3405." },
  "Palla Fish": { amount: 2705, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 Lahori Fried Fish 6 pcs. Rs 2575 plus 5% = Rs 2705." },

  /* ----- Chicken Karahi ----- */
  "Chicken Karahi": { amount: 2355, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Karahi (with bone), half. Rs 2245 plus 5% = Rs 2355." },
  "Chicken White Karahi": { amount: 2565, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Peshawari Chicken Karahi (boneless), half. Rs 2445 plus 5% = Rs 2565." },
  "Chicken Shinwari Karahi": { amount: 2250, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Peshawari Chicken Karahi (with bone), half. Rs 2145 plus 5% = Rs 2250." },
  "Chicken Achari Karahi": { amount: 2620, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Achari (with bone), half. Rs 2495 plus 5% = Rs 2620." },
  "Chicken Smoke Karahi": { amount: 2620, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 chicken karahi band. Rs 2495 plus 5% = Rs 2620." },

  /* ----- Mutton Karahi ----- */
  "Mutton Karahi": { amount: 4280, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Mutton Karahi (with bone), half. Rs 4075 plus 5% = Rs 4280." },
  "Mutton Shinwari": { amount: 3825, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with bone), half. Rs 3645 plus 5% = Rs 3825." },
  "Mutton Smoke Karahi": { amount: 4350, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton karahi band. Rs 4145 plus 5% = Rs 4350." },
  "Namkeen Gosht": { amount: 3825, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Namkeen Dumba Karahi (with bone), half. Rs 3645 plus 5% = Rs 3825." },

  /* ----- Boneless Handi ----- */
  "Chicken Boneless Handi": { amount: 3090, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Handi (boneless), half. Rs 2945 plus 5% = Rs 3090." },
  "Chicken White Makhani Handi": { amount: 3090, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Makhni (boneless), half. Rs 2945 plus 5% = Rs 3090." },
  "Chicken Achari Handi": { amount: 3090, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Achari (boneless), half. Rs 2945 plus 5% = Rs 3090." },
  "Chicken Jalfrezi Handi": { amount: 3090, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Jalfrezi (boneless), half. Rs 2945 plus 5% = Rs 3090." },
  "Chicken Green Chilli Handi": { amount: 3145, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Green Chilli with Lemon (boneless), half. Rs 2995 plus 5% = Rs 3145." },
  "Chicken Ginger Handi": { amount: 3090, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Ginger (boneless), half. Rs 2945 plus 5% = Rs 3090." },

  /* ----- Signature Chicken Curries ----- */
  "Chicken Korma": { amount: 3090, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 boneless handi band. Rs 2945 plus 5% = Rs 3090." },
  "Chicken Makhani": { amount: 3090, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Chicken Makhni (boneless), half. Rs 2945 plus 5% = Rs 3090." },

  /* ----- Slow Cooked Mutton — no comparable entries ----- */
  "Mutton Qorma": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 Mutton Handi (boneless), half. Rs 4945 plus 5% = Rs 5190." },
  "Mutton White Qorma": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 Mutton Handi (boneless), half. Rs 4945 plus 5% = Rs 5190." },
  "Aloo Gosht": { amount: 4280, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 Mutton Karahi (with bone), half. Rs 4075 plus 5% = Rs 4280." },
  "Rogan Josh": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },
  "Yakhni": { amount: 4280, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton karahi band. Rs 4075 plus 5% = Rs 4280." },
  "Gushtaba": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },
  "Tabak Maaz": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },
  "Seyal Gosht": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },
  "Dampukht": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },
  "Balochi Rosh": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },
  "Landhi": { amount: 5190, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 mutton handi band. Rs 4945 plus 5% = Rs 5190." },

  /* ----- Beef Curries ----- */
  "Beef Korma": { amount: 2620, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 Beef Seekh Kebab Masala. Rs 2495 plus 5% = Rs 2620." },
  "Aloo Gosht (Beef)": { amount: 2565, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 Beef Tikka Masala Karahi. Rs 2445 plus 5% = Rs 2565." },

  /* ----- Nihari, Paya & Haleem ----- */
  "Beef Nihari": { amount: 2620, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 beef masala band. Rs 2495 plus 5% = Rs 2620." },
  "Paye": { amount: 2620, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 beef masala band. Rs 2495 plus 5% = Rs 2620." },
  "Maghaz Masala": { amount: 3405, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Brain Masala. Rs 3245 plus 5% = Rs 3405." },
  "Haleem": { amount: 2410, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 beef masala band. Rs 2295 plus 5% = Rs 2410." },

  /* ----- Rice & Pulao ----- */
  "Chicken Biryani": { amount: 2670, status: "unconfirmed", source: "Comparable Islamabad menu p.16 — Chicken Dum Biryani. Rs 2545 plus 5% = Rs 2670." },
  "Mutton Biryani": { amount: 3460, status: "unconfirmed", source: "Comparable Islamabad menu p.16 — Mutton Dum Biryani. Rs 3295 plus 5% = Rs 3460." },
  "Bannu Beef Pulao": { amount: 2830, status: "estimated", source: "Inferred from comparable Islamabad menu p.16 Kabuli Pulao. Rs 2695 plus 5% = Rs 2830." },
  "Chicken Pulao": { amount: 2670, status: "estimated", source: "Inferred from comparable Islamabad menu p.16 Chicken Dum Biryani. Rs 2545 plus 5% = Rs 2670." },
  "Mutton Kabuli Pulao": { amount: 2830, status: "unconfirmed", source: "Comparable Islamabad menu p.16 — Kabuli Pulao. Rs 2695 plus 5% = Rs 2830." },
  "Kashmiri Pulao": { amount: 2830, status: "estimated", source: "Inferred from comparable Islamabad menu p.16 Kabuli Pulao. Rs 2695 plus 5% = Rs 2830." },

  /* ----- Daal & Sabzi — reference menu flat-prices all veg/daal at 1575 ----- */
  "Shahi Daal Makhni": { amount: 1655, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Daal Chana Makhni. Rs 1575 plus 5% = Rs 1655." },
  "Shahi Daal Mash": { amount: 1655, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Daal Mash. Rs 1575 plus 5% = Rs 1655." },
  "Daal Mash Fry": { amount: 1655, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Daal Mash. Rs 1575 plus 5% = Rs 1655." },
  "Daal Channa Fry": { amount: 1655, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Daal Chana Makhni. Rs 1575 plus 5% = Rs 1655." },
  "Tarka Daal": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 daal band. Rs 1575 plus 5% = Rs 1655." },
  "Dal Pakwan": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 daal band. Rs 1575 plus 5% = Rs 1655." },
  "Channay": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 daal band. NOTE: this one entry also serves the Subah Ka Nashta row — see AGENTS.md. Rs 1575 plus 5% = Rs 1655." },
  "Achari Mix Sabzi": { amount: 1655, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Mix Vegetables. Rs 1575 plus 5% = Rs 1655." },
  "Sada Mix Sabzi": { amount: 1655, status: "unconfirmed", source: "Comparable Islamabad menu p.18 — Mix Vegetables. Rs 1575 plus 5% = Rs 1655." },
  "Bhindi": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 vegetable band. Rs 1575 plus 5% = Rs 1655." },
  "Dum Aloo": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 vegetable band. Rs 1575 plus 5% = Rs 1655." },
  "Sai Bhaji": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 vegetable band. Rs 1575 plus 5% = Rs 1655." },
  "Besan Curry": { amount: 1655, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 vegetable band. Rs 1575 plus 5% = Rs 1655." },

  /* ----- Breads from the Tandoor ----- */
  "Plain Naan": { amount: 195, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Plain Naan. Rs 185 plus 5% = Rs 195." },
  "Roghni Naan": { amount: 255, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Roghni Naan. Rs 245 plus 5% = Rs 255." },
  "Garlic Naan": { amount: 340, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Garlic Naan. Rs 325 plus 5% = Rs 340." },
  "Cheese Naan": { amount: 1200, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Cheese Naan (a stuffed speciality naan; may not be like-for-like). Rs 1145 plus 5% = Rs 1200." },
  "Kalonji Naan": { amount: 340, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Kalaunji Naan. Rs 325 plus 5% = Rs 340." },
  "Aloo Naan": { amount: 340, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 speciality naan band. Rs 325 plus 5% = Rs 340." },
  "Qeema Naan": { amount: 970, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 Chicken Naan. Rs 925 plus 5% = Rs 970." },
  "Rumali Roti": { amount: 195, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 roti band. Rs 185 plus 5% = Rs 195." },
  "Plain Roti / Chapati": { amount: 125, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Special Roti. Rs 120 plus 5% = Rs 125." },
  "Sheermal": { amount: 310, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 speciality bread band. Rs 295 plus 5% = Rs 310." },

  /* ----- Salads & Starters ----- */
  "Fresh Green Salad": { amount: 730, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Fresh Salad. Rs 695 plus 5% = Rs 730." },
  "Kachumar Salad": { amount: 730, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Kachumer Salad. Rs 695 plus 5% = Rs 730." },
  "Russian Salad": { amount: 1465, status: "unconfirmed", source: "Comparable Islamabad menu p.25 — Russian Salad. Rs 1395 plus 5% = Rs 1465." },
  "Fruit Salad": { amount: 940, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 salad band. Rs 895 plus 5% = Rs 940." },
  "BBQ Chicken Salad": { amount: 2305, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 Caesar Salad with Grilled Chicken. Rs 2195 plus 5% = Rs 2305." },
  "Chicken Pasta Salad": { amount: 1885, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 chicken salad band. Rs 1795 plus 5% = Rs 1885." },
  "Chicken Italian Salad": { amount: 1885, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 chicken salad band. Rs 1795 plus 5% = Rs 1885." },
  "Chicken Sesame Salad": { amount: 1885, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 chicken salad band. Rs 1795 plus 5% = Rs 1885." },
  "Chicken Kalonji Salad": { amount: 1885, status: "estimated", source: "Inferred from comparable Islamabad menu p.25 chicken salad band. Rs 1795 plus 5% = Rs 1885." },

  /* ----- Subah Ka Nashta ----- */
  "Halwa Puri": { amount: 1360, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Halwa / Poori. Rs 1295 plus 5% = Rs 1360." },
  "Suji Halwa": { amount: 780, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Suji Halwa. Rs 745 plus 5% = Rs 780." },
  "Aloo Bhujia": { amount: 780, status: "estimated", source: "Inferred from comparable Islamabad menu p.24 Pakistani Breakfast Platter components. Rs 745 plus 5% = Rs 780." },
  "Murgh Cholay": { amount: 1360, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 Halwa / Poori band. Rs 1295 plus 5% = Rs 1360." },
  "Omelette": { amount: 940, status: "estimated", source: "Inferred from comparable Islamabad menu p.24 breakfast platter components. Rs 895 plus 5% = Rs 940." },
  "Egg Fry": { amount: 625, status: "estimated", source: "Inferred from comparable Islamabad menu p.24 breakfast platter components. Rs 595 plus 5% = Rs 625." },
  "Paratha": { amount: 340, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Tandoori Paratha. Rs 325 plus 5% = Rs 340." },
  "Koki": { amount: 340, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 Tandoori Paratha. Rs 325 plus 5% = Rs 340." },
  "Nihari & Paya": { amount: 2620, status: "estimated", source: "Inferred from comparable Islamabad menu p.18 beef masala band. Rs 2495 plus 5% = Rs 2620." },

  /* ----- Everyday Chai ----- */
  "Doodh Patti": { amount: 415, status: "unconfirmed", source: "Comparable Islamabad menu p.34 — Mix Kadak Chai (without sugar). Rs 395 plus 5% = Rs 415." },
  "Karak Chai": { amount: 415, status: "unconfirmed", source: "Comparable Islamabad menu p.34 — Mix Kadak Chai (without sugar). Rs 395 plus 5% = Rs 415." },
  "Elaichi Chai": { amount: 415, status: "estimated", source: "Inferred from comparable Islamabad menu p.34 Mix Kadak Chai. Rs 395 plus 5% = Rs 415." },
  "Adrak Chai": { amount: 415, status: "estimated", source: "Inferred from comparable Islamabad menu p.34 Mix Kadak Chai. Rs 395 plus 5% = Rs 415." },
  "Masala Chai": { amount: 415, status: "estimated", source: "Inferred from comparable Islamabad menu p.34 Mix Kadak Chai. Rs 395 plus 5% = Rs 415." },

  /* ----- Regional Specialities ----- */
  "Kashmiri Pink Chai": { amount: 625, status: "unconfirmed", source: "Comparable Islamabad menu p.34 — Kashmiri Tea. Rs 595 plus 5% = Rs 625." },
  "Peshawari Qehwa": { amount: 290, status: "estimated", source: "Inferred from comparable Islamabad menu p.34 Green Tea. Rs 275 plus 5% = Rs 290." },
  "Sulemani Chai": { amount: 360, status: "estimated", source: "Inferred from comparable Islamabad menu p.34 Tea band. Rs 345 plus 5% = Rs 360." },

  /* ----- Flames Signatures — no comparable entries ----- */
  "Flames Signature Karak": { amount: 520, status: "estimated", source: "Inferred: premium over Karak Chai. Rs 495 plus 5% = Rs 520." },
  "Kesar Doodh Patti": { amount: 625, status: "estimated", source: "Inferred: saffron premium over Doodh Patti. Rs 595 plus 5% = Rs 625." },
  "Honey Pine Nut Kahwa": { amount: 730, status: "estimated", source: "Inferred: pine nut premium over Peshawari Qehwa. Rs 695 plus 5% = Rs 730." },

  /* ----- Cold by the River ----- */
  "Iced Karak": { amount: 625, status: "estimated", source: "Inferred: premium over Karak Chai. Rs 595 plus 5% = Rs 625." },
  "Doodh Soda": { amount: 500, status: "estimated", source: "Inferred from comparable Islamabad menu p.33 Lassi. Rs 475 plus 5% = Rs 500." },

  /* ----- Mithai and Sweet Endings ----- */
  "Gulab Jamun": { amount: 835, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Sharaqpuri Gulab Jaman 8 pcs. Rs 795 plus 5% = Rs 835." },
  "Ras Malai": { amount: 990, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Rus Malai 6 pcs. Rs 945 plus 5% = Rs 990." },
  "Kheer": { amount: 1150, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Lahori Kheer. Rs 1095 plus 5% = Rs 1150." },
  "Gajar ka Halwa": { amount: 1495, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Gajar Halwa (seasonal). Rs 1425 plus 5% = Rs 1495." },
  "Shahi Tukda": { amount: 940, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 mithai band. Rs 895 plus 5% = Rs 940." },
  "Zarda": { amount: 940, status: "estimated", source: "Inferred from comparable Islamabad menu p.26 mithai band. Rs 895 plus 5% = Rs 940." },
  "Jalebi": { amount: 940, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Jalaybee. Rs 895 plus 5% = Rs 940." },
  "Kulfi": { amount: 255, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Stick Kulfi. Rs 245 plus 5% = Rs 255." },
  "Falooda": { amount: 940, status: "unconfirmed", source: "Comparable Islamabad menu p.26 — Kulfi Falooda. Rs 895 plus 5% = Rs 940." },
};

export const CURRENCY = "PKR" as const;

export function formatPrice(name: string): string {
  const price = PRICES[name];
  if (!price) return "N/A";

  return `Rs ${price.amount.toLocaleString("en-PK")}`;
}

export function priceStatusOf(name: string): PriceStatus | null {
  return PRICES[name]?.status ?? null;
}
