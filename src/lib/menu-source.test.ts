import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MENU_SECTIONS } from "@/data/menu";

/**
 * The Sanity→local fallback in menu-source.ts is load-bearing: AGENTS.md
 * promises that a build against a broken or empty Sanity project still ships
 * the full menu. These tests are that promise, in executable form.
 *
 * The module reads `client` at import time, so each case swaps in its own
 * client with vi.doMock and re-imports the module fresh. resetModules also
 * gives that fresh module its own copy of @/data/menu, so the loader returns
 * that copy: identity checks against it prove the fallback is the local menu
 * itself, not merely something shaped like it.
 */
async function loadMenuSource(client: unknown) {
  vi.resetModules();
  vi.doMock("@/sanity/client", () => ({ client }));
  const menuSource = await import("@/lib/menu-source");
  const { MENU_SECTIONS: localSections } = await import("@/data/menu");
  return { ...menuSource, localSections };
}

/** A minimal well-formed section as the GROQ query returns it. */
function rawSection(overrides: Record<string, unknown> = {}) {
  return {
    id: "chicken-bbq",
    filter: "coals",
    title: "Chicken BBQ",
    intro: "Off the coals.",
    items: [
      {
        name: "Chicken Tikka",
        description: "Charred quarters.",
        slug: "chicken-tikka",
        image: { asset: { _ref: "image-abc-800x800-webp" } },
        price: 1180,
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  // The fallback logs its reason; keep test output clean and assertable.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("@/sanity/client");
});

describe("getMenuSections falls back to the local menu", () => {
  it("when Sanity is not configured (client is null)", async () => {
    const { getMenuSections, localSections } = await loadMenuSource(null);
    expect(await getMenuSections()).toBe(localSections);
  });

  it("when the fetch throws", async () => {
    const { getMenuSections, localSections } = await loadMenuSource({
      fetch: async () => {
        throw new Error("network down");
      },
    });
    expect(await getMenuSections()).toBe(localSections);
    expect(console.error).toHaveBeenCalled();
  });

  it("when Sanity returns no sections", async () => {
    const { getMenuSections, localSections } = await loadMenuSource({ fetch: async () => [] });
    expect(await getMenuSections()).toBe(localSections);
  });

  it("when Sanity returns a non-array", async () => {
    const { getMenuSections, localSections } = await loadMenuSource({ fetch: async () => null });
    expect(await getMenuSections()).toBe(localSections);
  });

  it("when every returned section is malformed", async () => {
    const { getMenuSections, localSections } = await loadMenuSource({
      fetch: async () => [
        rawSection({ title: null }),
        rawSection({ filter: "not-a-real-filter" }),
        rawSection({ items: [] }),
        rawSection({ items: [{ name: "No slug", slug: null }] }),
      ],
    });
    expect(await getMenuSections()).toBe(localSections);
  });
});

describe("getMenuSections with usable Sanity data", () => {
  it("serves the Sanity sections, dropping only the malformed parts", async () => {
    const { getMenuSections } = await loadMenuSource({
      fetch: async () => [
        rawSection({
          items: [
            ...rawSection().items,
            { name: "Missing slug", slug: null },
            null,
          ],
        }),
        rawSection({ id: "broken", title: null }),
      ],
    });

    const sections = await getMenuSections();
    expect(sections).toHaveLength(1);
    expect(sections[0].items.map((i) => i.name)).toEqual(["Chicken Tikka"]);
  });

  it("keeps the local master as the image fallback for a known slug", async () => {
    const { getMenuSections } = await loadMenuSource({
      fetch: async () => [rawSection()],
    });

    const [section] = await getMenuSections();
    const local = MENU_SECTIONS.flatMap((s) => s.items).find(
      (i) => i.slug === "chicken-tikka",
    );
    expect(local).toBeDefined();
    expect(section.items[0].image).toBe(local?.image);
    expect(section.items[0].sanityImage).toEqual({
      asset: { _ref: "image-abc-800x800-webp" },
    });
  });

  it("treats a zero, negative or non-numeric price as no price", async () => {
    const items = [
      { ...rawSection().items[0], slug: "a", price: 0 },
      { ...rawSection().items[0], slug: "b", price: -5 },
      { ...rawSection().items[0], slug: "c", price: Number.NaN },
      { ...rawSection().items[0], slug: "d", price: 1180 },
    ];
    const { getMenuSections } = await loadMenuSource({
      fetch: async () => [rawSection({ items })],
    });

    const [section] = await getMenuSections();
    expect(section.items.map((i) => i.price)).toEqual([null, null, null, 1180]);
  });
});

describe("uniqueDishCount", () => {
  it("counts dishes by slug, not by row", async () => {
    const { uniqueDishCount } = await loadMenuSource(null);
    // Channay appears in two sections under one slug: 125 rows, 124 dishes.
    const rows = MENU_SECTIONS.reduce((n, s) => n + s.items.length, 0);
    expect(rows).toBe(125);
    expect(uniqueDishCount(MENU_SECTIONS)).toBe(124);
  });
});
