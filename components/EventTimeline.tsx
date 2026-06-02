"use client";

import { useMemo, useState } from "react";
import {
  EVENTS_OLDEST_FIRST,
  eventTypeLabel,
  getOrgUnit,
  getPreviousOrgUnit,
  shortOu,
} from "@/lib/events";
import type { Destination, IdmEvent } from "@/lib/types";
import {
  destStyle,
  eventTypeChip,
  ouTone,
  summarize,
} from "@/lib/event-display";
import { formatUtc } from "@/lib/format";
import { JsonViewer } from "./JsonViewer";

type Order = "old" | "new";
type Filter = "all" | Destination;

const OU_TONE_CLASS: Record<string, string> = {
  bad: "bg-amber-100 text-amber-900",
  good: "bg-emerald-100 text-emerald-800",
  neutral: "bg-slate-100 text-slate-700",
};

export function EventTimeline({
  initialOrder = "old",
}: {
  initialOrder?: Order;
}) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    let list: IdmEvent[] =
      order === "old" ? EVENTS_OLDEST_FIRST : [...EVENTS_OLDEST_FIRST].reverse();
    if (filter !== "all") list = list.filter((e) => e.destination === filter);
    return list;
  }, [order, filter]);

  return (
    <div className="card overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          <Seg active={order === "old"} onClick={() => setOrder("old")}>
            Oldest first
          </Seg>
          <Seg active={order === "new"} onClick={() => setOrder("new")}>
            Newest first
          </Seg>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          <Seg active={filter === "all"} onClick={() => setFilter("all")}>
            Both
          </Seg>
          <Seg active={filter === "google"} onClick={() => setFilter("google")}>
            Google
          </Seg>
          <Seg
            active={filter === "activeDirectory"}
            onClick={() => setFilter("activeDirectory")}
          >
            AD
          </Seg>
        </div>
        <p className="ml-auto hidden text-xs text-ink-muted md:block">
          {rows.length} events · click any row to open its Data
        </p>
      </div>

      {/* Rows */}
      <ol className="divide-y divide-slate-100">
        {rows.map((e) => {
          const ds = destStyle(e);
          const ou = shortOu(getOrgUnit(e));
          const open = openId === e.id;
          return (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : e.id)}
                className="focus-ring flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ds.dot}`} />
                <span className="w-44 shrink-0 font-mono text-xs text-ink-muted">
                  {formatUtc(e.timestamp)}
                </span>
                <span
                  className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline ${ds.chip}`}
                >
                  {ds.label}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${eventTypeChip(
                    e,
                  )}`}
                >
                  {eventTypeLabel(e.eventType)}
                </span>
                <span className="truncate text-sm text-ink-soft">
                  {summarize(e)}
                </span>
                {ou && (
                  <span
                    className={`ml-auto hidden shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] md:inline ${
                      OU_TONE_CLASS[ouTone(getOrgUnit(e))]
                    }`}
                  >
                    {ou}
                  </span>
                )}
                <span
                  className={`shrink-0 text-ink-muted transition-transform ${
                    open ? "rotate-90" : ""
                  } ${ou ? "" : "ml-auto"}`}
                  aria-hidden
                >
                  ▸
                </span>
              </button>

              {open && (
                <div className="animate-fade-in space-y-4 bg-slate-50/60 px-4 pb-5 pt-1">
                  <FactGrid e={e} />
                  <JsonViewer content={e.content} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function FactGrid({ e }: { e: IdmEvent }) {
  const ou = getOrgUnit(e);
  const prev = getPreviousOrgUnit(e);
  const facts: Array<[string, string]> = [
    ["Destination", destStyle(e).label],
    ["Event", eventTypeLabel(e.eventType)],
    ["Username", e.username],
  ];
  if (ou) facts.push(["org_unit", ou]);
  if (prev) facts.push(["previous_org_unit", prev]);
  if (e.content.needs_destination_update !== undefined)
    facts.push([
      "needs_destination_update",
      String(e.content.needs_destination_update),
    ]);
  if (e.content.password === "redacted") facts.push(["password", "redacted"]);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2">
      {facts.map(([k, v]) => (
        <div key={k} className="flex gap-2 text-sm">
          <span className="shrink-0 font-mono text-xs text-ink-muted">{k}</span>
          <span className="ml-auto truncate font-medium text-ink" title={v}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

function Seg({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        active ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}
