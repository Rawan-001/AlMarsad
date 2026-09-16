"use client";

import { useState, useTransition } from "react";
import { t, type Locale } from "@/lib/i18n";
import type { PaperFilters, PaperListItem } from "@/lib/queries";
import { loadMorePapers } from "@/app/research/actions";
import { PaperRow } from "./PaperRow";

export function PaperList({
  locale,
  initialItems,
  total,
  pageSize,
  filters,
}: {
  locale: Locale;
  initialItems: PaperListItem[];
  total: number;
  pageSize: number;
  filters: Omit<PaperFilters, "page" | "pageSize">;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const hasMore = items.length < total;

  function handleLoadMore() {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await loadMorePapers({ ...filters, page: nextPage, pageSize });
      setItems((prev) => [...prev, ...result.items]);
      setPage(nextPage);
    });
  }

  return (
    <div className="rounded-lg border bg-surface px-4">
      {items.map((paper) => (
        <PaperRow key={paper.paperId} locale={locale} paper={paper} />
      ))}
      {items.length === 0 && <div className="py-8 text-center text-text-muted">{t(locale, "noResults")}</div>}
      {hasMore && (
        <div className="py-4 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isPending}
            className="rounded-md px-4 py-2 text-sm font-medium border hover:bg-page disabled:opacity-50 transition-colors"
          >
            {isPending ? "…" : t(locale, "loadMore")}
          </button>
        </div>
      )}
    </div>
  );
}
