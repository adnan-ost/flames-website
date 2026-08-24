"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import { dishImageUrl } from "@/lib/images";
import { SERVING_SUGGESTION } from "@/lib/copy";

export function ImagePreview({
  item,
  onClose,
}: {
  item: MenuItem | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  if (!item) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        // Backdrop clicks land on the dialog element itself, not its contents.
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="preview-title"
      className="m-auto w-[min(92vw,42rem)] bg-transparent p-0 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <div
        className="overflow-hidden border border-line bg-paper p-3 shadow-brand"
        style={{ borderRadius: "var(--brand-radius)" }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
          <Image
            src={dishImageUrl(item)}
            alt={item.name}
            fill
            sizes="(max-width: 720px) 92vw, 42rem"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex items-start justify-between gap-4 px-2 pt-3 pb-1">
          <div>
            <h2 id="preview-title" className="text-lg font-light text-ink">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="grid h-9 w-9 shrink-0 place-items-center border border-line text-muted transition-colors hover:border-orange/55 hover:text-orange"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 stroke-current stroke-2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="px-2 pb-2 text-xs text-muted">{SERVING_SUGGESTION}</p>
      </div>
    </dialog>
  );
}
