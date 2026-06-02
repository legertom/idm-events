import Link from "next/link";
import { CourseOverview } from "@/components/CourseOverview";
import { DownloadCsv } from "@/components/DownloadCsv";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section>
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          Customer Support · onboarding
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          How to read a Clever{" "}
          <span className="text-brand-600">IDM events export</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
          An events export is the receipt for everything Clever did to a user’s
          account, action by action. By the end of this short course you’ll open
          one, reconstruct
          what happened over time, and tell whether a problem came from{" "}
          <strong className="font-semibold text-ink">Clever</strong> or from the{" "}
          <strong className="font-semibold text-ink">data Clever received</strong>.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <Pill>~35 minutes</Pill>
          <Pill>5 modules + quiz</Pill>
          <Pill>Follow along in Excel</Pill>
          <Pill>No JSON experience needed</Pill>
        </div>
      </section>

      <CourseOverview />

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">
          You’ll follow one teacher the whole way
        </h2>
        <p className="mt-2 text-[15px] leading-7 text-ink-soft">
          Every example uses one anonymized export — filtered to a single teacher,{" "}
          <strong className="font-semibold text-ink">Jordan Avery</strong> — whose
          account drifted into the <code className="font-mono">*Restricted</code>{" "}
          folder and then got fixed. You’ll watch it happen across Google and
          Active Directory, and learn to spot exactly why — using the same buttons
          and panels a real export gives you.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <DownloadCsv variant="subtle" />
          <Link
            href="/excel"
            className="focus-ring rounded-lg text-sm font-medium text-brand-700 hover:underline"
          >
            Open it in Excel and follow along →
          </Link>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Jordan Avery and <code className="font-mono">maplewood.example.org</code>{" "}
          are fictional stand-ins; all names, emails, and IDs have been scrubbed.
        </p>
      </section>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-ink-soft">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}
