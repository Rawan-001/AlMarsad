import Link from "next/link";
import { getResearcherApproxCount, getResearcherList } from "@/lib/queries";
import { formatNumber, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

export default async function ResearchersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [approxCount, { items, total }] = await Promise.all([
    getResearcherApproxCount(),
    getResearcherList(sp.q, page, PAGE_SIZE),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t(locale, "researchersTitle")}</h1>
        <p className="text-sm text-text-secondary mt-1">
          {t(locale, "researchersApproxCount", { n: formatNumber(locale, approxCount) })}
        </p>
      </div>

      <form method="get" className="flex gap-2 items-end rounded-lg border bg-surface p-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-text-muted">{t(locale, "searchByName")}</label>
          <input
            type="text"
            name="q"
            defaultValue={sp.q ?? ""}
            className="rounded-md border px-3 py-1.5 text-sm w-full max-w-xs"
            placeholder={t(locale, "searchByNamePlaceholder")}
          />
        </div>
        <button
          type="submit"
          className="rounded-md px-4 py-1.5 text-sm font-medium text-white"
          style={{ background: "var(--series-1)" }}
        >
          {t(locale, "searchSubmit")}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((r) => (
          <Link
            key={r.nameKey}
            href={`/researchers/${encodeURIComponent(r.nameKey)}`}
            className="rounded-lg border bg-surface p-4 hover:bg-page transition-colors"
          >
            <div className="font-medium text-text-primary" dir="ltr">
              {r.displayName}
            </div>
            <div className="text-xs text-text-secondary mt-2">
              {t(locale, "researchCount", { n: formatNumber(locale, r.paperCount) })}
            </div>
          </Link>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center text-text-muted py-8">{t(locale, "noResults")}</div>
        )}
      </div>

      <Pagination locale={locale} page={page} total={total} pageSize={PAGE_SIZE} basePath="/researchers" searchParams={{ q: sp.q }} />

      <p className="text-xs text-text-muted">{t(locale, "researchersDisclaimer")}</p>
    </div>
  );
}
