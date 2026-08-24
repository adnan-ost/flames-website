import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * One menu section. Mirrors `MenuSection` in src/data/menu.ts.
 *
 * `items` is an array of references rather than nested objects so a dish can
 * appear in more than one section without being duplicated — which the current
 * menu already needs, since Channay appears in two.
 */
export const menuSection = defineType({
  name: "menuSection",
  title: "Menu section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category name",
      type: "string",
      description: "The heading on the menu, e.g. \"Chicken BBQ\".",
      validation: (rule) => rule.required().error("Every category needs a name."),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "Filled in from the name. Changing it breaks any link that points straight to this category.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro line",
      type: "text",
      rows: 2,
      description: "The sentence under the category heading.",
    }),
    defineField({
      name: "filter",
      title: "Filter button",
      type: "string",
      description: "Which button on the menu page shows this category.",
      options: {
        list: [
          { title: "BBQ", value: "coals" },
          { title: "Main kitchen", value: "kitchen" },
          { title: "Starters", value: "starters" },
          { title: "Breakfast", value: "breakfast" },
          { title: "Chai", value: "chai" },
          { title: "Desserts", value: "sweets" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Position on the menu",
      type: "number",
      description: "Lower numbers come first. 0 is the top of the menu.",
    }),
    defineField({
      name: "items",
      title: "Dishes in this category",
      type: "array",
      description:
        "Drag to reorder. A dish can sit in more than one category — adding it here does not copy it.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "dish" }] })],
    }),
  ],
  orderings: [
    {
      title: "Menu order",
      name: "menuOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", order: "order", intro: "intro" },
    prepare({ title, order, intro }) {
      const position = typeof order === "number" ? `${order + 1}.` : "—";
      return { title: `${position} ${title}`, subtitle: intro ?? "" };
    },
  },
});
