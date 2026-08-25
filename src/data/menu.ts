/**
 * The menu, ported verbatim from the previous site's `sections` array.
 *
 * This is the seed source for Sanity and the fallback the site renders when
 * Sanity is not configured. Once the Studio is live, Sanity becomes the source
 * of truth and this file stays only as the import fixture.
 *
 * 20 sections, 125 rows, 124 unique dishes (Channay appears in two sections).
 * Prices deliberately live outside this file — see price-data.ts.
 */

export type MenuFilter =
  | "coals"
  | "kitchen"
  | "starters"
  | "breakfast"
  | "chai"
  | "sweets";

export interface MenuItem {
  name: string;
  description: string;
  slug: string;
  /** Path within the old repo's assets folder; used to seed Sanity's image CDN. */
  image: string;
  /**
   * Set only on dishes loaded from Sanity. When present `dishImageUrl()` serves
   * the CDN; when absent it falls back to the local master named by `image`.
   * Typed structurally so this file stays free of Sanity imports.
   */
  sanityImage?: { asset?: { _ref?: string; _id?: string } } | null;
  /**
   * Rupees, set only on dishes loaded from Sanity where the price is edited.
   * When absent the card falls back to `src/data/prices.ts`.
   */
  price?: number | null;
}

export interface MenuSection {
  id: string;
  filter: MenuFilter;
  title: string;
  intro: string;
  items: MenuItem[];
}

