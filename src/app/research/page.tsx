import Link from "next/link";
import {
  getApplicationDomainOptions,
  getBranchOptions,
  getDocumentTypeOptions,
  getPapersList,
  getTopCited,
} from "@/lib/queries";
import { branchLabel, docTypeLabel, domainLabel, formatNumber, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { Badge } from "@/components/Badge";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type SearchParams = {
  q?: string;
  branch?: string;
  domain?: string;
  docType?: string;
  year?: string;
  sort?: string;
  page?: string;
};

function PaperRow({ locale, paper }: { locale: import("@/lib/i18n").Locale; paper: import("@/lib/queries").PaperListItem }) {
  return (
    <div className="border-b last:border-0 py-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium leading-snug" dir="ltr">
          <Link href={`/research/${paper.paperId}`} className="text-text-primary hover:underline">
            {paper.title}
          </Link>
        </h3>
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-xs font-medium hover:underline whitespace-nowrap"
            style={{ color: "var(--series-1)" }}
          >
            {t(locale, "viewDoi")} ↗
          </a>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-text-secondary">
        {paper.year && <span>{paper.year}</span>}
        {paper.sourceTitle && <span dir="ltr">{paper.sourceTitle}</span>}
        <span>
          {t(locale, "tableCitations")}: {formatNumber(locale, paper.citations ?? 0)}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {paper.branches.map((b) => (
          <Badge key={b}>{branchLabel(locale, b)}</Badge>
        ))}
        {paper.isMegaConsortium && <Badge tone="warning">{t(locale, "megaConsortiumBadge")}</Badge>}
      </div>
    </div>
  );
}

export default async function ResearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const locale = await getLocale();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = sp.sort === "cited" ? "cited" : "recent";

  const [{ items, total }, topCited, branchOptions, domainOptions, docTypeOptions] = await Promise.all([
    getPapersList({
      q: sp.q,
      branch: sp.branch,
      domain: sp.domain,
      docType: sp.docType,
      year: sp.year,
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    getTopCited(5),
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

      {!hasFilters && page === 1 && (
        <div className="rounded-lg border bg-surface p-4">
          <h2 className="text-sm font-semibold text-text-primary mb-3">{t(locale, "topCitedTitle")}</h2>
          <div className="flex flex-col">
            {topCited.map((paper) => (
              <PaperRow key={paper.paperId} locale={locale} paper={paper} />
            ))}
          </div>
        </div>
      )}

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

      <div className="rounded-lg border bg-surface px-4">
        {items.map((paper) => (
          <PaperRow key={paper.paperId} locale={locale} paper={paper} />
        ))}
        {items.length === 0 && <div className="py-8 text-center text-text-muted">{t(locale, "noResults")}</div>}
      </div>

      <Pagination
        locale={locale}
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        basePath="/research"
        searchParams={{ q: sp.q, branch: sp.branch, domain: sp.domain, docType: sp.docType, year: sp.year, sort: sp.sort }}
      />
    </div>
  );
}
