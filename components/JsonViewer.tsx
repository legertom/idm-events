"use client";

import { useMemo, useState } from "react";
import type { EventContent } from "@/lib/types";
import { prettyJson } from "@/lib/events";

/** Plain-language notes shown inline next to high-value fields. */
export const FIELD_NOTES: Record<string, string> = {
  clever_id: "Clever's unique ID for this user",
  sis_id: "User's ID in the district roster (SIS) — the source of truth",
  primary_email: "Main email at the time of this event",
  user_type: "Role Clever assigned",
  dest_id: "The account's ID in the destination system",
  ad_dest_dn: "Exact AD location (distinguished name)",
  ad_sam_account_name: "AD legacy short logon name",
  ad_user_account_control: "AD account-state flags · null = untouched",
  org_unit: "The folder the account is placed in — most placement issues live here",
  member_of: "Groups the account belongs to",
  config_string: "Template that decides org_unit — read this when placement looks wrong",
  password: "redacted = a password was pushed · null = no password change",
  needs_destination_update: "true = change still queued to write out to the destination",
  should_create_user_association: "true = create the Clever↔destination link (initial match)",
  should_overwrite_ad_sam_account_name: "false = leave the existing AD logon name alone",
  account_claim_op: "An account-claim step (claim / activate flow)",
  reverse_data: "The 'before' snapshot — what it was prior to this change",
  previous_org_unit: "OU before this event — compare with org_unit to see a move",
  previous_member_of: "Groups before this event",
  external_ids: "Extra ID tags (e.g. pk, LastTouched)",
  custom_fields: "Destination-specific extras (e.g. department, homeDrive)",
  organizations: "Org / department associations",
  completion_timestamp: "When this event finished processing",
};

const EMPTY_RE = /:\s*(null|""|\[\]|\{\})\s*,?\s*$/;
const KEY_RE = /^(\s*)"([^"]+)":(.*)$/;

function valueClass(rest: string): string {
  const t = rest.trim().replace(/,$/, "");
  if (t.startsWith('"')) return "text-emerald-700";
  if (t === "null") return "text-slate-400";
  if (t === "true" || t === "false") return "text-violet-700";
  if (/^-?\d/.test(t)) return "text-amber-700";
  return "text-ink-soft";
}

export function JsonViewer({
  content,
  defaultAnnotate = true,
}: {
  content: EventContent;
  defaultAnnotate?: boolean;
}) {
  const [annotate, setAnnotate] = useState(defaultAnnotate);
  const [dimNulls, setDimNulls] = useState(false);
  const lines = useMemo(() => prettyJson(content).split("\n"), [content]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <span className="mr-auto font-mono text-xs text-ink-muted">Data → content</span>
        <Toggle on={annotate} onClick={() => setAnnotate((v) => !v)}>
          Explain key fields
        </Toggle>
        <Toggle on={dimNulls} onClick={() => setDimNulls((v) => !v)}>
          Dim the nulls
        </Toggle>
      </div>

      <pre className="scroll-slim max-h-[28rem] overflow-auto px-4 py-3 font-mono text-[12.5px] leading-6">
        {lines.map((ln, i) => {
          const m = ln.match(KEY_RE);
          const isEmpty = EMPTY_RE.test(ln);
          const faded = dimNulls && isEmpty;

          if (!m) {
            return (
              <div key={i} className={faded ? "opacity-25" : undefined}>
                <span className="text-slate-500">{ln}</span>
              </div>
            );
          }

          const [, indent, key, rest] = m;
          const note = annotate ? FIELD_NOTES[key] : undefined;

          return (
            <div
              key={i}
              className={`${faded ? "opacity-25" : ""} ${
                note ? "-mx-1 rounded bg-amber-50/70 px-1" : ""
              }`}
            >
              <span>{indent}</span>
              <span className={note ? "font-semibold text-brand-800" : "text-brand-700"}>
                &quot;{key}&quot;
              </span>
              <span className="text-slate-400">:</span>
              <span className={valueClass(rest)}>{rest}</span>
              {note && (
                <span className="text-amber-700/90">{"  ← "}{note}</span>
              )}
            </div>
          );
        })}
      </pre>

      {dimNulls && (
        <div className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-ink-muted">
          Faded lines are <span className="font-mono">null</span>/empty — “not part
          of this change,” <strong className="font-semibold text-ink">not deleted.</strong>
        </div>
      )}
    </div>
  );
}

function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`focus-ring rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        on
          ? "border-brand-300 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-ink-muted hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
