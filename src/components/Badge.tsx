export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warning" | "critical";
}) {
  const toneStyles: Record<string, React.CSSProperties> = {
    neutral: { background: "var(--page)", color: "var(--text-secondary)" },
    good: { background: "color-mix(in srgb, var(--status-good) 15%, transparent)", color: "var(--status-good)" },
    warning: {
      background: "color-mix(in srgb, var(--status-warning) 20%, transparent)",
      color: "var(--text-primary)",
    },
    critical: {
      background: "color-mix(in srgb, var(--status-critical) 15%, transparent)",
      color: "var(--status-critical)",
    },
  };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border"
      style={toneStyles[tone]}
    >
      {children}
    </span>
  );
}
