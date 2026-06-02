"use client";

import { useEffect, useMemo, useState } from "react";
import { QUIZ, QUIZ_TOTAL } from "@/lib/quiz";
import { useProgress } from "./ProgressProvider";

export function Quiz() {
  const { recordQuiz, markComplete, quizBest } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selfRevealed, setSelfRevealed] = useState(false);
  const [selfCorrect, setSelfCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const mcqs = QUIZ.filter((q) => q.kind === "mcq");
  const allMcqAnswered = mcqs.every((q) => answers[q.id] !== undefined);

  const score = useMemo(() => {
    let s = 0;
    for (const q of QUIZ) {
      if (q.kind === "mcq") {
        const picked = answers[q.id];
        if (picked !== undefined && q.options[picked]?.correct) s += 1;
      } else if (selfCorrect) {
        s += 1;
      }
    }
    return s;
  }, [answers, selfCorrect]);

  useEffect(() => {
    if (submitted) {
      recordQuiz(score);
      markComplete("quiz");
    }
  }, [submitted, score, recordQuiz, markComplete]);

  const reset = () => {
    setAnswers({});
    setSelfRevealed(false);
    setSelfCorrect(null);
    setSubmitted(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
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
              <span className="text-ink-muted"> · Best: {quizBest}/{QUIZ_TOTAL}</span>
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
                {q.kind === "self" && (
                  <span className="mb-1 inline-block rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800">
                    Short answer
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
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [q.id]: oi }))
                      }
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
              <div className="mt-3 pl-8">
                <button
                  type="button"
                  onClick={() => setSelfRevealed(true)}
                  className="focus-ring rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-slate-50"
                >
                  {selfRevealed ? "Model answer ↓" : "Reveal model answer"}
                </button>
                {selfRevealed && (
                  <div className="mt-3 animate-fade-in rounded-xl bg-slate-50 p-4">
                    <ol className="list-decimal space-y-1 pl-5 text-sm leading-6 text-ink-soft">
                      {q.model.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ol>
                    <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">
                      <span className="text-sm text-ink-soft">Did you cover the key points?</span>
                      <button
                        type="button"
                        onClick={() => setSelfCorrect(true)}
                        className={`focus-ring rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          selfCorrect === true
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-200 text-ink-soft hover:bg-white"
                        }`}
                      >
                        Yes, give me the point
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelfCorrect(false)}
                        className={`focus-ring rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          selfCorrect === false
                            ? "bg-slate-600 text-white"
                            : "border border-slate-200 text-ink-soft hover:bg-white"
                        }`}
                      >
                        Not quite
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
