/**
 * Dish prices, in PKR, keyed by exact dish name.
 *
 * Every price carries a status so an unverified number can never be mistaken
 * for a signed-off one:
 *
 *   "confirmed"   — signed off by the restaurant. Safe to publish.
 *   "unconfirmed" — sourced from a comparable restaurant's public menu.
 *   "estimated"   — inferred from the price band of similar dishes in the
 *                   same section. A guess, and labelled as one.
 *
 * A dish absent from this map renders N/A, which is the previous site's rule
 * and remains the default for anything we cannot source.
 */

export type PriceStatus = "confirmed" | "unconfirmed" | "estimated";

export interface DishPrice {
  amount: number;
  status: PriceStatus;
  /** Where the number came from, for the sign-off review. */
  source?: string;
}

export const PRICES: Record<string, DishPrice> = {
  // Populated by the price import. Empty until then — every dish shows N/A.
};

export const CURRENCY = "PKR" as const;

export function formatPrice(name: string): string {
  const price = PRICES[name];
  if (!price) return "N/A";

  return `Rs ${price.amount.toLocaleString("en-PK")}`;
}

export function priceStatusOf(name: string): PriceStatus | null {
  return PRICES[name]?.status ?? null;
}
