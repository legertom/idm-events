"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { MODULES, moduleBySlug, nextModule, prevModule } from "@/lib/modules";
import { useProgress } from "./ProgressProvider";

export function ModuleLayout({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const meta = moduleBySlug(slug)!;
  const { isComplete, toggle } = useProgress();
  const done = isComplete(`module:${slug}`);
  const next = nextModule(slug);
  const prev = prevModule(slug);

  return (
    <article>
      {/* Module header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <Link href="/" className="hover:text-brand-700">
            Course
          </Link>
          <span>/</span>
          <span>
            Module {meta.order} of {MODULES.length}
          </span>
          <span>·</span>
          <span>{meta.minutes} min</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          {meta.title}
        </h1>
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
          <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
            Objective
          </span>
          <p className="text-sm leading-6 text-ink-soft">{meta.objective}</p>
        </div>
      </div>

      <div className="prose-course space-y-6">{children}</div>

      {/* Footer / nav */}
      <div className="mt-10 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => toggle(`module:${slug}`)}
          className={`focus-ring flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
            done
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-brand-300 bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          <span
            className={`grid h-5 w-5 place-items-center rounded-full text-xs ${
              done ? "bg-emerald-500 text-white" : "bg-white/20"
            }`}
          >
            ✓
          </span>
          {done ? "Completed — click to undo" : "Mark this module complete"}
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          {prev ? (
            <Link
              href={`/modules/${prev.slug}`}
              className="focus-ring group rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-slate-100"
            >
              <span className="text-ink-muted">← Module {prev.order}</span>
              <span className="ml-2 hidden font-medium sm:inline">{prev.title}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="focus-ring rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-slate-100"
            >
              ← Overview
            </Link>
          )}

          {next ? (
            <Link
              href={`/modules/${next.slug}`}
              className="focus-ring rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
            >
              <span className="hidden font-medium sm:inline">{next.title}</span>
              <span className="ml-2">Module {next.order} →</span>
            </Link>
          ) : (
            <Link
              href="/quiz"
              className="focus-ring rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
            >
              Final quiz →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
