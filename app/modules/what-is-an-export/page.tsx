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
        <strong>events export</strong> is a CSV of the action history for{" "}
        <strong>one user</strong>: each row is one action Clever took on that
        user’s account, in one destination, at one moment in time.
      </p>

      <p>
        CS pulls an export to troubleshoot things like wrong org-unit placement,
        passwords that aren’t syncing, or an account missing from a destination.
        Its real power: it shows what Clever <em>actually did</em>, which lets you
        separate <strong>“Clever misbehaved”</strong> from{" "}
        <strong>“Clever did exactly what the incoming data told it to.”</strong>
      </p>

      <Callout tone="info" title="One export = one user">
        An export is <strong>not</strong> a district-wide audit log. It’s the
        complete receipt for a single person’s account. If you’re investigating
        three teachers, you pull three exports.
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
        Directory. Don’t worry about decoding it yet. Click a row or two to peek
        inside, get a feel for the shape, and notice that some rows are Google and
        some are AD. By Module 4 you’ll read this fluently.
      </p>

      <EventTimeline initialOrder="new" />

      <Callout tone="tip" title="Why CS loves these">
        When a customer says “Clever broke our org units,” the export usually shows
        one of two things: Clever followed a template exactly (so the fix is in the
        customer’s data), or it genuinely did something unexpected (so it’s ours).
        Either way, you stop guessing.
      </Callout>

      <CheckQuestion
        question="A customer reports that 40 teachers all landed in the wrong org unit. What does a single events export give you?"
        options={[
          {
            text: "A district-wide report of all 40 teachers at once.",
            why: "An export is scoped to one user. For a pattern across many users you’d pull a few representative exports.",
          },
          {
            text: "The full action history for one of those teachers — every action Clever took on that account.",
            correct: true,
            why: "Right. One export = one user. Pull one (or a few) to see exactly what Clever did and why.",
          },
          {
            text: "Only the most recent change to the account.",
            why: "It’s the whole history, not just the latest row.",
          },
        ]}
      />
    </ModuleLayout>
  );
}
