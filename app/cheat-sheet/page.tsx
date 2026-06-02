import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { GLOSSARY } from "@/lib/glossary";

const COLUMNS: Array<[string, string]> = [
  ["Timestamp", "When it happened (UTC, ends in Z). Usually newest-first."],
  ["EventType", "matched (linked) or updated (pushed a change)."],
  ["Clever User ID", "Clever’s 24-char hex ID for the user."],
  ["Username", "Email/username at the time of the event."],
  ["UserType", "teacher, student, staff, …"],
  ["Data", "JSON with the full detail — where the real info lives."],
  ["Destination", "google or activeDirectory."],
];

const STEPS: Array<[string, string]> = [
  ["Sort oldest-first", "Flip the export so you read forward."],
  ["Split by destination", "Google and AD are separate timelines."],
  ["Find matched events", "They anchor when each account was linked."],
  ["Diff org_unit vs previous_org_unit", "See what actually moved."],
  ["Read config_string", "It drives placement — most issues live here."],
];

const KEY_FIELDS: Array<[string, string]> = [
  ["org_unit", "The folder the account is placed in."],
  ["reverse_data.previous_org_unit", "OU before this event — pair to spot a move."],
  ["config_string", "Template that decides org_unit."],
  ["needs_destination_update", "true = change queued to write out."],
  ["password", "redacted = a password was pushed; null = no change."],
];

const GOTCHAS: string[] = [
  "*Restricted = the catch-all when no config_string rule matches the incoming code. Usually a data problem, not a Clever bug.",
  "null ≠ deleted — it means “not part of this event.”",
  "Google and AD are independent — verify each separately.",
  "Timestamps are UTC — convert to local before quoting.",
  "Malformed config_string (missing rule / run-together values) changes how it resolves.",
  "One export = one user, not a district audit log.",
];

export default function CheatSheet() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Link href="/" className="hover:text-brand-700">
              Course
            </Link>
            <span>/</span>
            <span>Cheat sheet</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            One-page cheat sheet
          </h1>
        </div>
        <PrintButton />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="The 7 columns">
          <dl className="divide-y divide-slate-100">
            {COLUMNS.map(([k, v]) => (
              <div key={k} className="flex gap-3 py-1.5">
                <dt className="w-32 shrink-0 font-mono text-xs font-semibold text-brand-700">
                  {k}
                </dt>
                <dd className="text-sm text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="The 5-step method">
          <ol className="space-y-2">
            {STEPS.map(([t, b], i) => (
              <li key={t} className="flex gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-ink-soft">
                  <strong className="font-semibold text-ink">{t}.</strong> {b}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="The 5 fields worth memorizing">
          <dl className="divide-y divide-slate-100">
            {KEY_FIELDS.map(([k, v]) => (
              <div key={k} className="py-1.5">
                <dt className="font-mono text-xs font-semibold text-brand-700">
                  {k}
                </dt>
                <dd className="text-sm text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Gotchas">
          <ul className="space-y-1.5">
            {GOTCHAS.map((g) => (
              <li key={g} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Glossary">
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="text-sm">
              <dt className="font-mono text-xs font-semibold text-ink">{g.term}</dt>
              <dd className="text-ink-soft">{g.def}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}
