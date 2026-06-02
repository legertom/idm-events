"use client";

import Link from "next/link";
import { ALL_STEP_IDS } from "@/lib/modules";
import { useProgress } from "./ProgressProvider";

export function SiteHeader() {
  const { completed, hydrated } = useProgress();
  const total = ALL_STEP_IDS.length;
  const done = ALL_STEP_IDS.filter((id) => completed.has(id)).length;
  const pct = Math.round((done / total) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-lg">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-black text-white">
            ID
          </span>
          <span className="text-sm font-semibold leading-tight text-ink">
            Reading IDM
            <br />
            Events Exports
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${hydrated ? pct : 0}%` }}
              />
            </div>
            <span className="text-xs font-medium tabular-nums text-ink-muted">
              {hydrated ? `${done}/${total}` : "—"}
            </span>
          </div>
          <Link
            href="/cheat-sheet"
            className="focus-ring rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-slate-100"
          >
            Cheat sheet
          </Link>
        </div>
      </div>
    </header>
  );
}
