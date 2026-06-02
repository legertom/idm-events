import { ModuleLayout } from "@/components/ModuleLayout";
import { Callout } from "@/components/Callout";
import { CheckQuestion } from "@/components/CheckQuestion";
import { ColumnsTable } from "@/components/ColumnsTable";

export default function Module2() {
  return (
    <ModuleLayout slug="the-columns">
      <p>
        Every export has the same <strong>seven columns</strong>. Six of them set
        the scene — who, when, what kind, and where. The seventh,{" "}
        <strong>Data</strong>, is where the actual story lives. Click any column
        below to see what it holds (it opens on <strong>Data</strong> on purpose).
      </p>

      <ColumnsTable />

      <Callout tone="key" title="Six columns orient you; Data explains the event">
        Timestamp, EventType, Clever User ID, Username, UserType, and Destination
        are quick labels. The moment you’re actually troubleshooting something,
        you’ll be living inside the <strong>Data</strong> column.
      </Callout>

      <h2 className="text-lg font-bold text-ink">Two event types do almost all the work</h2>
      <p>
        The <code className="font-mono">EventType</code> column has a handful of
        possible values, but two of them cover the vast majority of rows:
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-sm font-semibold text-slate-700">
            idm-user-matched
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            Clever <strong>found a destination account and linked it</strong> to
            the Clever user. Shows up early in a user’s history and usually carries{" "}
            <code className="font-mono">should_create_user_association: true</code>.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-sm font-semibold text-brand-700">
            idm-user-updated
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            Clever <strong>pushed a change</strong> to an already-linked account —
            a password, an org-unit move, a group change, an attribute update.
          </p>
        </div>
      </div>
      <p className="text-sm text-ink-muted">
        Other types exist (creates, deletes, errors), but{" "}
        <strong>matched</strong> and <strong>updated</strong> are what you’ll see
        almost every time.
      </p>

      <CheckQuestion
        question="You open an export and want the org-unit a change placed the user in. Which column do you read?"
        options={[
          {
            text: "Destination — it says google or activeDirectory.",
            why: "That tells you where the action went, not the org-unit value.",
          },
          {
            text: "Data — the org_unit lives inside its JSON.",
            correct: true,
            why: "Exactly. The six outer columns orient you; the specific values (like org_unit) are inside Data.",
          },
          {
            text: "EventType — it’s an idm-user-updated.",
            why: "EventType tells you it was a change, but not what the new org-unit is.",
          },
        ]}
      />
    </ModuleLayout>
  );
}
