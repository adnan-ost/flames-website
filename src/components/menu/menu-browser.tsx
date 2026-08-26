"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FILTERS, type MenuFilter, type MenuItem, type MenuSection } from "@/data/menu";
import { DishCard } from "./dish-card";
import { ImagePreview } from "./image-preview";
import { PRICE_NOTICE, SERVING_SUGGESTION } from "@/lib/copy";

type View = "list" | "grid";
type Filter = MenuFilter | "all";

const VIEW_STORAGE_KEY = "flames-menu-view";
const VALID_FILTERS = new Set(FILTERS.map((f) => f.value));

/*
 * The layout choice lives on <html data-menu-view>, stamped before paint by the
 * script in the root layout and applied by CSS. React does not own it — it only
 * needs to read it, so the toggle can show which option is active.
 *
 * useSyncExternalStore is the sanctioned way to read something React does not
 * own. The previous version mirrored it into state and set that state from a
 * mount effect, which is what the cascading-render lint rule was objecting to.
 */
function subscribeMenuView(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-menu-view"],
  });
  return () => observer.disconnect();
}

function getMenuView(): View {
  return document.documentElement.dataset.menuView === "grid" ? "grid" : "list";
}

/** List on the server: the attribute only exists once the pre-paint script runs. */
function getServerMenuView(): View {
  return "list";
}

