import { formatNumber, type Locale } from "@/lib/i18n";

export function StatTile({
  label,
  value,
  hint,
  locale,
}: {
  label: string;
  value: number | string;
  hint?: string;
  locale: Locale;
}) {
  return (
    <div className="rounded-lg border bg-surface p-4">
      <div className="text-xs text-text-muted mb-1">{label}</div>
      <div className="text-2xl font-bold text-text-primary" style={{ fontVariantNumeric: "tabular-nums" }}>
        {typeof value === "number" ? formatNumber(locale, value) : value}
      </div>
      {hint && <div className="text-xs text-text-secondary mt-1">{hint}</div>}
    </div>
  );
}
