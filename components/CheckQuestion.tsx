"use client";

import { useState } from "react";

export interface ChoiceOption {
  text: string;
  correct?: boolean;
  why?: string;
}

export function CheckQuestion({
  question,
  options,
  hint,
}: {
  question: string;
  options: ChoiceOption[];
  hint?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const isRight = answered && options[picked]?.correct === true;

  return (
    <div className="card p-5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
          Check
        </span>
        <p className="font-medium text-ink">{question}</p>
      </div>

      <div className="mt-4 grid gap-2">
        {options.map((opt, i) => {
          const selected = picked === i;
          const reveal = answered && (selected || opt.correct);
          let cls =
            "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40";
          if (reveal && opt.correct)
            cls = "border-emerald-400 bg-emerald-50 text-emerald-900";
          else if (reveal && selected && !opt.correct)
            cls = "border-rose-400 bg-rose-50 text-rose-900";
          else if (answered) cls = "border-slate-200 bg-white opacity-60";

          return (
            <button
              key={i}
              type="button"
              onClick={() => !answered && setPicked(i)}
              disabled={answered}
              className={`focus-ring flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors ${cls} ${
                answered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                  reveal && opt.correct
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : reveal && selected
                      ? "border-rose-500 bg-rose-500 text-white"
                      : "border-slate-300 text-slate-400"
                }`}
              >
                {reveal && opt.correct ? "✓" : reveal && selected ? "✕" : String.fromCharCode(65 + i)}
              </span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {!answered && hint && (
        <p className="mt-3 text-xs text-ink-muted">Hint: {hint}</p>
      )}

      {answered && (
        <div className="mt-4 animate-fade-in rounded-xl bg-slate-50 p-4">
          <p
            className={`text-sm font-semibold ${
              isRight ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {isRight ? "Correct." : "Not quite."}
          </p>
          {options[picked!]?.why && (
            <p className="mt-1 text-sm leading-6 text-ink-soft">
              {options[picked!]!.why}
            </p>
          )}
          {!isRight && (
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              The right answer is{" "}
              <strong className="text-ink">
                “{options.find((o) => o.correct)?.text}.”
              </strong>{" "}
              {options.find((o) => o.correct)?.why}
            </p>
          )}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="focus-ring mt-3 rounded-lg px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
