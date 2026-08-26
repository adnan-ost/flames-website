import type { MenuItem } from "@/data/menu";
import { formatAmount, formatPrice, priceSizesOf } from "@/data/prices";

/**
 * A dish's price, wherever it is shown.
 *
 * Shared by the menu card and the home page so the two cannot tell different
 * stories about the same dish — a home page quoting one number for a dish the
 * menu sells in two sizes would be the misleading half-portion problem all
 * over again, just moved upstairs.
 *
 * Sanity owns a dish's pricing outright once its document carries a price,
 * sizes included; only a dish it has no price for falls back to prices.ts. A
 * dish shows either its sizes or its single price, never a mix.
 */
export function DishPrice({ item }: { item: MenuItem }) {
  const pricedInSanity = typeof item.price === "number";
  const sizes = item.sizes?.length
    ? item.sizes
    : pricedInSanity
      ? []
      : priceSizesOf(item.name);

  if (sizes.length > 0) {
    return (
      <span className="dish-price flex shrink-0 flex-col items-end gap-0.5 text-sm">
        {sizes.map((size) => (
          <span key={size.label} className="flex items-baseline gap-2">
            <span className="dish-size-label text-[0.7rem] text-muted">{size.label}</span>
            <span className="tabular-nums text-orange">{formatAmount(size.amount)}</span>
          </span>
        ))}
      </span>
    );
  }

  const price = pricedInSanity ? formatAmount(item.price!) : formatPrice(item.name);
  return (
    <span
      className={`dish-price shrink-0 text-sm tabular-nums ${
        price === "N/A" ? "text-muted" : "text-orange"
      }`}
    >
      {price}
    </span>
  );
}
