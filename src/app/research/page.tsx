import Link from "next/link";
import {
  getApplicationDomainOptions,
  getBranchOptions,
  getDocumentTypeOptions,
  getPapersList,
} from "@/lib/queries";
import { branchLabel, docTypeLabel, domainLabel, formatNumber, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { PaperList } from "@/components/PaperList";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const TOP_CITED_PAGE_SIZE = 5;

type SearchParams = {
  q?: string;
  branch?: string;
  domain?: string;
  docType?: string;
  year?: string;
  sort?: string;
};

export default async function ResearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const locale = await getLocale();
  const sp = await searchParams;
  const sort = sp.sort === "cited" ? "cited" : "recent";

  const filters = {
    q: sp.q,
    branch: sp.branch,
    domain: sp.domain,
    docType: sp.docType,
    year: sp.year,
    sort: sort as "recent" | "cited",
  };

  const [{ items, total }, { items: topCitedItems }, branchOptions, domainOptions, docTypeOptions] = await Promise.all([
    getPapersList({ ...filters, page: 1, pageSize: PAGE_SIZE }),
    getPapersList({ sort: "cited", page: 1, pageSize: TOP_CITED_PAGE_SIZE }),
    getBranchOptions(),
    getApplicationDomainOptions(),
    getDocumentTypeOptions(),
  ]);

  const hasFilters = sp.q || sp.branch || sp.domain || sp.docType || sp.year;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t(locale, "researchTitle")}</h1>
        <p className="text-sm text-text-secondary mt-1">{t(locale, "researchCount", { n: formatNumber(locale, total) })}</p>
      </div>

      <form method="get" className="flex flex-wrap gap-3 items-end rounded-lg border bg-surface p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">{t(locale, "filterSearchLabel")}</label>
          <input
            type="text"
            name="q"
            defaultValue={sp.q ?? ""}
            className="rounded-md border px-3 py-1.5 text-sm min-w-[200px]"
            placeholder={t(locale, "filterSearchPlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">{t(locale, "filterBranchLabel")}</label>
          <select name="branch" defaultValue={sp.branch ?? ""} className="rounded-md border px-3 py-1.5 text-sm">
            <option value="">{t(locale, "filterAll")}</option>
            {branchOptions.map((b) => (
              <option key={b.code} value={b.code}>
                {branchLabel(locale, b.nameEn)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">{t(locale, "filterDomainLabel")}</label>
          <select name="domain" defaultValue={sp.domain ?? ""} className="rounded-md border px-3 py-1.5 text-sm">
            <option value="">{t(locale, "filterAll")}</option>
            {domainOptions.map((d) => (
              <option key={d} value={d}>
                {domainLabel(locale, d)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">{t(locale, "filterDocTypeLabel")}</label>
          <select name="docType" defaultValue={sp.docType ?? ""} className="rounded-md border px-3 py-1.5 text-sm">
            <option value="">{t(locale, "filterAll")}</option>
            {docTypeOptions.map((d) => (
              <option key={d} value={d}>
                {docTypeLabel(locale, d)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">{t(locale, "filterYearLabel")}</label>
          <input
            type="number"
            name="year"
            defaultValue={sp.year ?? ""}
            className="rounded-md border px-3 py-1.5 text-sm w-24"
            placeholder={t(locale, "filterYearPlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">{t(locale, "filterSortLabel")}</label>
          <select name="sort" defaultValue={sort} className="rounded-md border px-3 py-1.5 text-sm">
            <option value="recent">{t(locale, "sortRecent")}</option>
            <option value="cited">{t(locale, "sortCited")}</option>
          </select>
        </div>
        <button type="submit" className="rounded-md px-4 py-1.5 text-sm font-medium text-white" style={{ background: "var(--series-1)" }}>
          {t(locale, "filterSubmit")}
        </button>
        {hasFilters && (
          <Link href="/research" className="text-sm text-text-secondary underline">
            {t(locale, "filterClear")}
          </Link>
        )}
      </form>

      {!hasFilters && (
        <>
          <PaperList
            locale={locale}
            title={t(locale, "topCitedTitle")}
            initialItems={topCitedItems}
            total={total}
            pageSize={TOP_CITED_PAGE_SIZE}
            filters={{ sort: "cited" }}
          />
          <div className="flex items-center gap-3" role="separator">
            <span className="flex-1 border-t-2" style={{ borderColor: "var(--gridline)" }} />
          </div>
        </>
      )}

      <PaperList
        locale={locale}
        title={hasFilters ? undefined : t(locale, "allPapersTitle")}
        initialItems={items}
        total={total}
        pageSize={PAGE_SIZE}
        filters={filters}
      />
    </div>
  );
}
