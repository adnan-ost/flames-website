import { defineField, defineType } from "sanity";

/**
 * One dish. Mirrors `MenuItem` in src/data/menu.ts, plus the price fields that
 * src/data/prices.ts keeps separately — staff editing prices is the reason the
 * Studio exists, so the price and its provenance live on the document.
 *
 * The status rules from AGENTS.md are enforced here: a price cannot be saved
 * without saying where it came from, so an unverified number can never pass
 * for a signed-off one.
 */
export const dish = defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  groups: [
    { name: "details", title: "Dish", default: true },
    { name: "price", title: "Price" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "details",
      description: "Exactly as it should read on the menu.",
      validation: (rule) => rule.required().error("Every dish needs a name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "details",
      description:
        "Filled in automatically from the name. Only change it if you know why.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 2,
      description: "One line, as it appears under the dish name on the website.",
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "image",
      group: "details",
      description:
        "Top-down photo of the dish. Drag the circle to set what stays in frame when the photo is cropped.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) =>
            rule.warning("Alt text helps search engines and screen readers."),
        }),
      ],
    }),
    defineField({
      name: "price",
      title: "Price in rupees",
      type: "number",
      group: "price",
      description:
        "Numbers only — no 'Rs' and no commas. Leave it empty to show N/A on the website; an empty price is always better than a guessed one.",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "priceStatus",
      title: "Where does this price stand?",
      type: "string",
      group: "price",
      description: "The website marks anything not signed off with an asterisk.",
      options: {
        list: [
          { title: "Signed off — this is what we charge", value: "confirmed" },
          { title: "Not checked yet — taken from another restaurant's menu", value: "unconfirmed" },
          { title: "Rough guess — worked out from similar dishes", value: "estimated" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.custom((status, context) => {
          const price = (context.document as { price?: number } | undefined)?.price;
          if (typeof price === "number" && !status) {
            return "Choose where this price stands before saving.";
          }
          return true;
        }),
    }),
    defineField({
      name: "priceSource",
      title: "Where this price came from",
      type: "string",
      group: "price",
      description:
        "Where the number came from, for the sign-off review. E.g. 'Comparable Islamabad menu, p.12' or 'Confirmed by the kitchen, Aug 2026'.",
    }),
  ],
  preview: {
    select: { title: "name", price: "price", status: "priceStatus", media: "image" },
    prepare({ title, price, status, media }) {
      const amount =
        typeof price === "number" ? `Rs ${price.toLocaleString("en-PK")}` : "No price yet";
      const state =
        status === "confirmed"
          ? "signed off"
          : status === "unconfirmed"
            ? "not checked"
            : status === "estimated"
              ? "rough guess"
              : typeof price === "number"
                ? "needs a status"
                : "shows N/A";
      return { title, subtitle: `${amount} · ${state}`, media };
    },
  },
});
