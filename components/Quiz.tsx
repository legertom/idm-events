"use client";

import { useEffect, useMemo, useState } from "react";
import { QUIZ, QUIZ_TOTAL } from "@/lib/quiz";
import { useProgress } from "./ProgressProvider";

function initialOrders(): Record<string, number[]> {
  const o: Record<string, number[]> = {};
  for (const q of QUIZ) if (q.kind === "order") o[q.id] = [...q.scramble];
  return o;
}

export function Quiz() {
  const { recordQuiz, markComplete, quizBest } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Record<string, number[]>>(initialOrders);
  const [submitted, setSubmitted] = useState(false);

  const allMcqAnswered = QUIZ.filter((q) => q.kind === "mcq").every(
    (q) => answers[q.id] !== undefined,
  );

  const score = useMemo(() => {
    let s = 0;
    for (const q of QUIZ) {
      if (q.kind === "mcq") {
        const picked = answers[q.id];
        if (picked !== undefined && q.options[picked]?.correct) s += 1;
      } else if (q.kind === "order") {
        const arr = orders[q.id] ?? [];
        if (arr.length === q.steps.length && arr.every((v, i) => v === i)) s += 1;
      }
    }
    return s;
  }, [answers, orders]);

  useEffect(() => {
    if (submitted) {
      recordQuiz(score);
      markComplete("quiz");
    }
  }, [submitted, score, recordQuiz, markComplete]);

  const move = (qid: string, pos: number, dir: -1 | 1) => {
    if (submitted) return;
    setOrders((prev) => {
      const arr = [...(prev[qid] ?? [])];
      const j = pos + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[pos], arr[j]] = [arr[j], arr[pos]];
      return { ...prev, [qid]: arr };
    });
  };

  const reset = () => {
    setAnswers({});
    setOrders(initialOrders());
    setSubmitted(false);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      {submitted && (
        <div className="card animate-pop-in border-brand-200 bg-brand-50 p-5">
          <p className="text-sm font-medium text-brand-700">Your score</p>
          <p className="mt-1 text-4xl font-black text-ink">
            {score}
            <span className="text-2xl text-ink-muted">/{QUIZ_TOTAL}</span>
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {score === QUIZ_TOTAL
              ? "Perfect — you can read an export end to end."
              : score >= 3
                ? "Solid. Review the explanations below, then you’re ready to take a real export."
                : "Worth another pass — skim the modules, then retake."}
            {quizBest !== null && quizBest !== score && (
              <span className="text-ink-muted">
                {" "}
                · Best: {quizBest}/{QUIZ_TOTAL}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={reset}
            className="focus-ring mt-3 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Retake quiz
          </button>
        </div>
      )}

      <ol className="space-y-5">
        {QUIZ.map((q, qi) => (
          <li key={q.id} className="card p-5">
            <div className="flex items-start gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-ink-soft">
                {qi + 1}
              </span>
              <div className="flex-1">
                {q.kind === "mcq" && q.scenario && (
                  <span className="mb-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    Scenario
                  </span>
                )}
                {q.kind === "order" && (
                  <span className="mb-1 inline-block rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">
                    Put in order
                  </span>
                )}
                <p className="font-medium text-ink">{q.prompt}</p>
              </div>
            </div>

            {q.kind === "mcq" ? (
              <div className="mt-3 grid gap-2 pl-8">
                {q.options.map((opt, oi) => {
                  const picked = answers[q.id] === oi;
                  const reveal = submitted && (picked || opt.correct);
                  let cls = "border-slate-200 bg-white hover:border-brand-300";
                  if (reveal && opt.correct)
                    cls = "border-emerald-400 bg-emerald-50 text-emerald-900";
                  else if (reveal && picked && !opt.correct)
                    cls = "border-rose-400 bg-rose-50 text-rose-900";
                  else if (submitted) cls = "border-slate-200 opacity-60";
                  else if (picked) cls = "border-brand-400 bg-brand-50";

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`focus-ring flex items-start gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${cls}`}
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[11px] font-bold opacity-70">
                        {reveal && opt.correct
                          ? "✓"
                          : reveal && picked
                            ? "✕"
                            : String.fromCharCode(65 + oi)}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
                {submitted && (
                  <p className="mt-1 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-ink-soft">
                    {q.explain}
                  </p>
                )}
              </div>
            ) : (
              <OrderQuestion
                steps={q.steps}
                arrangement={orders[q.id] ?? []}
                submitted={submitted}
                explain={q.explain}
                onMove={(pos, dir) => move(q.id, pos, dir)}
              />
            )}
          </li>
        ))}
      </ol>

      {!submitted && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!allMcqAnswered}
            onClick={() => setSubmitted(true)}
            className="focus-ring rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit quiz
          </button>
          {!allMcqAnswered && (
            <span className="text-sm text-ink-muted">
              Answer all multiple-choice questions to submit.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function OrderQuestion({
  steps,
  arrangement,
  submitted,
  explain,
  onMove,
}: {
  steps: string[];
  arrangement: number[];
  submitted: boolean;
  explain: string;
  onMove: (pos: number, dir: -1 | 1) => void;
}) {
  const allCorrect =
    arrangement.length === steps.length && arrangement.every((v, i) => v === i);

  return (
    <div className="mt-3 pl-8">
      {!submitted && (
        <p className="mb-2 text-xs text-ink-muted">
          Use the arrows to put the steps in order, first to last.
        </p>
      )}
      <ol className="space-y-2">
        {arrangement.map((stepIdx, pos) => {
          const here = submitted && stepIdx === pos;
          const off = submitted && stepIdx !== pos;
          let cls = "border-slate-200 bg-white";
          if (here) cls = "border-emerald-400 bg-emerald-50";
          else if (off) cls = "border-amber-300 bg-amber-50";

          return (
            <li
              key={stepIdx}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${cls}`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-ink-soft">
                {pos + 1}
              </span>
              <span className="flex-1 text-sm text-ink">{steps[stepIdx]}</span>
              {submitted ? (
                <span
                  className={`text-sm font-bold ${here ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {here ? "✓" : "✕"}
                </span>
              ) : (
                <span className="flex flex-col">
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={pos === 0}
                    onClick={() => onMove(pos, -1)}
                    className="focus-ring rounded px-1 leading-none text-ink-muted hover:text-brand-700 disabled:opacity-20"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={pos === arrangement.length - 1}
                    onClick={() => onMove(pos, 1)}
                    className="focus-ring rounded px-1 leading-none text-ink-muted hover:text-brand-700 disabled:opacity-20"
                  >
                    ▼
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {submitted && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-ink-soft">
          {allCorrect ? (
            <p className="font-semibold text-emerald-700">Correct order.</p>
          ) : (
            <>
              <p className="font-semibold text-rose-700">
                Not quite. The correct sequence is:
              </p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </>
          )}
          <p className="mt-2">{explain}</p>
        </div>
      )}
    </div>
  );
}
