"use client";

import { useState } from "react";

interface Col {
  key: string;
  sample: string;
  desc: string;
  emphasis?: boolean;
}

const COLS: Col[] = [
  {
    key: "Timestamp",
    sample: "2026-06-01T19:59:13.000Z",
    desc: "When the event happened, in UTC (ISO-8601, ends in Z). Rows usually arrive newest-first, so flip them to read forward.",
  },
  {
    key: "EventType",
    sample: "idm-user-updated",
    desc: "The kind of action. Mostly idm-user-matched (linked an account) or idm-user-updated (pushed a change).",
  },
  {
    key: "Clever User ID",
    sample: "64f9a1c2e8b7d3046a5f9e10",
    desc: "Clever's internal unique ID for the user (24-char hex). The same value appears as clever_id inside Data. If an export covers several people, this is how you tell whose rows are whose.",
  },
  {
    key: "Username",
    sample: "jordan.avery@maplewood.example.org",
    desc: "The user's username/email at the time of the event. Casing can vary between rows.",
  },
  {
    key: "UserType",
    sample: "teacher",
    desc: "The role Clever assigned — teacher, student, staff, and so on.",
  },
  {
    key: "Data",
    sample: '{"content":{ … the full event … }}',
    desc: "A JSON blob with the full event detail. This is where the real information lives — org_unit, config_string, reverse_data, passwords, and more.",
    emphasis: true,
  },
  {
    key: "Destination",
    sample: "google",
    desc: "Where the action was sent — google or activeDirectory. Treat each destination as its own timeline.",
  },
];

export function ColumnsTable() {
  const [sel, setSel] = useState(5); // default to Data

  return (
    <div className="card overflow-hidden">
      <div className="scroll-slim overflow-x-auto">
        <div className="min-w-[640px]">
          {/* header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {COLS.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSel(i)}
                className={`focus-ring border-r border-slate-200 px-3 py-2 text-left text-xs font-semibold last:border-r-0 ${
                  sel === i
                    ? "bg-brand-600 text-white"
                    : c.emphasis
                      ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                      : "text-ink-soft hover:bg-slate-100"
                }`}
              >
                {c.key}
                {c.emphasis && sel !== i && (
                  <span className="ml-1 rounded bg-amber-200 px-1 text-[9px] font-bold uppercase">
                    detail
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* sample row */}
          <div className="grid grid-cols-7">
            {COLS.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSel(i)}
                className={`focus-ring truncate border-r border-slate-100 px-3 py-2 text-left font-mono text-[11px] last:border-r-0 ${
                  sel === i ? "bg-brand-50 text-brand-900" : "text-ink-muted hover:bg-slate-50"
                }`}
                title={c.sample}
              >
                {c.sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* detail */}
      <div className="animate-fade-in border-t border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
            {COLS[sel]!.key}
          </span>
          {COLS[sel]!.emphasis && (
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
              The story lives here
            </span>
          )}
        </div>
        <p className="mt-2 text-[15px] leading-7 text-ink-soft">{COLS[sel]!.desc}</p>
        <p className="mt-2 font-mono text-xs text-ink-muted">
          example: {COLS[sel]!.sample}
        </p>
      </div>
    </div>
  );
}
