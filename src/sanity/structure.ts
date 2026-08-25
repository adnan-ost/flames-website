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
 *   - "Prices" is a work queue. The job right now is signing prices off, so the
 *     Studio should put that list one click away rather than making someone
 *     remember which dishes still need checking.
 *   - "All dishes" stays available for anyone who just wants to search by name.
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
        .title("Prices")
        .child(
          S.list()
            .title("Prices")
            .items([
              S.listItem()
                .title("Needs checking")
                .child(
                  S.documentList()
                    .title("Prices that are not signed off")
                    .filter(
                      '_type == "dish" && defined(price) && priceStatus != "confirmed"',
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                    // A filtered list cannot infer what one of its rows opens
                    // into, so say it explicitly — otherwise the document pane
                    // renders empty with "Pane returned no child".
                    .child((dishId) => S.document().documentId(dishId).schemaType("dish")),
                ),
              S.listItem()
                .title("Signed off")
                .child(
                  S.documentList()
                    .title("Prices confirmed by the restaurant")
                    .filter('_type == "dish" && priceStatus == "confirmed"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                    // A filtered list cannot infer what one of its rows opens
                    // into, so say it explicitly — otherwise the document pane
                    // renders empty with "Pane returned no child".
                    .child((dishId) => S.document().documentId(dishId).schemaType("dish")),
                ),
              S.listItem()
                .title("No price yet")
                .child(
                  S.documentList()
                    .title("Dishes showing N/A on the website")
                    .filter('_type == "dish" && !defined(price)')
                    .apiVersion(apiVersion)
                    .defaultOrdering([{ field: "name", direction: "asc" }])
                    // A filtered list cannot infer what one of its rows opens
                    // into, so say it explicitly — otherwise the document pane
                    // renders empty with "Pane returned no child".
                    .child((dishId) => S.document().documentId(dishId).schemaType("dish")),
                ),
            ]),
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
