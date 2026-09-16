import Link from "next/link";
import { branchLabel, formatNumber, t, type Locale } from "@/lib/i18n";
import type { PaperListItem } from "@/lib/queries";
import { Badge } from "./Badge";

export function PaperRow({ locale, paper }: { locale: Locale; paper: PaperListItem }) {
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
