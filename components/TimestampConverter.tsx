"use client";

import { useMemo, useState } from "react";

const ZONES = [
  { id: "ET", label: "Eastern", tz: "America/New_York" },
  { id: "CT", label: "Central", tz: "America/Chicago" },
  { id: "MT", label: "Mountain", tz: "America/Denver" },
  { id: "PT", label: "Pacific", tz: "America/Los_Angeles" },
] as const;

type ZoneId = (typeof ZONES)[number]["id"];

const SAMPLES = [
  { label: "Export generated", value: "2026-06-01T22:13:39Z" },
  { label: "Landed in HighSchool", value: "2026-06-01T19:59:13Z" },
  { label: "Earlier *Restricted sync", value: "2026-06-01T17:22:11Z" },
];

/** Parse an export timestamp. ISO strings are treated as UTC; bare digits as epoch. */
function parseStamp(input: string): Date | null {
  const s0 = input.trim();
  if (!s0) return null;
  if (/^\d{10}$/.test(s0)) return new Date(parseInt(s0, 10) * 1000); // epoch seconds
  if (/^\d{13}$/.test(s0)) return new Date(parseInt(s0, 10)); // epoch millis
  let s = s0.replace(/\s+/, "T"); // allow "date time" with a space
  const hasZone = /([zZ])$|([+-]\d{2}:?\d{2})$/.test(s);
  if (!hasZone) s += "Z"; // no zone given → assume UTC (exports are UTC)
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function fmtFull(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
    timeZoneName: "short",
  }).format(d);
}

function fmtShort(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
    timeZoneName: "short",
  }).format(d);
}

export function TimestampConverter() {
  const [input, setInput] = useState("2026-06-01T19:59:13Z");
  const [zone, setZone] = useState<ZoneId>("CT");

  const date = useMemo(() => parseStamp(input), [input]);
  const active = ZONES.find((z) => z.id === zone)!;

  return (
    <div className="card overflow-hidden">
      <div className="space-y-5 p-5">
        {/* Input */}
        <div>
          <label
            htmlFor="ts"
            className="text-xs font-medium uppercase tracking-wide text-ink-muted"
          >
            Paste a timestamp from the export
          </label>
          <input
            id="ts"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="2026-06-01T19:59:13.000Z"
            spellCheck={false}
            className="focus-ring mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SAMPLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setInput(s.value)}
                className="focus-ring rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-ink-muted hover:bg-slate-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zone selector */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Show in
          </span>
          <div className="mt-2 inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-0.5">
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setZone(z.id)}
                className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium ${
                  zone === z.id
                    ? "bg-brand-600 text-white"
                    : "text-ink-soft hover:bg-slate-100"
                }`}
              >
                {z.id}
                <span className="hidden opacity-70 sm:inline"> · {z.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {date ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {active.label} time ({active.id})
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">
              {fmtFull(date, active.tz)}
            </p>
            <p className="mt-2 font-mono text-xs text-ink-muted">
              UTC source · {fmtFull(date, "UTC")}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            That doesn’t look like a timestamp yet. Try an ISO value like{" "}
            <code className="font-mono">2026-06-01T19:59:13Z</code>, or paste epoch
            seconds.
          </div>
        )}

        {/* All zones */}
        {date && (
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
              Same instant, every US zone
            </p>
            <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {ZONES.map((z) => (
                <div
                  key={z.id}
                  className="flex items-baseline justify-between gap-2 text-sm"
                >
                  <dt className="font-medium text-ink-soft">
                    {z.id} · {z.label}
                  </dt>
                  <dd className="font-mono text-xs text-ink">
                    {fmtShort(date, z.tz)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
