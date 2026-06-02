"use client";

import Link from "next/link";
import { MODULES } from "@/lib/modules";
import { QUIZ_TOTAL } from "@/lib/quiz";
import { useProgress } from "./ProgressProvider";

export function CourseOverview() {
  const { isComplete, quizBest, hydrated } = useProgress();
  const firstIncomplete = MODULES.find((m) => !isComplete(`module:${m.slug}`));
  const modulesDone = MODULES.filter((m) => isComplete(`module:${m.slug}`)).length;
  const allModulesDone = modulesDone === MODULES.length;

  const cta = !hydrated
    ? { href: `/modules/${MODULES[0]!.slug}`, label: "Start the course" }
    : allModulesDone
      ? { href: "/quiz", label: "Take the final quiz" }
      : firstIncomplete
        ? {
            href: `/modules/${firstIncomplete.slug}`,
            label:
              modulesDone === 0
                ? "Start with Module 1"
                : `Resume · Module ${firstIncomplete.order}`,
          }
        : { href: `/modules/${MODULES[0]!.slug}`, label: "Start the course" };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={cta.href}
          className="focus-ring rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          {cta.label} →
        </Link>
        <span className="text-sm text-ink-muted">
          {hydrated
            ? `${modulesDone}/${MODULES.length} modules done${
                quizBest !== null ? ` · quiz best ${quizBest}/${QUIZ_TOTAL}` : ""
              }`
            : "5 modules · ~25 minutes"}
        </span>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m) => {
          const done = hydrated && isComplete(`module:${m.slug}`);
          return (
            <li key={m.slug}>
              <Link
                href={`/modules/${m.slug}`}
                className="focus-ring group flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <span
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-emerald-500 text-white"
                      : "bg-brand-50 text-brand-700"
                  }`}
                >
                  {done ? "✓" : m.order}
                </span>
                <div>
                  <p className="font-semibold text-ink group-hover:text-brand-700">
                    {m.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-6 text-ink-soft">{m.blurb}</p>
                  <p className="mt-1 text-xs text-ink-muted">{m.minutes} min</p>
                </div>
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/quiz"
            className="focus-ring group flex h-full items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-brand-300 hover:bg-white"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
              ?
            </span>
            <div>
              <p className="font-semibold text-ink group-hover:text-brand-700">
                Final quiz
              </p>
              <p className="mt-0.5 text-sm leading-6 text-ink-soft">
                Five questions, including two real scenarios. Scored.
              </p>
              {hydrated && quizBest !== null && (
                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Best score: {quizBest}/{QUIZ_TOTAL}
                </p>
              )}
            </div>
          </Link>
        </li>
      </ol>
    </div>
  );
}
