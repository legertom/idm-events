export function DownloadCsv({
  variant = "primary",
}: {
  variant?: "primary" | "subtle";
}) {
  const cls =
    variant === "primary"
      ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
      : "border border-slate-200 bg-white text-ink-soft hover:bg-slate-50";
  return (
    <a
      href="/sample-export.csv"
      download="events_export_sample.csv"
      className={`focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${cls}`}
    >
      <span aria-hidden>⬇</span>
      Download the sample export (.csv)
    </a>
  );
}
