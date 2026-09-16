import Link from "next/link";
import { notFound } from "next/navigation";
import { getResearcherDetail } from "@/lib/queries";
import { branchLabel, formatNumber, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function ResearcherDetailPage({ params }: { params: Promise<{ nameKey: string }> }) {
  const locale = await getLocale();
  const { nameKey } = await params;

  const researcher = await getResearcherDetail(decodeURIComponent(nameKey));
  if (!researcher) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/researchers" className="text-sm text-text-secondary hover:underline w-fit">
        {t(locale, "backToResearchers")}
      </Link>

      <div className="rounded-lg border bg-surface p-6 flex flex-col gap-4">
        <h1 className="text-lg font-bold text-text-primary" dir="ltr">
          {researcher.displayName}
        </h1>

        {researcher.departments.length > 0 && (
          <div>
            <h2 className="text-xs text-text-muted mb-1">{t(locale, "researcherDeptHeading")}</h2>
            <p className="text-sm text-text-secondary" dir="ltr">
              {researcher.departments.join(" · ")}
            </p>
          </div>
        )}

        {researcher.branches.length > 0 && (
          <div>
            <h2 className="text-xs text-text-muted mb-1">{t(locale, "researcherBranchHeading")}</h2>
            <div className="flex flex-wrap gap-1.5">
              {researcher.branches.map((b) => (
                <Badge key={b}>{branchLabel(locale, b)}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-surface overflow-hidden">
        <h2 className="text-sm font-semibold text-text-primary px-4 pt-4 pb-2">
          {t(locale, "researcherPapersHeading")} ({formatNumber(locale, researcher.papers.length)})
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-start text-text-muted">
              <th className="px-4 py-3 font-medium">{t(locale, "tableTitle")}</th>
              <th className="px-4 py-3 font-medium">{t(locale, "tableYear")}</th>
            </tr>
          </thead>
          <tbody>
            {researcher.papers.map((p) => (
              <tr key={p.paperId} className="border-b last:border-0 hover:bg-page">
                <td className="px-4 py-3">
                  <Link href={`/research/${p.paperId}`} className="text-text-primary hover:underline" dir="ltr">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {p.year ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-muted">{t(locale, "researchersDisclaimer")}</p>
    </div>
  );
}