export function MenuBrowser({ sections }: { sections: MenuSection[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<MenuItem | null>(null);

  const view = useSyncExternalStore(subscribeMenuView, getMenuView, getServerMenuView);

  /*
   * The live region stays silent until the visitor actually narrows the menu,
   * so arriving on the page does not read 125 dishes out to a screen reader.
   * This is state, not a ref: a ref mutated in an effect is not readable during
   * render, and reading one anyway meant the count could be announced from a
   * stale value — or not at all until some unrelated re-render.
   */
  const [hasInteracted, setHasInteracted] = useState(false);

  /*
   * Seed the filter and search box from a shared link.
   *
   * This has to be an effect. The URL is not knowable while the page is being
   * prerendered, and reading it during the first client render would make the
   * markup disagree with the server's. next/navigation's useSearchParams would
   * read it without an effect, but it opts the whole tree out of static
   * prerendering — and the menu is the page that most needs to stay in the
   * static HTML for search engines.
   *
   * So the setState-in-effect rule is suppressed here deliberately, for the one
   * case it does not cover: seeding state once from something only the browser
   * knows.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    /* eslint-disable react-hooks/set-state-in-effect -- seeding once from the URL, see above */
    const urlFilter = params.get("filter");
    if (urlFilter && VALID_FILTERS.has(urlFilter as Filter)) {
      setFilter(urlFilter as Filter);
    }

    const urlQuery = params.get("q");
    if (urlQuery) setQuery(urlQuery);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Deep links such as #mithai-and-sweet-endings still work; the browser
    // cannot scroll to a section that had not rendered on first paint.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      // Instant, not smooth: html now has scroll-behavior: smooth, and a link
      // to a section fifteen down a 125-row page would otherwise crawl there.
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" }));
    }
  }, []);

  /* ----- write state back to the address bar, preserving other params ----- */
  const didSyncUrl = useRef(false);

  useEffect(() => {
    /*
     * Skip the very first run. The URL already says what it says, and rewriting
     * it here would race the seeding effect above: that one sets its flag before
     * this effect first runs, so the old guard never actually held. A page
     * opened on /menu?filter=coals had its params stripped and rewritten.
     */
    if (!didSyncUrl.current) {
      didSyncUrl.current = true;
      return;
    }

    const params = new URLSearchParams(window.location.search);

    if (filter === "all") params.delete("filter");
    else params.set("filter", filter);

    if (!query.trim()) params.delete("q");
    else params.set("q", query.trim());

    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }, [filter, query]);

  const setViewPersisted = useCallback((next: View) => {
    // The attribute drives the layout (see globals.css) and the store above
    // reads it back, so there is no React state to keep in step.
    document.documentElement.dataset.menuView = next;
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // Same as above — the layout still switches, it just is not remembered.
    }
  }, []);

  /* ----- filtering ----- */
  const visibleSections = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return sections
      .filter((section) => filter === "all" || section.filter === filter)
      .map((section) => ({
        ...section,
        items: needle
          ? section.items.filter(
              (item) =>
                item.name.toLowerCase().includes(needle) ||
                item.description.toLowerCase().includes(needle),
            )
          : section.items,
      }))
      .filter((section) => section.items.length > 0);
  }, [filter, query, sections]);

  const resultCount = useMemo(
    () => visibleSections.reduce((total, section) => total + section.items.length, 0),
    [visibleSections],
  );

  const isFiltered = filter !== "all" || query.trim().length > 0;

  function toggleSection(id: string) {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /*
   * Every visitor-driven change to the result set goes through these two, so the
   * live region knows a change was asked for rather than inferring it from a
   * render.
   */
  function changeQuery(next: string) {
    setHasInteracted(true);
    setQuery(next);
  }

  function changeFilter(next: Filter) {
    setHasInteracted(true);
    setFilter(next);
  }

  function reset() {
    setHasInteracted(true);
    setQuery("");
    setFilter("all");
    setCollapsed(new Set());
  }

  return (
    <>
      {/* ----- controls ----- */}
      <div /* No background of its own: the carbon weave behind the page shows through,
           and the blur is what keeps the controls legible as rows scroll under. */
        className="sticky top-[var(--brand-header-h)] z-30 border-b border-line py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 md:px-8">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
                placeholder="Search dishes, e.g. karahi, chai, seekh"
                aria-label="Search the menu"
                className="w-full border border-line bg-paper/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-orange"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => changeQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 -translate-y-1/2 px-2 text-muted transition-colors hover:text-orange"
                >
                  &times;
                </button>
              ) : null}
            </div>

            <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Layout">
              {(["list", "grid"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setViewPersisted(option)}
                  aria-pressed={view === option}
                  className={`border px-3 py-2.5 text-xs capitalize transition-colors ${
                    view === option
                      ? "border-orange bg-orange text-white"
                      : "border-line bg-paper/60 text-muted hover:text-ink"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => changeFilter(option.value)}
                aria-pressed={filter === option.value}
                className={`border px-3.5 py-1.5 text-xs tracking-wide transition-colors ${
                  filter === option.value
                    ? "border-transparent bg-orange text-white"
                    : "border-line bg-paper/50 text-muted hover:border-orange/40 hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}

            {isFiltered ? (
              <button
                type="button"
                onClick={reset}
                className="ml-auto px-3 py-1.5 text-xs text-muted underline underline-offset-4 transition-colors hover:text-orange"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {hasInteracted ? `${resultCount} dishes shown` : ""}
      </p>

      {/* ----- sections ----- */}
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        {visibleSections.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-light text-ink">No dishes match that search.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 border border-orange px-5 py-2 text-sm text-orange transition-colors hover:bg-orange hover:text-white"
            >
              Show the full menu
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {visibleSections.map((section) => {
              const isCollapsed = collapsed.has(section.id);

              return (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  /* Clears the sticky header *and* the filter bar above it. */
                  className="scroll-mt-[calc(var(--brand-header-h)+6.5rem)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={!isCollapsed}
                    aria-controls={`${section.id}-items`}
                    className="flex w-full items-start justify-between gap-4 border-b border-line pb-3 text-left"
                  >
                    <span>
                      <span
                        id={`${section.id}-heading`}
                        className="block font-display text-xl text-ink"
                      >
                        {section.title}
                      </span>
                      <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-muted">
                        {section.intro}
                      </span>
                    </span>

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`mt-1 h-5 w-5 shrink-0 stroke-current stroke-[1.5] text-muted transition-transform ${
                        isCollapsed ? "" : "rotate-180"
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" fill="none" />
                    </svg>
                  </button>

                  {!isCollapsed ? (
                    <div
                      id={`${section.id}-items`}
                      className="menu-items mt-5"
                    >
                      {section.items.map((item) => (
                        <DishCard
                          key={`${section.id}-${item.slug}`}
                          item={item}
                          query={query}
                          onPreview={setPreview}
                        />
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-14 space-y-2 border-t border-line pt-6 text-xs text-muted">
          <p>{PRICE_NOTICE}</p>
          <p>{SERVING_SUGGESTION}</p>
        </div>
      </div>

      <ImagePreview item={preview} onClose={() => setPreview(null)} />
    </>
  );
}
