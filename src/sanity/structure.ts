import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";

/**
 * Studio sidebar.
 *
 * The people editing this are kitchen and front-of-house staff, not developers.
 * The default Studio hands them a flat list of 124 dishes and a flat list of 20
 * categories, which is not how anyone thinks about a menu. So:
 *
 *   - "The menu" mirrors the printed menu: categories in menu order, and inside
 *     each one, only the dishes that belong to it.
 *   - "All dishes" stays available for anyone who just wants to search by name.
 *
 * There was also a price work-queue here, splitting dishes by whether their
 * price was signed off. Every price is signed off now, so two of its three
 * lists were permanently empty.
 *
 * Deliberately not shown: a dish count on each category. AGENTS.md rules those
 * out, and while that rule is written about the website, the reasoning (counts
 * invite people to treat the menu as a scoreboard) applies here too.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Flames by the Indus")
    .items([
      S.listItem()
        .title("The menu")
        .child(
          S.documentTypeList("menuSection")
            .title("Categories")
            .defaultOrdering([{ field: "order", direction: "asc" }])
            .child((sectionId) =>
              S.list()
                .title("Category")
                .items([
                  S.listItem()
                    .title("Dishes in this category")
                    .child(
                      S.documentList()
                        .title("Dishes")
                        .filter(
                          '_type == "dish" && _id in *[_id == $sectionId][0].items[]._ref',
                        )
                        .params({ sectionId })
                        .apiVersion(apiVersion)
                        .defaultOrdering([{ field: "name", direction: "asc" }])
                        .child((dishId) =>
                          S.document().documentId(dishId).schemaType("dish"),
                        ),
                    ),
                  S.divider(),
                  S.listItem()
                    .title("Category name, intro and order")
                    .child(
                      S.document().documentId(sectionId).schemaType("menuSection"),
                    ),
                ]),
            ),
        ),

      S.divider(),

      S.listItem()
        .title("All dishes")
        .child(
          S.documentTypeList("dish")
            .title("All dishes")
            .defaultOrdering([{ field: "name", direction: "asc" }]),
        ),
    ]);
