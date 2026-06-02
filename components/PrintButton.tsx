"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="focus-ring rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-slate-50 print:hidden"
    >
      Print / save PDF
    </button>
  );
}
