"use client";

import { Fragment, useState } from "react";
import {
  GOOGLE_CONFIG_BROKEN,
  GOOGLE_CONFIG_FIXED,
  GOOGLE_RULES_BROKEN,
  GOOGLE_RULES_FIXED,
  JORDAN_OU_CODE,
  RESTRICTED,
  resolveOu,
  type OuRule,
} from "@/lib/config-string";

type Mode = "broken" | "fixed";

const PRESETS: Array<{ code: string; label: string }> = [
  { code: JORDAN_OU_CODE, label: "Jordan’s code" },
  { code: "320", label: "320" },
  { code: "310", label: "310" },
  { code: "350", label: "350" },
  { code: "777", label: "777 (unknown)" },
];

interface Segment {
  text: string;
  cls: string;
}

/** Render a string, wrapping any of the given segments where they appear. */
function highlight(str: string, segments: Segment[]) {
  const hits = segments
    .map((s) => ({ ...s, idx: str.indexOf(s.text) }))
    .filter((s) => s.idx >= 0)
    .sort((a, b) => a.idx - b.idx);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  hits.forEach((h, i) => {
    if (h.idx < cursor) return; // skip overlaps
    if (h.idx > cursor) nodes.push(<Fragment key={`t${i}`}>{str.slice(cursor, h.idx)}</Fragment>);
    nodes.push(
      <mark key={`h${i}`} className={`rounded px-0.5 ${h.cls}`}>
        {h.text}
      </mark>,
    );
    cursor = h.idx + h.text.length;
  });
  if (cursor < str.length) nodes.push(<Fragment key="tail">{str.slice(cursor)}</Fragment>);
  return nodes;
}

export function ConfigStringSimulator() {
  const [mode, setMode] = useState<Mode>("broken");
  const [code, setCode] = useState<string>(JORDAN_OU_CODE);

  const rules: OuRule[] = mode === "fixed" ? GOOGLE_RULES_FIXED : GOOGLE_RULES_BROKEN;
  const matched = rules.find((r) => r.code === code.trim()) ?? null;
  const result = resolveOu(code, rules);
  const isRestricted = result === RESTRICTED;

  const configStr = mode === "fixed" ? GOOGLE_CONFIG_FIXED : GOOGLE_CONFIG_BROKEN;
  const segments: Segment[] = [];
  if (matched) {
    segments.push({
      text: `if equals teacher.ext.ou_account "${matched.code}" "${matched.name}"`,
      cls: "bg-emerald-200/80 text-emerald-900",
    });
  }
  if (mode === "broken") {
    segments.push({
      text: `"Misc Users""${RESTRICTED}"`,
      cls: "bg-rose-200/80 text-rose-900",
    });
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <span className="text-sm font-semibold text-ink">config_string simulator</span>
        <div className="ml-auto inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setMode("broken")}
            className={`focus-ring rounded-md px-3 py-1 text-xs font-medium ${
              mode === "broken" ? "bg-rose-600 text-white" : "text-ink-soft hover:bg-slate-100"
            }`}
          >
            Broken (before fix)
          </button>
          <button
            type="button"
            onClick={() => setMode("fixed")}
            className={`focus-ring rounded-md px-3 py-1 text-xs font-medium ${
              mode === "fixed" ? "bg-emerald-600 text-white" : "text-ink-soft hover:bg-slate-100"
            }`}
          >
            Fixed (after fix)
          </button>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        {/* Left: input + result */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Building code on the roster (teacher.ext.ou_account)
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              inputMode="numeric"
              className="focus-ring w-28 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              aria-label="Building code"
            />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setCode(p.code)}
                  className={`focus-ring rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                    code === p.code
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-slate-200 text-ink-muted hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              Resolves to org_unit
            </p>
            <p
              className={`mt-1 font-mono text-2xl font-bold ${
                isRestricted ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              /AllUsers/Staff/{result}
            </p>
            <div className="mt-3 space-y-1.5 text-sm text-ink-soft">
              {matched ? (
                <p>
                  Code <code className="font-mono">{code}</code> matches a rule →{" "}
                  <strong className="text-ink">{matched.name}</strong>.
                </p>
              ) : (
                <p>
                  No <code className="font-mono">if equals</code> rule matches code{" "}
                  <code className="font-mono">{code || "—"}</code> → it falls through
                  to the catch-all{" "}
                  <strong className="text-amber-700">{RESTRICTED}</strong>.
                </p>
              )}
            </div>
          </div>

          {code === JORDAN_OU_CODE && (
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {mode === "broken" ? (
                <>
                  This is exactly Jordan’s symptom: code{" "}
                  <code className="font-mono">340</code> had{" "}
                  <strong className="text-ink">no rule</strong> in the template, so
                  every sync dropped them into <code className="font-mono">*Restricted</code>.
                </>
              ) : (
                <>
                  The district added a rule for code{" "}
                  <code className="font-mono">340</code> → HighSchool. Same code, same
                  account — now it lands correctly.
                </>
              )}
            </p>
          )}
        </div>

        {/* Right: the template */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            The template Clever read
          </p>
          <pre className="scroll-slim mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[12px] leading-6 text-ink-soft">
            {highlight(configStr, segments)}
          </pre>
          {mode === "broken" && (
            <p className="mt-2 text-xs leading-5 text-rose-700">
              The highlighted slip runs two values together with no space —{" "}
              <code className="font-mono">&quot;Misc Users&quot;&quot;*Restricted&quot;</code>.
              That, plus the missing code, is the kind of breakage to look for.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
