/**
 * Builds an estimated recipe for every dish on the menu, mapped onto the 167
 * ingredients that already exist in Blink.
 *
 * IMPORTANT: the quantities here are ESTIMATES, not the kitchen's standards.
 * They exist so food-cost and stock-depletion have something to work with on
 * day one, and so the chef corrects numbers rather than starting from a blank
 * page. Every row is exported to a fill-in sheet for exactly that purpose.
 *
 * Which ingredients a dish uses is inferred and reviewable at a glance. How
 * much of each is a kitchen standard nobody outside the kitchen can know, so
 * treat every gram in here as provisional until the chef signs it off.
 *
 * Local tooling. Reads the repo's own menu data, writes JSON + a sheet.
 */
import { writeFileSync } from "node:fs";
import { MENU_SECTIONS } from "../src/data/menu";
import { PRICES } from "../src/data/prices";

type Recipe = Record<string, number>;

/** Exact ingredient names as they appear in Blink's picker. */
const I = {
  chickenBone: "Chest Chicken With Bone (Gram)",
  chicken: "Chicken (Gram)",
  chickenBoneless: "Chicken Boneless (Gram)",
  chickenQeema: "Chicken Qeema (Gram)",
  mutton: "Mutton (Gram)",
  muttonBoneless: "Mutton Boneless (Gram)",
  muttonPaye: "Mutton Paye (Piece)",
  beef: "Beef (Gram)",
  beefBoneless: "Beef Boneless (Gram)",
  maghaz: "Maghaz (Piece)",

  oil: "Oil (Milliliter)",
  ghee: "Ghee (Gram)",
  desiGhee: "Desi Ghee (Gram)",
  butter: "Butter (Gram)",
  cream: "Cream (Gram)",
  yogurt: "Yogurt (Gram)",
  curd: "Curd (Gram)",
  cheese: "Cheese (Gram)",
  milk: "Milk (Milliliter)",
  khoya: "Khoya (Gram)",

  onion: "Onion (Gram)",
  tomato: "Tomato (Gram)",
  adrak: "Adrak (Gram)",
  lehsan: "Lehsan (Gram)",
  greenChili: "Green Chili (Gram)",
  dhaniaFresh: "Dhania Fresh (Gram)",
  podina: "Podina (Gram)",
  aloo: "Aloo (Gram)",

  salt: "Salt (Gram)",
  redPepper: "Red Pepper Powder (Gram)",
  haldi: "Haldi (Gram)",
  dhaniaPowder: "Dhania Powder (Gram)",
  zeera: "Zeera (Gram)",
  garamMasala: "Garam Masala (Gram)",
  qormaMasala: "Qorma Masala (Gram)",
  nihariMasala: "Nihari Masala (Gram)",
  biryaniMasala: "Biryani Masala (Gram)",
  pulaoMasala: "Pulao Masala (Gram)",
  chatMasala: "Chat Masala (Gram)",
  gingerPowder: "Ginger Powder (Gram)",
  garlicPowder: "Garlic Powder (Gram)",
  kasooriMethi: "Kasoori Methi (Gram)",
  achar: "Achar (Gram)",
  lemonJuice: "Lemon Juice (Milliliter)",
  charcoal: "Charcoal (Gram)",

  rice: "Rice (Gram)",
  flour: "Flour (Gram)",
  meda: "Meda (Gram)",
  suji: "Suji (Gram)",
  besan: "Besan (Gram)",
  bakingPowder: "Baking Powder (Gram)",
  water: "Water (Milliliter)",

  tea: "Tea (Gram)",
  greenTea: "Green Tea (Gram)",
  sabazPatti: "Sabaz Patti (Gram)",
  sugar: "Sugar (Gram)",
  ilaichi: "Green ilaichi Powder (Gram)",
  kesar: "Kesar (Gram)",
  almond: "Almond (Gram)",
  pista: "Pista (Gram)",
  iceCubes: "Ice Cubes (Gram)",

  eggs: "Eggs (Piece)",
  channy: "Channy (Gram)",
  daalChana: "Daal Chana (Gram)",
  daalMasoor: "Daal Masoor (Gram)",
  daalMong: "Daal Mong (Gram)",
  daalMash: "Daal Mash (Gram)",
  palak: "Palak (Gram)",
  bhindi: "Bhindi (Gram)",
  bengan: "Bengan (Gram)",
  kadu: "Kadu (Gram)",
  gajar: "Gajar (Gram)",
  matar: "Sabaz Matar (Gram)",
  paneer: "Paneer (Gram)",
  saladPata: "Salad Pata (Piece)",
  kheera: "Kheera (Piece)",
  nimboo: "Nimboo (Piece)",
} as const;

