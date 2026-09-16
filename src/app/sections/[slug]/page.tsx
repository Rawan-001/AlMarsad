import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getSectionBySlug } from "@/lib/sections";
import { SectionIcon } from "@/components/SectionIcon";

export const dynamic = "force-dynamic";

export default async function SectionPlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-text-secondary hover:underline w-fit">
        {t(locale, "backToHome")}
      </Link>

      <div className="rounded-lg border bg-surface p-8 flex flex-col items-center text-center gap-3">
        <SectionIcon slug={section.slug} className="w-10 h-10 text-text-secondary" />
        <h1 className="text-lg font-bold text-text-primary">{t(locale, section.titleKey)}</h1>
        <p className="text-sm text-text-secondary max-w-md">{t(locale, section.descriptionKey)}</p>
        <p className="text-xs text-text-muted mt-2">{t(locale, "pillarNotReady")}</p>
      </div>
    </div>
  );
}
