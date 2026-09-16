"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatNumber, type Locale } from "@/lib/i18n";

export type BarDatum = { label: string; value: number; partial?: boolean; href?: string };

export function BarChart({
  data,
  title,
  locale,
  note,
}: {
  data: BarDatum[];
  title: string;
  locale: Locale;
  note?: string;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const gridSteps = 4;

  return (
    <div className="viz-root rounded-lg border bg-surface p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <div className="relative" style={{ height: 220 }}>
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {Array.from({ length: gridSteps + 1 }).map((_, i) => (
            <div key={i} className="border-t" style={{ borderColor: "var(--gridline)" }} />
          ))}
        </div>
        <div className="relative h-full flex items-end gap-2 px-1" dir="ltr">
          {data.map((d, i) => {
            const heightPct = (d.value / max) * 100;
            const clickable = Boolean(d.href);
            return (
              <div
                key={d.label}
                role={clickable ? "link" : undefined}
                tabIndex={clickable ? 0 : undefined}
                className={`relative flex-1 flex flex-col items-center justify-end h-full min-w-0 ${
                  clickable ? "cursor-pointer" : ""
                }`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                onClick={() => d.href && router.push(d.href)}
                onKeyDown={(e) => {
                  if (d.href && (e.key === "Enter" || e.key === " ")) router.push(d.href);
                }}
              >
                {hovered === i && (
                  <div
                    className="absolute -top-7 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-sm z-10"
                    style={{ background: "var(--text-primary)", color: "var(--surface)" }}
                  >
                    {formatNumber(locale, d.value)}
                    {d.partial ? "*" : ""}
                  </div>
                )}
                <div
                  className="w-full rounded-t-[4px] transition-opacity"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: d.value > 0 ? 3 : 0,
                    background: d.partial
                      ? "repeating-linear-gradient(45deg, var(--series-1), var(--series-1) 4px, transparent 4px, transparent 8px)"
                      : "var(--series-1)",
                    border: d.partial ? "1px solid var(--series-1)" : "none",
                    opacity: hovered === null || hovered === i ? 1 : 0.55,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2 px-1 mt-2" dir="ltr">
        {data.map((d) => (
          <div key={d.label} className="flex-1 min-w-0 text-center text-[11px] text-text-muted truncate">
            {d.label}
            {d.partial ? "*" : ""}
          </div>
        ))}
      </div>
      {note && <p className="text-[11px] text-text-muted mt-3">{note}</p>}
    </div>
  );
}

export function HorizontalBarChart({
  data,
  title,
  locale,
  note,
}: {
  data: BarDatum[];
  title: string;
  locale: Locale;
  note?: string;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="viz-root rounded-lg border bg-surface p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <div className="flex flex-col gap-2" dir="ltr">
        {data.map((d, i) => {
          const widthPct = (d.value / max) * 100;
          const clickable = Boolean(d.href);
          return (
            <div
              key={d.label}
              role={clickable ? "link" : undefined}
              tabIndex={clickable ? 0 : undefined}
              className={`flex items-center gap-3 ${clickable ? "cursor-pointer" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onClick={() => d.href && router.push(d.href)}
              onKeyDown={(e) => {
                if (d.href && (e.key === "Enter" || e.key === " ")) router.push(d.href);
              }}
            >
              <div className="w-44 sm:w-56 shrink-0 text-xs text-text-secondary leading-tight text-right">{d.label}</div>
              <div className="flex-1 h-5 rounded-[4px]" style={{ background: "var(--page)" }}>
                <div
                  className="h-full rounded-[4px] transition-opacity flex items-center"
                  style={{
                    width: `${Math.max(widthPct, 2)}%`,
                    background: "var(--series-1)",
                    opacity: hovered === null || hovered === i ? 1 : 0.55,
                  }}
                />
              </div>
              <div
                className="w-10 shrink-0 text-xs text-text-primary font-medium"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatNumber(locale, d.value)}
              </div>
            </div>
          );
        })}
      </div>
      {note && <p className="text-[11px] text-text-muted mt-3">{note}</p>}
    </div>
  );
}
