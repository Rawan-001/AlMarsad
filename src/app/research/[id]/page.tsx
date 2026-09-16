import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaperDetail } from "@/lib/queries";
import { branchLabel, domainLabel, formatNumber, sourceLabel, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  );
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale();
  const { id } = await params;
  const paperId = Number(id);
  if (!Number.isFinite(paperId)) notFound();

  const paper = await getPaperDetail(paperId);
  if (!paper) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/research" className="text-sm text-text-secondary hover:underline w-fit">
        {t(locale, "backToResearch")}
      </Link>

      <div className="rounded-lg border bg-surface p-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{sourceLabel(locale, paper.dataSource)}</Badge>
          {paper.branches.map((b) => (
            <Badge key={b}>{branchLabel(locale, b)}</Badge>
          ))}
          {paper.isMegaConsortium && <Badge tone="warning">{t(locale, "megaConsortiumBadge")}</Badge>}
        </div>

        <h1 className="text-lg font-bold text-text-primary leading-relaxed" dir="ltr">
          {paper.title}
        </h1>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
          {paper.year && <span>{paper.year}</span>}
          {paper.sourceTitle && <span dir="ltr">{paper.sourceTitle}</span>}
        </div>

        {paper.researchers.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-2">{t(locale, "paperAuthorsHeading")}</h2>
            <div className="flex flex-wrap gap-2">
              {paper.researchers.map((r) => (
                <Link
                  key={r.nameKey}
                  href={`/researchers/${r.nameKey}`}
                  className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-page"
                  style={{ color: "var(--series-1)" }}
                  dir="ltr"
                >
                  {r.displayName}
                </Link>
              ))}
            </div>
          </div>
        )}

        {paper.abstract && (
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-1">{t(locale, "abstractHeading")}</h2>
            <p className="text-sm text-text-secondary leading-relaxed" dir="ltr">
              {paper.abstract}
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
          <Field
            label={t(locale, "tableDoi")}
            value={
              paper.doi ? (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  className="hover:underline"
                  style={{ color: "var(--series-1)" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {paper.doi}
                </a>
              ) : null
            }
          />
          <Field label={t(locale, "tableCitations")} value={paper.citations !== null ? formatNumber(locale, paper.citations) : null} />
          <Field
            label={t(locale, "fieldApplicationDomain")}
            value={paper.applicationDomain ? domainLabel(locale, paper.applicationDomain) : null}
          />
        </div>
      </div>
    </div>
  );
}
