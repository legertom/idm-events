import type { Metadata } from "next";
import Link from "next/link";
import { TimestampConverter } from "@/components/TimestampConverter";

export const metadata: Metadata = {
  title: "Timestamp converter — IDM Events Training",
};

export default function TimestampPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <Link href="/" className="hover:text-brand-700">
            Course
          </Link>
          <span>/</span>
          <span>Timestamp converter</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          Timestamp converter
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-ink-soft">
          Every timestamp in an export is{" "}
          <strong className="font-semibold text-ink">UTC</strong> — it ends in{" "}
          <code className="font-mono">Z</code>. Before you quote a time to a
          customer, convert it to their local zone, or you’ll be hours off. Paste a
          timestamp and pick a US zone.
        </p>
      </div>

      <TimestampConverter />

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-ink-soft">
        <strong className="font-semibold text-ink">Why the zone label changes:</strong>{" "}
        the converter follows daylight saving automatically, so you’ll see{" "}
        <code className="font-mono">EDT</code> vs <code className="font-mono">EST</code>{" "}
        depending on the date. Not sure which zone the district is in? When in
        doubt, show the customer the UTC value and the converted value side by side.
      </div>

      <div className="text-sm">
        <Link
          href="/cheat-sheet"
          className="focus-ring rounded-lg font-medium text-brand-700 hover:underline"
        >
          Back to the cheat sheet →
        </Link>
      </div>
    </div>
  );
}