export const FILTERS: { value: MenuFilter | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "coals", label: "BBQ" },
  { value: "kitchen", label: "Main kitchen" },
  { value: "starters", label: "Starters" },
  { value: "breakfast", label: "Breakfast" },
  { value: "chai", label: "Chai" },
  { value: "sweets", label: "Desserts" },
];

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "from-the-coals",
    filter: "coals",
    title: "Chicken BBQ",
    intro: "Grilled over charcoal to order. Served with naan, fresh salad, mint raita and house chutneys.",
    items: [
      {
        name: "Chicken Tikka",
        description: "Classic bone in chicken, spiced and grilled over flame",
        slug: "chicken-tikka",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Tikka.webp",
      },
      {
        name: "Chicken Boti",
        description: "Boneless cubes, charred & juicy",
        slug: "chicken-boti",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Boti.webp",
      },
      {
        name: "Chicken Malai Boti",
        description: "Creamy, delicate and tender enough to melt in the mouth",
        slug: "chicken-malai-boti",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Malai Boti.webp",
      },
      {
        name: "Chicken Seekh Kebab",
        description: "Seasoned mince pressed by hand onto skewers",
        slug: "chicken-seekh-kebab",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Seekh Kebab.webp",
      },
      {
        name: "Chicken Cheese Boti",
        description: "Boti stuffed with molten cheese",
        slug: "chicken-cheese-boti",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Cheese Boti.webp",
      },
      {
        name: "Chicken Cheese Seekh Kebab",
        description: "Seekh kebab enriched with cheese",
        slug: "chicken-cheese-seekh-kebab",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Cheese Seekh Kebab.webp",
      },
      {
        name: "Green Chicken Chilli Boti",
        description: "Fresh coriander & green chilli",
        slug: "green-chicken-chilli-boti",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Green Chicken Chilli Boti.webp",
      },
      {
        name: "Reshmi Kebab",
        description: "Silky mince with a touch of saffron",
        slug: "reshmi-kebab",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Reshmi Kebab.webp",
      },
      {
        name: "Tandoori Chicken",
        description: "Deeply spiced and roasted in the clay oven",
        slug: "tandoori-chicken",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Tandoori Chicken.webp",
      },
      {
        name: "Chicken Sajji",
        description: "Balochi style chicken, roasted slowly on the bone",
        slug: "chicken-sajji",
        image: "assets/menu-items/Flames Menu Images/Chicken BBQ/Chicken Sajji.webp",
      },
    ],
  },
  {
    id: "mutton-and-beef-bbq",
    filter: "coals",
    title: "Mutton & Beef BBQ",
    intro: "Bold cuts, aromatic marinades and deep charcoal smoke.",
    items: [
      {
        name: "Mutton Seekh Kebab",
        description: "Spiced minced mutton skewers",
        slug: "mutton-seekh-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Mutton Seekh Kebab.webp",
      },
      {
        name: "Mutton Sajji",
        description: "A whole Balochi style cut, roasted slowly",
        slug: "mutton-sajji",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Mutton Sajji.webp",
      },
      {
        name: "Khaddi Kebab",
        description: "Traditionally cooked in a pit for deep aroma",
        slug: "khaddi-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Khaddi Kebab.webp",
      },
      {
        name: "Shami Kebab",
        description: "Soft lentil & mince patties",
        slug: "shami-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Shami Kebab.webp",
      },
      {
        name: "Beef Seekh Kebab",
        description: "Robust, smoky mince",
        slug: "beef-seekh-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Beef Seekh Kebab.webp",
      },
      {
        name: "Bihari Kebab",
        description: "Richly marinated beef, charred over coals in the Karachi tradition",
        slug: "bihari-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Bihari Kebab.webp",
      },
      {
        name: "Behari Boti",
        description: "Tender cubes infused with aromatic spices",
        slug: "behari-boti",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Behari Boti.webp",
      },
      {
        name: "Gola Kebab",
        description: "Mince pounded by hand for a silky texture",
        slug: "gola-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Gola Kebab.webp",
      },
      {
        name: "Chapli Kebab",
        description: "Peshawari minced kebab, shaped flat and pan fried",
        slug: "chapli-kebab",
        image: "assets/menu-items/Flames Menu Images/Mutton & Beef BBQ/Chapli Kebab.webp",
      },
    ],
  },
  {
    id: "from-the-sea",
    filter: "coals",
    title: "From the Sea",
    intro: "Flavours of the river, kissed by the grill.",
    items: [
      {
        name: "Fish Tikka",
        description: "Marinated river fish grilled over charcoal",
        slug: "fish-tikka",
        image: "assets/menu-items/Flames Menu Images/From the Sea/Fish Tikka.webp",
      },
      {
        name: "Palla Fish",
        description: "A prized Sindhi speciality from the Indus",
        slug: "palla-fish",
        image: "assets/menu-items/Flames Menu Images/From the Sea/Palla Fish.webp",
      },
    ],
  },
  {
    id: "kitchen-of-the-indus",
    filter: "kitchen",
    title: "Chicken Karahi",
    intro: "Cooked fast, served bubbling and made for sharing.",
    items: [
      {
        name: "Chicken Karahi",
        description: "The house classic, tomato & green chilli",
        slug: "chicken-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Chicken Karahi.webp",
      },
      {
        name: "Chicken White Karahi",
        description: "Creamy, peppery, no tomato",
        slug: "chicken-white-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Chicken White Karahi.webp",
      },
      {
        name: "Chicken Shinwari Karahi",
        description: "Pashtun style cooking with minimal spice and bold flavour",
        slug: "chicken-shinwari-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Chicken Shinwari Karahi.webp",
      },
      {
        name: "Chicken Achari Karahi",
        description: "Tangy karahi seasoned with pickling spices",
        slug: "chicken-achari-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Chicken Achari Karahi.webp",
      },
      {
        name: "Chicken Smoke Karahi",
        description: "Finished with aromatic coal smoke (dhungar)",
        slug: "chicken-smoke-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Chicken Smoke Karahi.webp",
      },
    ],
  },
  {
    id: "mutton-karahi",
    filter: "kitchen",
    title: "Mutton Karahi",
    intro: "Cooked slowly on the bone for full, generous flavour.",
    items: [
      {
        name: "Mutton Karahi",
        description: "Cooked slowly on the bone",
        slug: "mutton-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Mutton Karahi.webp",
      },
      {
        name: "Mutton Shinwari",
        description: "Prepared in the Peshawari tradition of Landi Kotal",
        slug: "mutton-shinwari",
        image: "assets/menu-items/Flames Menu Images/Karahi/Mutton Shinwari.webp",
      },
      {
        name: "Mutton Smoke Karahi",
        description: "Finished with aromatic coal smoke",
        slug: "mutton-smoke-karahi",
        image: "assets/menu-items/Flames Menu Images/Karahi/Mutton Smoke Karahi.webp",
      },
      {
        name: "Namkeen Gosht",
        description: "Peshawari karahi with salt & pepper, no masala",
        slug: "namkeen-gosht",
        image: "assets/menu-items/Flames Menu Images/Karahi/Namkeen Gosht Peshawari Karahi.webp",
      },
    ],
  },
  {
    id: "boneless-handi",
    filter: "kitchen",
    title: "Boneless Handi",
    intro: "Silky gravies, gentle heat and comforting richness.",
    items: [
      {
        name: "Chicken Boneless Handi",
        description: "Rich and gently simmered",
        slug: "chicken-boneless-handi",
        image: "assets/menu-items/Flames Menu Images/Handi (Boneless)/Chicken Boneless Handi.webp",
      },
      {
        name: "Chicken White Makhani Handi",
        description: "Buttery, creamy white gravy",
        slug: "chicken-white-makhani-handi",
        image: "assets/menu-items/Flames Menu Images/Handi (Boneless)/Chicken White Makhani Handi.webp",
      },
      {
        name: "Chicken Achari Handi",
        description: "Seasoned with tangy pickling spices",
        slug: "chicken-achari-handi",
        image: "assets/menu-items/Flames Menu Images/Handi (Boneless)/Chicken Achari Handi.webp",
      },
      {
        name: "Chicken Jalfrezi Handi",
        description: "Peppers, onions & tomato",
        slug: "chicken-jalfrezi-handi",
        image: "assets/menu-items/Flames Menu Images/Handi (Boneless)/Chicken Jalfrezi Handi.webp",
      },
      {
        name: "Chicken Green Chilli Handi",
        description: "Fresh heat",
        slug: "chicken-green-chilli-handi",
        image: "assets/menu-items/Flames Menu Images/Handi (Boneless)/Chicken Green Chilli Handi.webp",
      },
      {
        name: "Chicken Ginger Handi",
        description: "Warming, with fresh ginger at the forefront",
        slug: "chicken-ginger-handi",
        image: "assets/menu-items/Flames Menu Images/Handi (Boneless)/Chicken Ginger Handi.webp",
      },
    ],
  },
  {
    id: "signature-chicken-curries",
    filter: "kitchen",
    title: "Signature Chicken Curries",
    intro: "Familiar favourites with a Flames finish.",
    items: [
      {
        name: "Chicken Korma",
        description: "Mughlai braise, aromatic",
        slug: "chicken-korma",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Chicken Korma.webp",
      },
      {
        name: "Chicken Makhani",
        description: "Butter chicken",
        slug: "chicken-makhani",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Chicken Makhani.webp",
      },
    ],
  },
  {
    id: "slow-cooked-mutton",
    filter: "kitchen",
    title: "Slow Cooked Mutton",
    intro: "Regional recipes shaped by spice, tradition and patient cooking.",
    items: [
      {
        name: "Mutton Qorma",
        description: "Royal Mughlai gravy",
        slug: "mutton-qorma",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Mutton Qorma.webp",
      },
      {
        name: "Mutton White Qorma",
        description: "A delicate braise of almond and yoghurt",
        slug: "mutton-white-qorma",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Mutton White Qorma.webp",
      },
      {
        name: "Aloo Gosht",
        description: "Comforting potato and mutton, prepared in the home style",
        slug: "aloo-gosht",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Aloo Gosht.webp",
      },
      {
        name: "Rogan Josh",
        description: "Kashmiri red braise",
        slug: "rogan-josh",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Rogan Josh.webp",
      },
      {
        name: "Yakhni",
        description: "Delicate yoghurt stock curry",
        slug: "yakhni",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Yakhni.webp",
      },
      {
        name: "Gushtaba",
        description: "Kashmiri minced meatballs",
        slug: "gushtaba",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Gushtaba.webp",
      },
      {
        name: "Tabak Maaz",
        description: "Fried Kashmiri ribs",
        slug: "tabak-maaz",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Tabak Maaz.webp",
      },
      {
        name: "Seyal Gosht",
        description: "Sindhi braise with onion and tomato",
        slug: "seyal-gosht",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Seyal Gosht.webp",
      },
      {
        name: "Dampukht",
        description: "Balochi style meat, sealed and slowly steamed",
        slug: "dampukht",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Dampukht.webp",
      },
      {
        name: "Balochi Rosh",
        description: "Cooked simply with salt to preserve the pure meat flavour",
        slug: "balochi-rosh",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Balochi Rosh.webp",
      },
      {
        name: "Landhi",
        description: "A traditional speciality of carefully cured meat",
        slug: "landhi",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Landhi.webp",
      },
    ],
  },
  {
    id: "beef-curries",
    filter: "kitchen",
    title: "Beef Curries",
    intro: "Deeply savoury, warmly spiced classics.",
    items: [
      {
        name: "Beef Korma",
        description: "Mughlai braise",
        slug: "beef-korma",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Beef Korma.webp",
      },
      {
        name: "Aloo Gosht (Beef)",
        description: "Potato and beef prepared in the home style",
        slug: "aloo-gosht-beef",
        image: "assets/menu-items/Flames Menu Images/Signature Curries/Aloo Gosht Beef.webp",
      },
    ],
  },
  {
    id: "nihari-paya-and-haleem",
    filter: "kitchen",
    title: "Nihari, Paya & Haleem",
    intro: "Specialities cooked patiently and served from morning into night.",
    items: [
      {
        name: "Beef Nihari",
        description: "Beef shank simmered overnight in a spiced gravy",
        slug: "beef-nihari",
        image: "assets/menu-items/Flames Menu Images/Nihari, Paya & Haleem/Beef Nihari.webp",
      },
      {
        name: "Paye",
        description: "Rich, gelatinous, traditional trotters",
        slug: "paye",
        image: "assets/menu-items/Flames Menu Images/Nihari, Paya & Haleem/Paye Trotters.webp",
      },
      {
        name: "Maghaz Masala",
        description: "Spiced brain bhuna",
        slug: "maghaz-masala",
        image: "assets/menu-items/Flames Menu Images/Nihari, Paya & Haleem/Maghaz Masala.webp",
      },
      {
        name: "Haleem",
        description: "Wheat and lentils with your choice of chicken, mutton or beef",
        slug: "haleem",
        image: "assets/menu-items/Flames Menu Images/Nihari, Paya & Haleem/Haleem.webp",
      },
    ],
  },
  {
    id: "rice-and-pulao",
    filter: "kitchen",
    title: "Rice & Pulao",
    intro: "Fragrant grains layered with the flavours of the region.",
    items: [
      {
        name: "Chicken Biryani",
        description: "Layered and fragrant in the Karachi tradition",
        slug: "chicken-biryani",
        image: "assets/menu-items/Flames Menu Images/Rice & Pulao/Chicken Biryani.webp",
      },
      {
        name: "Mutton Biryani",
        description: "Rich, classic",
        slug: "mutton-biryani",
        image: "assets/menu-items/Flames Menu Images/Rice & Pulao/Mutton Biryani.webp",
      },
      {
        name: "Bannu Beef Pulao",
        description: "A KPK speciality with beef, rice and warm spices",
        slug: "bannu-beef-pulao",
        image: "assets/menu-items/Flames Menu Images/Rice & Pulao/Bannu Beef Pulao.webp",
      },
      {
        name: "Chicken Pulao",
        description: "Fragrant, lightly spiced",
        slug: "chicken-pulao",
        image: "assets/menu-items/Flames Menu Images/Rice & Pulao/Chicken Pulao.webp",
      },
      {
        name: "Mutton Kabuli Pulao",
        description: "Peshawari favourite",
        slug: "mutton-kabuli-pulao",
        image: "assets/menu-items/Flames Menu Images/Rice & Pulao/Mutton Kabuli Pulao.webp",
      },
      {
        name: "Kashmiri Pulao",
        description: "A sweet and savoury pairing of fruit and nuts",
        slug: "kashmiri-pulao",
        image: "assets/menu-items/Flames Menu Images/Rice & Pulao/Kashmiri Pulao.webp",
      },
    ],
  },
  {
    id: "daal-and-sabzi",
    filter: "kitchen",
    title: "Daal & Sabzi",
    intro: "Everyday comfort, tempered beautifully.",
    items: [
      {
        name: "Shahi Daal Makhni",
        description: "Buttery chana daal cooked slowly",
        slug: "shahi-daal-makhni",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Shahi Daal Makhni Chana Daal.webp",
      },
      {
        name: "Shahi Daal Mash",
        description: "White urad, rich finish",
        slug: "shahi-daal-mash",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Shahi Daal Mash.webp",
      },
      {
        name: "Daal Mash Fry",
        description: "Tempered & fried",
        slug: "daal-mash-fry",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Daal Mash Fry.webp",
      },
      {
        name: "Daal Channa Fry",
        description: "Spiced chana",
        slug: "daal-channa-fry",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Daal Channa Fry.webp",
      },
      {
        name: "Tarka Daal",
        description: "Everyday comfort",
        slug: "tarka-daal",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Tarka Daal.webp",
      },
      {
        name: "Dal Pakwan",
        description: "Sindhi daal with crisp bread",
        slug: "dal-pakwan",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Dal Pakwan.webp",
      },
      {
        name: "Channay",
        description: "Spiced chickpeas",
        slug: "channay",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Channay.webp",
      },
      {
        name: "Achari Mix Sabzi",
        description: "Seasonal vegetables with tangy pickling spices",
        slug: "achari-mix-sabzi",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Achari Mix Sabzi.webp",
      },
      {
        name: "Sada Mix Sabzi",
        description: "Simple mixed vegetables",
        slug: "sada-mix-sabzi",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Sada Mix Sabzi.webp",
      },
      {
        name: "Bhindi",
        description: "Okra bhuna",
        slug: "bhindi",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Bhindi.webp",
      },
      {
        name: "Dum Aloo",
        description: "Kashmiri spiced potatoes",
        slug: "dum-aloo",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Dum Aloo.webp",
      },
      {
        name: "Sai Bhaji",
        description: "Sindhi spinach & lentil",
        slug: "sai-bhaji",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Sai Bhaji.webp",
      },
      {
        name: "Besan Curry",
        description: "Tangy gram flour curry with vegetables",
        slug: "besan-curry",
        image: "assets/menu-items/Flames Menu Images/Daal & Sabzi/Besan Curry Sindhi Kadhi.webp",
      },
    ],
  },
  {
    id: "breads-from-the-tandoor",
    filter: "kitchen",
    title: "Breads from the Tandoor",
    intro: "Served hot, shaped by hand and made to complete the table.",
    items: [
      {
        name: "Plain Naan",
        description: "Fresh from the tandoor",
        slug: "plain-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Plain Naan.webp",
      },
      {
        name: "Roghni Naan",
        description: "Enriched with milk and finished with sesame",
        slug: "roghni-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Roghni Naan.webp",
      },
      {
        name: "Garlic Naan",
        description: "Fragrant garlic finish",
        slug: "garlic-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Garlic Naan.webp",
      },
      {
        name: "Cheese Naan",
        description: "Filled with melted cheese",
        slug: "cheese-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Cheese Naan.webp",
      },
      {
        name: "Kalonji Naan",
        description: "Nigella seed",
        slug: "kalonji-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Kalonji Naan.webp",
      },
      {
        name: "Aloo Naan",
        description: "Filled with seasoned potato",
        slug: "aloo-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Aloo Naan.webp",
      },
      {
        name: "Qeema Naan",
        description: "Filled with aromatic spiced mince",
        slug: "qeema-naan",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Qeema Naan.webp",
      },
      {
        name: "Rumali Roti",
        description: "Delicately thin, like a handkerchief",
        slug: "rumali-roti",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Rumali Roti.webp",
      },
      {
        name: "Plain Roti / Chapati",
        description: "A table essential",
        slug: "plain-roti-chapati",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Plain Roti - Chapati.webp",
      },
      {
        name: "Sheermal",
        description: "Sweet saffron flatbread",
        slug: "sheermal",
        image: "assets/menu-items/Flames Menu Images/Breads from the Tandoor/Sheermal.webp",
      },
    ],
  },
  {
    id: "salads-and-starters",
    filter: "starters",
    title: "Salads & Starters",
    intro: "Fresh, cool and ready to begin.",
    items: [
      {
        name: "Fresh Green Salad",
        description: "Crisp seasonal greens",
        slug: "fresh-green-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Fresh Green Salad.webp",
      },
      {
        name: "Kachumar Salad",
        description: "Onion, tomato, cucumber & lemon",
        slug: "kachumar-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Kachumar Salad.webp",
      },
      {
        name: "Russian Salad",
        description: "Creamy & cool",
        slug: "russian-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Russian Salad.webp",
      },
      {
        name: "Fruit Salad",
        description: "Seasonal",
        slug: "fruit-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Fruit Salad.webp",
      },
      {
        name: "BBQ Chicken Salad",
        description: "Grilled chicken over greens",
        slug: "bbq-chicken-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/BBQ Chicken Salad.webp",
      },
      {
        name: "Chicken Pasta Salad",
        description: "A creamy classic",
        slug: "chicken-pasta-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Chicken Pasta Salad.webp",
      },
      {
        name: "Chicken Italian Salad",
        description: "Fresh, herby and savoury",
        slug: "chicken-italian-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Chicken Italian Salad.webp",
      },
      {
        name: "Chicken Sesame Salad",
        description: "Toasted sesame finish",
        slug: "chicken-sesame-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Chicken Sesame Salad.webp",
      },
      {
        name: "Chicken Kalonji Salad",
        description: "Seasoned with aromatic nigella seed",
        slug: "chicken-kalonji-salad",
        image: "assets/menu-items/Flames Menu Images/Salads & Starters/Chicken Kalonji Salad.webp",
      },
    ],
  },
  {
    id: "subah-ka-nashta",
    filter: "breakfast",
    title: "Subah Ka Nashta",
    intro: "A generous start, served every morning.",
    items: [
      {
        name: "Halwa Puri",
        description: "Suji halwa, puri & channay",
        slug: "halwa-puri",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Halwa Puri.webp",
      },
      {
        name: "Suji Halwa",
        description: "Warm semolina halwa",
        slug: "suji-halwa",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Suji Halwa.webp",
      },
      {
        name: "Aloo Bhujia",
        description: "Golden, spiced potatoes",
        slug: "aloo-bhujia",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Aloo Bhujia.webp",
      },
      {
        name: "Channay",
        description: "Chickpea curry",
        slug: "channay",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Channay.webp",
      },
      {
        name: "Murgh Cholay",
        description: "Chicken & chickpeas",
        slug: "murgh-cholay",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Murgh Cholay.webp",
      },
      {
        name: "Omelette",
        description: "Vegetable / cheese / mushroom / plain",
        slug: "omelette",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Omelette.webp",
      },
      {
        name: "Egg Fry",
        description: "Simple and satisfying",
        slug: "egg-fry",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Egg Fry.webp",
      },
      {
        name: "Paratha",
        description: "Plain / aloo",
        slug: "paratha",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Paratha.webp",
      },
      {
        name: "Koki",
        description: "Sindhi spiced flatbread",
        slug: "koki",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Koki.webp",
      },
      {
        name: "Nihari & Paya",
        description: "Weekend morning specials",
        slug: "nihari-and-paya",
        image: "assets/menu-items/Flames Menu Images/Breakfast (Subho ka Nashta)/Nihari & Paya.webp",
      },
    ],
  },
  {
    id: "chai-khana",
    filter: "chai",
    title: "Everyday Chai",
    intro: "Brewed slowly and poured hot. The heart of every gathering by the Indus.",
    items: [
      {
        name: "Doodh Patti",
        description: "Brewed entirely in milk, the timeless classic",
        slug: "doodh-patti",
        image: "assets/menu-items/Flames Menu Images/Everyday Chai/Doodh Patti.webp",
      },
      {
        name: "Karak Chai",
        description: "Reduced slowly for a bold and aromatic cup",
        slug: "karak-chai",
        image: "assets/menu-items/Flames Menu Images/Everyday Chai/Karak Chai.webp",
      },
      {
        name: "Elaichi Chai",
        description: "Fragrant with cardamom",
        slug: "elaichi-chai",
        image: "assets/menu-items/Flames Menu Images/Everyday Chai/Elaichi Chai.webp",
      },
      {
        name: "Adrak Chai",
        description: "Fresh ginger",
        slug: "adrak-chai",
        image: "assets/menu-items/Flames Menu Images/Everyday Chai/Adrak Chai.webp",
      },
      {
        name: "Masala Chai",
        description: "Warm spice blend",
        slug: "masala-chai",
        image: "assets/menu-items/Flames Menu Images/Everyday Chai/Masala Chai.webp",
      },
    ],
  },
  {
    id: "regional-specialities",
    filter: "chai",
    title: "Regional Specialities",
    intro: "Distinctive pours inspired by tea traditions across Pakistan.",
    items: [
      {
        name: "Kashmiri Pink Chai",
        description: "Noon chai with its signature rose colour and crushed pistachio",
        slug: "kashmiri-pink-chai",
        image: "assets/menu-items/Flames Menu Images/Regional & Specialty Chai/Kashmiri Pink Chai Noon Chai.webp",
      },
      {
        name: "Peshawari Qehwa",
        description: "Green tea, cardamom & saffron",
        slug: "peshawari-qehwa",
        image: "assets/menu-items/Flames Menu Images/Regional & Specialty Chai/Peshawari Qehwa.webp",
      },
      {
        name: "Sulemani Chai",
        description: "Black tea, lemon, no milk",
        slug: "sulemani-chai",
        image: "assets/menu-items/Flames Menu Images/Regional & Specialty Chai/Sulemani Chai.webp",
      },
    ],
  },
  {
    id: "flames-signatures",
    filter: "chai",
    title: "Flames Signatures",
    intro: "Our own expressions of the tea ritual.",
    items: [
      {
        name: "Flames Signature Karak",
        description: "Reduced further and finished with condensed milk",
        slug: "flames-signature-karak",
        image: "assets/menu-items/Flames Menu Images/Flames Signature Chai/Flames Signature Karak.webp",
      },
      {
        name: "Kesar Doodh Patti",
        description: "Infused with saffron",
        slug: "kesar-doodh-patti",
        image: "assets/menu-items/Flames Menu Images/Flames Signature Chai/Kesar Doodh Patti.webp",
      },
      {
        name: "Honey Pine Nut Kahwa",
        description: "Green tea with honey and pine nuts",
        slug: "honey-pine-nut-kahwa",
        image: "assets/menu-items/Flames Menu Images/Flames Signature Chai/Honey-Pine Nut Kahwa.webp",
      },
    ],
  },
  {
    id: "cold-by-the-river",
    filter: "chai",
    title: "Cold by the River",
    intro: "Summer favourites, served chilled.",
    items: [
      {
        name: "Iced Karak",
        description: "Chilled, sweet & strong",
        slug: "iced-karak",
        image: "assets/menu-items/Flames Menu Images/Cold by the River/Iced Karak.webp",
      },
      {
        name: "Doodh Soda",
        description: "Milk, soda & a hint of cardamom",
        slug: "doodh-soda",
        image: "assets/menu-items/Flames Menu Images/Cold by the River/Doodh Soda.webp",
      },
    ],
  },
  {
    id: "mithai-and-sweet-endings",
    filter: "sweets",
    title: "Mithai and Sweet Endings",
    intro: "A graceful finish to the feast.",
    items: [
      {
        name: "Gulab Jamun",
        description: "Served warm and soaked in syrup",
        slug: "gulab-jamun",
        image: "assets/menu-items/Flames Menu Images/Mithai/Gulab Jamun.webp",
      },
      {
        name: "Ras Malai",
        description: "Soft milk dumplings in saffron cream",
        slug: "ras-malai",
        image: "assets/menu-items/Flames Menu Images/Mithai/Ras Malai.webp",
      },
      {
        name: "Kheer",
        description: "Rice pudding",
        slug: "kheer",
        image: "assets/menu-items/Flames Menu Images/Mithai/Kheer.webp",
      },
      {
        name: "Gajar ka Halwa",
        description: "Seasonal carrot halwa with ghee and nuts",
        slug: "gajar-ka-halwa",
        image: "assets/menu-items/Flames Menu Images/Mithai/Gajar ka Halwa.webp",
      },
      {
        name: "Shahi Tukda",
        description: "Royal bread pudding",
        slug: "shahi-tukda",
        image: "assets/menu-items/Flames Menu Images/Mithai/Shahi Tukda.webp",
      },
      {
        name: "Zarda",
        description: "Sweet saffron rice",
        slug: "zarda",
        image: "assets/menu-items/Flames Menu Images/Mithai/Zarda.webp",
      },
      {
        name: "Jalebi",
        description: "Crisp & syrupy",
        slug: "jalebi",
        image: "assets/menu-items/Flames Menu Images/Mithai/Jalebi.webp",
      },
      {
        name: "Kulfi",
        description: "Traditional frozen milk",
        slug: "kulfi",
        image: "assets/menu-items/Flames Menu Images/Mithai/Kulfi.webp",
      },
      {
        name: "Falooda",
        description: "Rose, vermicelli & ice cream",
        slug: "falooda",
        image: "assets/menu-items/Flames Menu Images/Mithai/Falooda.webp",
      },
    ],
  },
];

// The unique-dish count (124: Channay appears in two sections) is computed
// from live data by uniqueDishCount() in src/lib/menu-source.ts, deliberately
// not exported as a constant here — a static number would go stale the moment
// the Sanity menu diverges from this fixture.
