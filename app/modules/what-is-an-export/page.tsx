import Link from "next/link";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Callout } from "@/components/Callout";
import { CheckQuestion } from "@/components/CheckQuestion";
import { EventTimeline } from "@/components/EventTimeline";

export default function Module1() {
  return (
    <ModuleLayout slug="what-is-an-export">
      <p>
        Clever <strong>IDM</strong> (Identity Management) provisions and syncs
        user accounts from a district’s roster into{" "}
        <strong>destination systems</strong> — most commonly{" "}
        <strong>Google Workspace</strong> and{" "}
        <strong>Active Directory (AD)</strong>. An{" "}
        <strong>events export</strong> is a CSV of those sync actions: each row is
        one action Clever took on a user’s account, in one destination, at one
        moment in time. How many users a file covers is your choice — you set the
        scope with a filter when you generate it. This course’s export was{" "}
        <strong>filtered to a single user</strong>, Jordan Avery, so every row here
        is about one teacher.
      </p>

      <p>
        CS pulls an export to troubleshoot things like wrong org-unit placement,
        passwords that aren’t syncing, or an account missing from a destination.
        Its real power: it shows what Clever <em>actually did</em>, which lets you
        separate <strong>“Clever misbehaved”</strong> from{" "}
        <strong>“Clever did exactly what the incoming data told it to.”</strong>
      </p>

      <Callout tone="info" title="Check the scope of your export">
        An export can hold <strong>one user or many</strong> — it depends on the
        filter used to generate it. This file was filtered down to just Jordan.
        When you open an unfamiliar export, glance at the{" "}
        <strong>Clever User ID</strong> and <strong>Username</strong> columns to
        see whose actions you’re reading; if it spans several people, narrow to the
        one you’re investigating first.
      </Callout>

      <Callout tone="tip" title="Follow along in Excel (recommended)">
        Everyone here is on macOS, so you can open this exact export in Excel and do
        every step yourself.{" "}
        <Link href="/excel" className="font-semibold text-brand-700 underline">
          Download the CSV and follow the Excel guide →
        </Link>{" "}
        Take your time and click through it as you go — doing it by hand is the
        fastest way to make this stick.
      </Callout>

      <h2 className="text-lg font-bold text-ink">The filename tells you when it was made</h2>
      <p>
        Exports are named with the moment the file was <em>generated</em> — not
        when the events happened. Don’t confuse the two:
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs sm:text-sm">
        <span className="text-ink-muted">events_export_</span>
        <span className="rounded bg-amber-100 px-1 font-semibold text-amber-900">
          2026-06-01T22_13_39Z
        </span>
        <span className="text-ink-muted">.csv</span>
        <p className="mt-2 font-sans text-xs text-ink-muted">
          ↑ the highlighted part is the export’s generation time, in UTC. The
          events <em>inside</em> can be days, weeks, or months older.
        </p>
      </div>

      <h2 className="text-lg font-bold text-ink">A first look at the whole thing</h2>
      <p>
        Here’s Jordan Avery’s entire export — twelve rows across Google and Active
        Directory, filtered down to this one teacher. Don’t worry about decoding it
        yet. Click a row or two to peek inside, get a feel for the shape, and notice
        that some rows are Google and some are AD. By Module 4 you’ll read this
        fluently.
      </p>

      <EventTimeline initialOrder="new" />

      <Callout tone="tip" title="Why CS loves these">
        When a customer says “Clever broke our org units,” the export usually shows
        one of two things: Clever followed a template exactly (so the fix is in the
        customer’s data), or it genuinely did something unexpected (so it’s ours).
        Either way, you stop guessing.
      </Callout>

      <CheckQuestion
        question="You’re investigating why several teachers landed in the wrong org unit, so you pull an events export. Which is true about its scope?"
        options={[
          {
            text: "An export can only ever contain one user, so you must pull a separate file for every teacher.",
            why: "Not quite — an export isn’t locked to one user. You choose the scope with a filter when you generate it.",
          },
          {
            text: "You can include many users in one export, or filter to one — and a single-user file keeps each story clean and easy to trace.",
            correct: true,
            why: "Right. Scope is your choice. This course’s export was filtered to just Jordan, which is why every row is about one teacher.",
          },
          {
            text: "The export always includes the entire district whether you want it or not.",
            why: "You control the scope with a filter; it isn’t forced to be district-wide.",
          },
        ]}
      />
    </ModuleLayout>
  );
}
