import Link from "next/link";
import { formatNumber, t, type DictKey, type Locale } from "@/lib/i18n";

const COMING_SOON_KEYS: DictKey[] = [
  "pillarProjects",
  "pillarActivities",
  "pillarParticipation",
  "pillarInnovation",
  "pillarAwards",
  "pillarPartnerships",
  "pillarTraining",
  "pillarMedia",
];

export function ObservatoryPillars({ locale, researchCount }: { locale: Locale; researchCount: number }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-text-primary">{t(locale, "pillarsTitle")}</h2>
      <p className="text-xs text-text-secondary mt-1 mb-3">{t(locale, "pillarsSubtitle")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link
          href="/research"
          className="rounded-lg border p-3 hover:bg-page transition-colors"
          style={{ borderColor: "var(--series-1)", background: "var(--surface)" }}
        >
          <div className="text-sm font-medium text-text-primary">{t(locale, "pillarResearch")}</div>
          <div
            className="text-xs mt-1 font-medium"
            style={{ color: "var(--series-1)" }}
          >
            {formatNumber(locale, researchCount)}
          </div>
        </Link>
        {COMING_SOON_KEYS.map((key) => (
          <div
            key={key}
            className="rounded-lg border border-dashed p-3 opacity-60"
            style={{ background: "var(--page)" }}
          >
            <div className="text-sm font-medium text-text-secondary">{t(locale, key)}</div>
            <div className="text-xs mt-1 text-text-muted">{t(locale, "comingSoonBadge")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
