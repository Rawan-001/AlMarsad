import { getDashboardStats } from "@/lib/queries";
import { ObservatoryPillars } from "@/components/ObservatoryPillars";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary">{t(locale, "pillarsTitle")}</h1>
        <p className="text-sm text-text-secondary mt-2">{t(locale, "homeSubtitle")}</p>
      </div>

      <ObservatoryPillars locale={locale} researchCount={stats.totalPapers} />
    </div>
  );
}
