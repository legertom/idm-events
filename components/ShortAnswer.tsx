"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export function ShortAnswer({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card p-5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-violet-700">
          Recall
        </span>
        <p className="font-medium text-ink">{question}</p>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Answer it in your head first, then check yourself.
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-slate-50"
      >
        {open ? "Hide model answer" : "Reveal model answer"}
      </button>
      {open && (
        <div className="mt-3 animate-fade-in rounded-xl bg-slate-50 p-4 text-sm leading-7 text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
          {children}
        </div>
      )}
    </div>
  );
}
