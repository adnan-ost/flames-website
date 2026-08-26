import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { dishImageUrl } from "@/lib/images";
import { formatAmount, formatPrice, priceSizesOf } from "@/data/prices";

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
  /*
   * Sanity owns a dish's pricing outright once its document carries a price.
   * That has to include the sizes: taking the price from Sanity but the sizes
   * from this repo would render the repo's sizes and quietly ignore the price
   * the restaurant just typed into the Studio, so an edit would look like it
   * did nothing. Only a dish Sanity has no price for falls back to prices.ts.
   *
   * A dish shows either its sizes or its single price, never a mix — a mix
   * leaves the customer guessing which number is which.
   */
  const pricedInSanity = typeof item.price === "number";
  const sizes = item.sizes?.length
    ? item.sizes
    : pricedInSanity
      ? []
      : priceSizesOf(item.name);
  const price = pricedInSanity ? formatAmount(item.price!) : formatPrice(item.name);

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
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </button>

      <div className="dish-body flex flex-1 flex-col justify-center gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-base font-normal text-ink">
            <Highlight text={item.name} query={query} />
          </h3>
          {sizes.length > 0 ? (
            <span className="dish-price flex shrink-0 flex-col items-end gap-0.5 text-sm">
              {sizes.map((size) => (
                <span key={size.label} className="flex items-baseline gap-2">
                  <span className="dish-size-label text-[0.7rem] text-muted">
                    {size.label}
                  </span>
                  <span className="tabular-nums text-orange">
                    {formatAmount(size.amount)}
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span
              className={`dish-price shrink-0 text-sm tabular-nums ${
                price === "N/A" ? "text-muted" : "text-orange"
              }`}
            >
              {price}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted">
          <Highlight text={item.description} query={query} />
        </p>
      </div>
    </article>
  );
}
