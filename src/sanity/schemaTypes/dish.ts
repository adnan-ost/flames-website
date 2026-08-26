import { defineField, defineType } from "sanity";

/**
 * One dish. Mirrors `MenuItem` in src/data/menu.ts, plus the price.
 *
 * The price used to carry a status (signed off / not checked / rough guess) and
 * a source string. That existed while prices were derived from a comparable
 * restaurant's menu and nothing was verified — it stopped an unchecked number
 * passing as a real one. The owner signed off all 124 prices on 25 Aug 2026, so
 * every price is now simply what the restaurant charges, and the machinery was
 * costing editors a validation error for no benefit. The derivation of the
 * original figures is still recorded in git.
 */
export const dish = defineType({
  name: "dish",
  title: "Dish",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Exactly as it should read on the menu.",
      validation: (rule) => rule.required().error("Every dish needs a name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "Filled in automatically from the name. Only change it if you know why.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "One line, as it appears under the dish name on the website.",
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "image",
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
      description:
        "Numbers only — no 'Rs' and no commas. Leave it empty to show N/A on the website. " +
        "If the dish is sold in sizes, put the smallest one here and list them all below.",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      description:
        "Only for a dish sold in more than one size — Half and Full, 8 pieces and 16, 6 and 12. " +
        "Leave this empty for a dish sold one way; the price above is then shown on its own. " +
        "Add at least two: a single size on its own tells a customer less than the plain price does.",
      of: [
        {
          type: "object",
          name: "size",
          fields: [
            defineField({
              name: "label",
              title: "Size",
              type: "string",
              description: "How it should read on the menu — 'Half', 'Full', '8 pieces'.",
              validation: (rule) => rule.required().error("A size needs a name."),
            }),
            defineField({
              name: "price",
              title: "Price in rupees",
              type: "number",
              validation: (rule) =>
                rule.required().positive().error("A size needs a price."),
            }),
          ],
          preview: {
            select: { title: "label", price: "price" },
            prepare({ title, price }) {
              return {
                title,
                subtitle:
                  typeof price === "number" ? `Rs ${price.toLocaleString("en-PK")}` : "No price",
              };
            },
          },
        },
      ],
      validation: (rule) =>
        rule.custom((sizes) => {
          if (!sizes || !Array.isArray(sizes) || sizes.length === 0) return true;
          return sizes.length > 1
            ? true
            : "Either list two or more sizes, or remove this and use the single price above.";
        }),
    }),
  ],
  preview: {
    select: { title: "name", price: "price", sizes: "sizes", media: "image" },
    prepare({ title, price, sizes, media }) {
      const sized = Array.isArray(sizes) && sizes.length > 1 ? ` · ${sizes.length} sizes` : "";
      return {
        title,
        subtitle:
          (typeof price === "number"
            ? `Rs ${price.toLocaleString("en-PK")}`
            : "No price yet") + sized,
        media,
      };
    },
  },
});
