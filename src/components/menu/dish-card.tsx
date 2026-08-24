import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { dishImageUrl } from "@/lib/images";
import { formatPrice, priceStatusOf } from "@/data/prices";

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
  view,
  query,
  onPreview,
}: {
  item: MenuItem;
  view: "list" | "grid";
  query: string;
  onPreview: (item: MenuItem) => void;
}) {
  const price = formatPrice(item.name);
  const status = priceStatusOf(item.name);
  const isGrid = view === "grid";

  return (
    <article
      className={`group border border-line bg-paper/50 transition-colors hover:border-orange/40 ${
        isGrid ? "flex flex-col" : "flex flex-row items-stretch gap-4"
      }`}
      style={{ borderRadius: "var(--brand-radius)" }}
    >
      <button
        type="button"
        onClick={() => onPreview(item)}
        aria-label={`View a larger photo of ${item.name}`}
        className={`relative shrink-0 overflow-hidden bg-cream ${
          isGrid ? "aspect-[4/3] w-full" : "my-3 ml-3 h-24 w-24 sm:h-28 sm:w-28"
        }`}
        style={{
          borderRadius: isGrid
            ? "var(--brand-radius) var(--brand-radius) 0 0"
            : "calc(var(--brand-radius) - 4px)",
        }}
      >
        <Image
          src={dishImageUrl(item)}
          alt={item.name}
          fill
          sizes={isGrid ? "(max-width: 620px) 50vw, 33vw" : "128px"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </button>

      <div className={`flex flex-1 flex-col justify-center gap-1 ${isGrid ? "p-4" : "py-3 pr-4"}`}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-base font-normal text-ink">
            <Highlight text={item.name} query={query} />
          </h3>
          <span
            className={`shrink-0 text-sm tabular-nums ${
              price === "N/A" ? "text-muted" : "text-orange"
            }`}
            title={
              status === "estimated"
                ? "Estimated price — not yet confirmed by the restaurant"
                : status === "unconfirmed"
                  ? "Sourced from a comparable menu — not yet confirmed"
                  : undefined
            }
          >
            {price}
            {status === "estimated" || status === "unconfirmed" ? (
              <span aria-hidden="true" className="ml-0.5 text-muted">
                *
              </span>
            ) : null}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted">
          <Highlight text={item.description} query={query} />
        </p>
      </div>
    </article>
  );
}
