import Link from "next/link";
import { formatNumber, t, type Locale } from "@/lib/i18n";

export function Pagination({
  page,
  total,
  pageSize,
  basePath,
  searchParams,
  locale,
}: {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
  locale: Locale;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v) params.set(k, v);
    }
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6 text-sm">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`px-3 py-1.5 rounded-md border ${
          page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-surface"
        }`}
      >
        {t(locale, "paginationPrev")}
      </Link>
      <span className="text-text-muted">
        {t(locale, "paginationPage", { page: formatNumber(locale, page), total: formatNumber(locale, totalPages) })}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`px-3 py-1.5 rounded-md border ${
          page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-surface"
        }`}
      >
        {t(locale, "paginationNext")}
      </Link>
    </div>
  );
}
