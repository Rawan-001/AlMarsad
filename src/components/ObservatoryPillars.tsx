import Link from "next/link";
import { formatNumber, t, type Locale } from "@/lib/i18n";
import { PLANNED_SECTIONS } from "@/lib/sections";
import { SectionIcon } from "./SectionIcon";

export function ObservatoryPillars({ locale, researchCount }: { locale: Locale; researchCount: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <Link
        href="/research"
        className="rounded-xl border p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-all hover:-translate-y-0.5"
        style={{ borderColor: "var(--series-1)", background: "var(--surface)" }}
      >
        <SectionIcon slug="research" className="w-7 h-7" style={{ color: "var(--series-1)" }} />
        <div className="text-sm font-semibold text-text-primary">{t(locale, "pillarResearch")}</div>
        <div className="text-xs font-medium" style={{ color: "var(--series-1)" }}>
          {formatNumber(locale, researchCount)}
        </div>
      </Link>
      {PLANNED_SECTIONS.map((section) => (
        <Link
          key={section.slug}
          href={`/sections/${section.slug}`}
          className="rounded-xl border p-4 flex flex-col items-center text-center gap-2 hover:shadow-md hover:bg-page transition-all hover:-translate-y-0.5"
          style={{ background: "var(--surface)" }}
        >
          <SectionIcon slug={section.slug} className="w-7 h-7 text-text-secondary" />
          <div className="text-sm font-semibold text-text-primary">{t(locale, section.titleKey)}</div>
        </Link>
      ))}
    </div>
  );
}
