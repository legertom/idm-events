"use client";

import { useState } from "react";
import {
  EVENTS_OLDEST_FIRST,
  getOrgUnit,
  getPreviousOrgUnit,
  shortOu,
} from "@/lib/events";
import { destStyle, ouTone } from "@/lib/event-display";
import { formatDateOnly } from "@/lib/format";

const TONE: Record<string, string> = {
  bad: "border-amber-300 bg-amber-50 text-amber-900",
  good: "border-emerald-300 bg-emerald-50 text-emerald-900",
  neutral: "border-slate-300 bg-slate-50 text-ink",
};

export function OuDiff() {
  const placements = EVENTS_OLDEST_FIRST.filter((e) => getOrgUnit(e));
  const [id, setId] = useState<string>(
    placements.find((e) => getOrgUnit(e)?.endsWith("*Restricted"))?.id ??
      placements[0]!.id,
  );
  const e = placements.find((x) => x.id === id)!;

  const prev = getPreviousOrgUnit(e);
  const curr = getOrgUnit(e);
  const changed = prev !== curr;
  const ds = destStyle(e);

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-ink">Inspect a placement:</label>
        <select
          value={id}
          onChange={(ev) => setId(ev.target.value)}
          className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
        >
          {placements.map((p) => (
            <option key={p.id} value={p.id}>
              {formatDateOnly(p.timestamp)} · {destStyle(p).label} ·{" "}
              {shortOu(getOrgUnit(p))}
            </option>
          ))}
        </select>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${ds.chip}`}
        >
          {ds.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Box label="reverse_data.previous_org_unit" value={prev} tone="neutral" />
        <div className="grid place-items-center">
          <span className="text-2xl text-ink-muted" aria-hidden>
            →
          </span>
        </div>
        <Box label="org_unit (this event)" value={curr} tone={ouTone(curr)} />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-ink-soft">
        {changed ? (
          <>
            Clever <strong className="text-ink">moved</strong> this account from{" "}
            <code className="font-mono">{shortOu(prev) ?? "—"}</code> to{" "}
            <code className="font-mono">{shortOu(curr)}</code>.{" "}
            {curr?.endsWith("*Restricted") && (
              <span className="text-amber-700">
                Landing in <code className="font-mono">*Restricted</code> is the
                tell-tale sign the building code didn’t match a rule.
              </span>
            )}
          </>
        ) : (
          <>
            <strong className="text-ink">No move</strong> — the OU is the same
            before and after. The change in this event was something else.
          </>
        )}
        <span className="mt-1 block text-xs text-ink-muted">
          This is method step 4: compare <code className="font-mono">org_unit</code>{" "}
          to <code className="font-mono">reverse_data.previous_org_unit</code>.
        </span>
      </div>
    </div>
  );
}

function Box({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | null;
  tone: "bad" | "good" | "neutral";
}) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${TONE[tone]}`}>
      <p className="font-mono text-[11px] opacity-70">{label}</p>
      <p className="mt-1 break-all font-mono text-sm font-semibold">
        {value ?? "null"}
      </p>
    </div>
  );
}
