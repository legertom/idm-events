"use client";

import { useState } from "react";
import type { GlossaryItem } from "@/lib/glossary";

function Card({ item }: { item: GlossaryItem }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      className="focus-ring group h-32 w-full [perspective:1000px]"
    >
      <div
        className={`relative h-full w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* front */}
        <div className="absolute inset-0 grid place-items-center rounded-xl border border-slate-200 bg-white px-3 text-center shadow-sm [backface-visibility:hidden]">
          <div>
            <p className="font-mono text-sm font-semibold text-ink">{item.term}</p>
            <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-muted">
              tap to flip
            </p>
          </div>
        </div>
        {/* back */}
        <div className="absolute inset-0 grid place-items-center rounded-xl border border-brand-200 bg-brand-50 px-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-[13px] leading-5 text-ink-soft">{item.def}</p>
        </div>
      </div>
    </button>
  );
}

export function FlipCardGrid({ items }: { items: GlossaryItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.term} item={it} />
      ))}
    </div>
  );
}