/** The masala base almost every cooked dish shares. */
const SPICE: Recipe = {
  [I.salt]: 8, [I.redPepper]: 6, [I.haldi]: 3,
  [I.dhaniaPowder]: 6, [I.zeera]: 3, [I.garamMasala]: 4,
};

/** Grilled items are priced per piece; this is the per-piece build. */
function bbq(meat: string, gramsPerPiece: number, pieces: number): Recipe {
  const g = gramsPerPiece * pieces;
  return {
    [meat]: g,
    [I.yogurt]: Math.round(g * 0.12),
    [I.gingerPowder]: 4, [I.garlicPowder]: 4,
    [I.lemonJuice]: 10, [I.oil]: 20, [I.charcoal]: 60,
    ...SPICE,
  };
}

/** Karahi and handi: cooked to order in the pot. */
function karahi(meat: string, g: number, boneless = false): Recipe {
  return {
    [meat]: g,
    [I.tomato]: Math.round(g * 0.5),
    [I.ghee]: Math.round(g * 0.14),
    [I.adrak]: 15, [I.lehsan]: 12, [I.greenChili]: 10, [I.dhaniaFresh]: 8,
    ...(boneless ? { [I.cream]: 40 } : {}),
    ...SPICE,
  };
}

/** Slow-cooked curries built on an onion and yogurt base. */
function curry(meat: string, g: number): Recipe {
  return {
    [meat]: g,
    [I.onion]: Math.round(g * 0.35),
    [I.yogurt]: Math.round(g * 0.25),
    [I.ghee]: Math.round(g * 0.16),
    [I.adrak]: 12, [I.lehsan]: 10,
    [I.qormaMasala]: 12,
    ...SPICE,
  };
}

const dishes: {
  name: string; section: string; price: number; recipe: Recipe; basis: string;
}[] = [];
const seen = new Set<string>();

