import { getBranchCounts, getCollegeGroupCounts, getDashboardStats, getYearCounts } from "@/lib/queries";
import { StatTile } from "@/components/StatTile";
import { BarChart, HorizontalBarChart } from "@/components/BarChart";
import { branchLabel, collegeGroupLabel, formatDecimal, formatNumber, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const locale = await getLocale();
  const [stats, yearCounts, branchCounts, collegeCounts] = await Promise.all([
    getDashboardStats(),
    getYearCounts(2019),
    getBranchCounts(),
    getCollegeGroupCounts(),
  ]);

  const partialYear = yearCounts.find((y) => y.partial);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{t(locale, "dashboardTitle")}</h1>
        <p className="text-sm text-text-secondary mt-1">{t(locale, "dashboardSubtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatTile
          locale={locale}
          label={t(locale, "statTotalPapers")}
          value={stats.totalPapers}
          hint={t(locale, "statTotalPapersHint", {
            pct: formatDecimal(locale, stats.sharePct),
            total: formatNumber(locale, stats.institutionTotal),
          })}
        />
        <StatTile
          locale={locale}
          label={t(locale, "statTotalCitations")}
          value={stats.totalCitations}
          hint={t(locale, "statTotalCitationsHint", { mean: formatDecimal(locale, stats.meanCitations) })}
        />
        <StatTile locale={locale} label={t(locale, "statSince2020")} value={stats.papersSince2020} />
        <StatTile
          locale={locale}
          label={t(locale, "statOpenAccess")}
          value={`${formatDecimal(locale, stats.openAccessPct)}%`}
          hint={t(locale, "statOpenAccessHint", { n: formatNumber(locale, stats.openAccessCount) })}
        />
        <StatTile
          locale={locale}
          label={t(locale, "statAuthorNames")}
          value={stats.authorNamesCount}
          hint={t(locale, "statAuthorNamesHint")}
        />
        <div className="rounded-lg border bg-surface p-4">
          <div className="text-xs text-text-muted mb-1">{t(locale, "statDocTypesTitle")}</div>
          <div className="flex items-baseline gap-3 flex-wrap" style={{ fontVariantNumeric: "tabular-nums" }}>
            <span className="text-sm text-text-primary font-semibold">
              {formatNumber(locale, stats.docTypeArticles)} <span className="font-normal text-text-secondary">{t(locale, "statDocTypesArticles")}</span>
            </span>
            <span className="text-text-muted">·</span>
            <span className="text-sm text-text-primary font-semibold">
              {formatNumber(locale, stats.docTypeReviews)} <span className="font-normal text-text-secondary">{t(locale, "statDocTypesReviews")}</span>
            </span>
            <span className="text-text-muted">·</span>
            <span className="text-sm text-text-primary font-semibold">
              {formatNumber(locale, stats.docTypeProceedings)}{" "}
              <span className="font-normal text-text-secondary">{t(locale, "statDocTypesProceedings")}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <BarChart
          locale={locale}
          title={t(locale, "chartByYear")}
          data={yearCounts.map((y) => ({
            label: String(y.year),
            value: y.count,
            partial: y.partial,
            href: `/research?year=${y.year}`,
          }))}
          note={partialYear ? t(locale, "chartByYearNote", { year: partialYear.year }) : undefined}
        />
        <HorizontalBarChart
          locale={locale}
          title={t(locale, "chartByBranch")}
          data={branchCounts.map((b) => ({
            label: branchLabel(locale, b.nameEn),
            value: b.count,
            href: `/research?branch=${b.code}`,
          }))}
          note={t(locale, "chartByBranchNote")}
        />
        <HorizontalBarChart
          locale={locale}
          title={t(locale, "chartByCollege")}
          data={collegeCounts.map((c) => ({ label: collegeGroupLabel(locale, c.collegeGroup), value: c.count }))}
          note={t(locale, "chartByCollegeNote")}
        />
      </div>
    </div>
  );
}
