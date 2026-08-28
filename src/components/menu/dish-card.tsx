import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { dishImageUrl } from "@/lib/images";
import { DishPrice } from "./dish-price";

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const index = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (index === -1) return <>{text}</>;

  const end = index + query.trim().length;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-orange/25 text-inherit">{text.slice(index, end)}</mark>
      {text.slice(end)}
    </>
  );
}

export function DishCard({
  item,
  query,
  onPreview,
}: {
  item: MenuItem;
  query: string;
  onPreview: (item: MenuItem) => void;
}) {
  /* Price and sizes are rendered by DishPrice, shared with the home page. */

  return (
    <article
      className="dish-card flame-card group border border-line bg-paper/50 transition-colors hover:border-orange/40"
      style={{ borderRadius: "var(--brand-radius)" }}
    >
      <button
        type="button"
        onClick={() => onPreview(item)}
        aria-label={`View a larger photo of ${item.name}`}
        /*
          `relative` is kept as a utility as well as being set in the
          .dish-media rule. A `fill` image needs a positioned ancestor; if
          globals.css is ever stale or fails to load, this class alone still
          contains the image. Without it the image sizes against the viewport
          and covers the page.
        */
        className="dish-media relative overflow-hidden bg-cream"
      >
        <Image
          src={dishImageUrl(item)}
          alt={item.name}
          fill
          /*
            One `sizes` for both views. 280px also suits the list thumbnail on a
            retina screen (96px at 3x), so nothing is over-fetched, and it means
            this attribute does not have to change when the view does.
            object-fit and padding live in globals.css — see the menu layout
            block there for why the view is CSS-driven rather than React-driven.
          */
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
      </button>

      <div className="dish-body flex flex-1 flex-col justify-center gap-1">
        {/*
          `dish-head` is the hook globals.css uses to stack the name above the
          price on narrow screens. Side by side, a two-size price block leaves
          almost no room for the name in a phone-width grid cell.
        */}
        <div className="dish-head flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 text-base font-normal text-ink">
            <Highlight text={item.name} query={query} />
          </h3>
          <DishPrice item={item} />
        </div>

        <p className="text-sm leading-relaxed text-muted">
          <Highlight text={item.description} query={query} />
        </p>
      </div>
    </article>
  );
}
