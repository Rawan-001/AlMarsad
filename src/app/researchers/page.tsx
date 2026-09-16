import Link from "next/link";
import { getDepartmentCounts, getResearcherApproxCount, getResearcherList } from "@/lib/queries";
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

  const [approxCount, { items, total }, departments] = await Promise.all([
    getResearcherApproxCount(),
    getResearcherList(sp.q, page, PAGE_SIZE),
    getDepartmentCounts(15),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t(locale, "researchersTitle")}</h1>
        <p className="text-sm text-text-secondary mt-1">
          {t(locale, "researchersApproxCount", { n: formatNumber(locale, approxCount) })}
        </p>
      </div>

      <div className="rounded-lg border bg-surface overflow-hidden">
        <div className="px-4 pt-4 pb-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-semibold text-text-primary">{t(locale, "allResearchersTitle")}</h2>
          <form method="get" className="flex gap-2 items-end">
            <input
              type="text"
              name="q"
              defaultValue={sp.q ?? ""}
              className="rounded-md border px-3 py-1.5 text-sm w-full max-w-xs"
              placeholder={t(locale, "searchByNamePlaceholder")}
            />
            <button
              type="submit"
              className="rounded-md px-4 py-1.5 text-sm font-medium text-white"
              style={{ background: "var(--series-1)" }}
            >
              {t(locale, "searchSubmit")}
            </button>
          </form>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start text-text-muted">
              <th className="px-4 py-3 font-medium">{t(locale, "colName")}</th>
              <th className="px-4 py-3 font-medium">{t(locale, "colDepartment")}</th>
              <th className="px-4 py-3 font-medium">{t(locale, "colPapers")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.nameKey} className="border-b last:border-0 hover:bg-page">
                <td className="px-4 py-3">
                  <Link
                    href={`/researchers/${encodeURIComponent(r.nameKey)}`}
                    className="text-text-primary font-medium hover:underline"
                    dir="ltr"
                  >
                    {r.displayName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs" dir="ltr">
                  {r.departments.join(" · ") || "—"}
                </td>
                <td className="px-4 py-3 text-text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatNumber(locale, r.paperCount)}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                  {t(locale, "noResults")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination locale={locale} page={page} total={total} pageSize={PAGE_SIZE} basePath="/researchers" searchParams={{ q: sp.q }} />

      <div className="rounded-lg border bg-surface p-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3">{t(locale, "departmentsTitle")}</h2>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-text-secondary">
          {departments.map((d) => (
            <div key={d.departmentText} className="flex justify-between border-b py-1.5">
              <span dir="ltr">{d.departmentText}</span>
              <span className="font-medium text-text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatNumber(locale, d.paperCount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-muted">{t(locale, "researchersDisclaimer")}</p>
    </div>
  );
}
