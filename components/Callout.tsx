import type { ReactNode } from "react";

type Tone = "info" | "tip" | "warning" | "key";

const TONES: Record<
  Tone,
  { ring: string; badge: string; text: string; label: string; icon: string }
> = {
  info: {
    ring: "border-brand-200 bg-brand-50",
    badge: "bg-brand-100 text-brand-800",
    text: "text-brand-800",
    label: "Good to know",
    icon: "i",
  },
  tip: {
    ring: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
    text: "text-emerald-800",
    label: "Tip",
    icon: "★",
  },
  warning: {
    ring: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-900",
    text: "text-amber-900",
    label: "Watch out",
    icon: "!",
  },
  key: {
    ring: "border-violet-200 bg-violet-50",
    badge: "bg-violet-100 text-violet-800",
    text: "text-violet-800",
    label: "Key rule",
    icon: "✓",
  },
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div className={`rounded-xl border ${t.ring} p-4`}>
      <div className="flex items-center gap-2">
        <span
          className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${t.badge}`}
          aria-hidden
        >
          {t.icon}
        </span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${t.text}`}>
          {title ?? t.label}
        </span>
      </div>
      <div className="mt-2 text-[15px] leading-7 text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