for (const section of MENU_SECTIONS) {
  for (const item of section.items) {
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    const n = item.name.toLowerCase();
    const s = section.title;
    let recipe: Recipe = {};
    let basis = "";

    // which protein the dish name implies
    const isMutton = /mutton|dumba|gosht|rosh|landhi|tabak|gushtaba|yakhni|rogan|seyal|dampukht|balochi/.test(n);
    const isBeef = /beef|nihari|behari|bihari/.test(n) && !/chicken/.test(n);
    const isFish = /fish|palla|prawn|jhinga/.test(n);

    if (s.includes("BBQ") || s === "From the Sea") {
      const m = n.match(/(\d+)\s*(?:pcs|pieces)/);
      const pieces = m ? Number(m[1]) : 1;
      const meat = isFish ? I.chicken : isMutton ? I.mutton : isBeef ? I.beef
                 : /boti|tikka|sajji|tandoori/.test(n) ? I.chickenBone : I.chickenQeema;
      const per = /sajji|tandoori|khaddi/.test(n) ? 450 : /seekh|kebab|shami|chapli/.test(n) ? 90 : 70;
      recipe = bbq(meat, per, Math.max(pieces, /sajji|tandoori|khaddi/.test(n) ? 1 : 4));
      basis = `grill, ${per}g per piece`;
      if (/cheese/.test(n)) recipe[I.cheese] = 60;
      if (/malai|reshmi/.test(n)) recipe[I.cream] = 50;
      if (/green|chilli/.test(n)) recipe[I.greenChili] = 25;
    } else if (/Karahi|Handi/.test(s)) {
      const boneless = /boneless|handi|white|makhani/.test(n);
      const meat = isMutton ? (boneless ? I.muttonBoneless : I.mutton)
                 : boneless ? I.chickenBoneless : I.chickenBone;
      recipe = karahi(meat, isMutton ? 500 : 550, boneless);
      basis = "half portion, serves 2-3";
      if (/achari/.test(n)) recipe[I.achar] = 40;
      if (/shinwari|namkeen/.test(n)) { delete recipe[I.tomato]; recipe[I.charcoal] = 40; }
      if (/makhani|white/.test(n)) { recipe[I.butter] = 40; recipe[I.cream] = 60; }
      if (/ginger/.test(n)) recipe[I.adrak] = 40;
      if (/jalfrezi/.test(n)) recipe["Shimla Mirch (Gram)"] = 60;
    } else if (/Curries|Slow Cooked|Nihari/.test(s)) {
      const meat = isMutton ? I.mutton : isBeef ? I.beef : I.chickenBone;
      recipe = curry(meat, isMutton ? 480 : 500);
      basis = "half portion, serves 2-3";
      if (/nihari/.test(n)) { recipe[I.nihariMasala] = 25; recipe[I.flour] = 40; delete recipe[I.yogurt]; }
      if (/paye/.test(n)) { recipe[I.muttonPaye] = 4; delete recipe[I.mutton]; }
      if (/haleem/.test(n)) { recipe[I.daalChana] = 80; recipe[I.daalMash] = 60; recipe[I.flour] = 50; }
      if (/brain|maghaz/.test(n)) { recipe[I.maghaz] = 2; delete recipe[I.chickenBone]; }
      if (/aloo/.test(n)) recipe[I.aloo] = 220;
      if (/makhani|butter/.test(n)) { recipe[I.butter] = 45; recipe[I.cream] = 70; }
      if (/palak/.test(n)) recipe[I.palak] = 250;
    } else if (s === "Rice & Pulao") {
      const meat = isMutton ? I.mutton : isBeef ? I.beef : I.chickenBone;
      recipe = { [I.rice]: 320, [meat]: 260, [I.onion]: 120, [I.ghee]: 70,
                 [I.yogurt]: 80, [I.adrak]: 10, [I.lehsan]: 10, ...SPICE };
      basis = "single platter";
      recipe[/biryani/.test(n) ? I.biryaniMasala : I.pulaoMasala] = 22;
      if (/kabuli|kashmiri/.test(n)) { recipe[I.almond] = 20; recipe["Kishmish (Gram)"] = 20; }
      if (/matar|sabzi|veg/.test(n)) { delete recipe[meat]; recipe[I.matar] = 150; }
    } else if (s === "Daal & Sabzi") {
      const daal = /mash/.test(n) ? I.daalMash : /mong|moong/.test(n) ? I.daalMong
                 : /masoor/.test(n) ? I.daalMasoor : I.daalChana;
      recipe = { [I.onion]: 90, [I.tomato]: 110, [I.ghee]: 55,
                 [I.adrak]: 10, [I.lehsan]: 10, [I.greenChili]: 8, ...SPICE };
      basis = "single serving";
      if (/daal|channay|channa/.test(n)) recipe[/channay|channa/.test(n) ? I.channy : daal] = 180;
      if (/palak/.test(n)) recipe[I.palak] = 280;
      if (/bhindi/.test(n)) recipe[I.bhindi] = 260;
      if (/bengan|baingan/.test(n)) recipe[I.bengan] = 280;
      if (/aloo/.test(n)) recipe[I.aloo] = 240;
      if (/paneer/.test(n)) recipe[I.paneer] = 180;
      if (/mix|sabzi/.test(n) && !recipe[I.palak]) { recipe[I.gajar] = 90; recipe[I.matar] = 80; recipe[I.aloo] = 90; }
    } else if (s === "Breads from the Tandoor") {
      const big = /kulcha|paratha|roghni|rumali/.test(n);
      recipe = { [I.flour]: big ? 160 : 120, [I.salt]: 3, [I.water]: 70 };
      basis = "one piece";
      if (/naan|kulcha/.test(n)) { recipe[I.meda] = 60; recipe[I.bakingPowder] = 3; recipe[I.yogurt] = 25; }
      if (/garlic/.test(n)) recipe[I.lehsan] = 12;
      if (/butter/.test(n)) recipe[I.butter] = 20;
      if (/cheese/.test(n)) recipe[I.cheese] = 50;
      if (/paratha|roghni/.test(n)) recipe[I.ghee] = 35;
    } else if (s === "Salads & Starters") {
      recipe = { [I.saladPata]: 1, [I.kheera]: 1, [I.tomato]: 80,
                 [I.onion]: 50, [I.nimboo]: 1, [I.chatMasala]: 4, [I.salt]: 3 };
      basis = "single bowl";
      if (/raita|yogurt|dahi/.test(n)) { recipe[I.yogurt] = 200; recipe[I.zeera] = 3; }
      if (/fries|chips/.test(n)) { recipe[I.aloo] = 250; recipe[I.oil] = 80; }
      if (/soup/.test(n)) { recipe[I.chickenBoneless] = 90; recipe[I.water] = 300; recipe["Corn Flour (Gram)"] = 20; }
    } else if (s === "Subah Ka Nashta") {
      recipe = { [I.ghee]: 40, ...SPICE };
      basis = "single serving";
      if (/halwa/.test(n)) { recipe[I.suji] = 120; recipe[I.sugar] = 120; recipe[I.desiGhee] = 70; }
      if (/puri/.test(n)) { recipe[I.meda] = 130; recipe[I.oil] = 90; }
      if (/channay|cholay/.test(n)) recipe[I.channy] = 200;
      if (/omelette|anda|egg/.test(n)) { recipe[I.eggs] = 3; recipe[I.onion] = 40; recipe[I.tomato] = 40; }
      if (/paratha/.test(n)) { recipe[I.flour] = 150; recipe[I.ghee] = 45; }
      if (/nihari|paye/.test(n)) { recipe[I.beef] = 400; recipe[I.nihariMasala] = 22; }
      if (/koki/.test(n)) { recipe[I.flour] = 150; recipe[I.onion] = 50; }
    } else if (/Chai|Cold by the River/.test(s)) {
      const cold = s === "Cold by the River" || /lassi|shake|falooda|soda|iced/.test(n);
      recipe = { [I.milk]: cold ? 250 : 200, [I.sugar]: 18 };
      basis = "one cup";
      if (!cold) { recipe[I.tea] = 6; recipe[I.water] = 90; }
      if (/qehwa|green/.test(n)) { recipe[I.greenTea] = 4; delete recipe[I.milk]; recipe[I.water] = 220; }
      if (/kashmiri|pink/.test(n)) { recipe[I.sabazPatti] = 8; recipe["Pink Color (Gram)"] = 1; recipe[I.pista] = 8; }
      if (/kesar|saffron/.test(n)) recipe[I.kesar] = 1;
      if (/elaichi|ilaichi|cardamom/.test(n)) recipe[I.ilaichi] = 2;
      if (/adrak|ginger/.test(n)) recipe[I.adrak] = 8;
      if (/doodh patti|karak/.test(n)) { recipe[I.milk] = 250; recipe[I.water] = 40; }
      if (/lassi/.test(n)) { recipe[I.yogurt] = 250; delete recipe[I.milk]; }
      if (/falooda/.test(n)) { recipe["Ras Gulaa (Gram)"] = 40; recipe[I.khoya] = 30; }
      if (cold) recipe[I.iceCubes] = 80;
    } else if (/Mithai|Sweet/.test(s)) {
      recipe = { [I.sugar]: 90, [I.milk]: 120, [I.desiGhee]: 40 };
      basis = "single portion";
      if (/gulab|jamun/.test(n)) { recipe[I.khoya] = 90; recipe[I.meda] = 30; }
      if (/kheer|firni/.test(n)) { recipe[I.rice] = 45; recipe[I.milk] = 300; }
      if (/halwa/.test(n)) { recipe[I.gajar] = 250; recipe[I.khoya] = 50; }
      if (/ras malai|rasmalai/.test(n)) { recipe[I.khoya] = 80; recipe[I.milk] = 220; }
      if (/zarda/.test(n)) { recipe[I.rice] = 150; recipe[I.kesar] = 1; }
      recipe[I.almond] = 10; recipe[I.pista] = 8;
    } else {
      // Regional Specialities, Flames Signatures and anything else
      const meat = isMutton ? I.mutton : isBeef ? I.beef : I.chickenBone;
      recipe = curry(meat, 480);
      basis = "half portion, serves 2-3";
    }

    const p = PRICES[item.name];
    dishes.push({ name: item.name, section: s, price: p?.amount ?? 0, recipe, basis });
  }
}

writeFileSync(process.argv[2], JSON.stringify(dishes, null, 1));
const lines = dishes.reduce((n, d) => n + Object.keys(d.recipe).length, 0);
console.log(`dishes:      ${dishes.length}`);
console.log(`recipe rows: ${lines}`);
console.log(`avg per dish: ${(lines / dishes.length).toFixed(1)}`);
const noRecipe = dishes.filter((d) => Object.keys(d.recipe).length < 3).map((d) => d.name);
console.log(`thin recipes (<3 ingredients): ${noRecipe.length ? noRecipe.join(", ") : "none"}`);
