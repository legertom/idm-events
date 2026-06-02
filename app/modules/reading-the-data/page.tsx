import { ModuleLayout } from "@/components/ModuleLayout";
import { Callout } from "@/components/Callout";
import { CheckQuestion } from "@/components/CheckQuestion";
import { JsonViewer } from "@/components/JsonViewer";
import { EVENTS_OLDEST_FIRST } from "@/lib/events";

const sample = EVENTS_OLDEST_FIRST.find((e) => e.id === "ev12")!;

const CATEGORIES: Array<{ name: string; fields: string; note: string }> = [
  {
    name: "Identity",
    fields: "clever_id · sis_id · user_type · primary_email",
    note: "Who the record is. sis_id is the roster source of truth.",
  },
  {
    name: "Destination",
    fields: "dest_id · ad_dest_dn · org_unit · member_of",
    note: "Where it goes and where it lands. org_unit is the big one.",
  },
  {
    name: "OU-mapping",
    fields: "config_string",
    note: "The template that decides org_unit. Read it when placement is wrong.",
  },
  {
    name: "Custom & external",
    fields: "custom_fields · external_ids · organizations",
    note: "Extras like department and homeDrive, plus ID tags.",
  },
  {
    name: "Passwords",
    fields: "password · change_password_on_next_*",
    note: "redacted = a password was pushed. Three reset flavors for different sign-ins.",
  },
  {
    name: "Before snapshot",
    fields: "reverse_data.previous_org_unit · previous_member_of",
    note: "What it was before this change — your diffing tool.",
  },
];

export default function Module3() {
  return (
    <ModuleLayout slug="reading-the-data">
      <p>
        The <strong>Data</strong> column is JSON, and everything in it is wrapped
        in one object called <code className="font-mono">content</code>. You don’t
        need to memorize every field — you need to recognize the{" "}
        <strong>categories</strong> and know the handful of fields that actually
        drive support cases.
      </p>

      <Callout tone="key" title="null ≠ deleted">
        Clever sends the <strong>full record shape on every event</strong>, so most
        fields come through present-but-<code className="font-mono">null</code>.
        A <code className="font-mono">null</code> means{" "}
        <strong>“not part of this change,”</strong> never “this was deleted.” The
        fields that are <em>populated</em> are the ones that mattered for this
        event. Never tell a customer a field was cleared just because it’s null in
        a row.
      </Callout>

      <h2 className="text-lg font-bold text-ink">The field groups, at a glance</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <div key={c.name} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-ink">{c.name}</p>
            <p className="mt-1 font-mono text-[11px] leading-5 text-brand-700">
              {c.fields}
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">{c.note}</p>
          </div>
        ))}
      </div>

      <Callout tone="tip" title="The five fields worth memorizing">
        Out of everything in <code className="font-mono">content</code>, these are
        the ones you’ll reach for constantly:{" "}
        <code className="font-mono">org_unit</code>,{" "}
        <code className="font-mono">reverse_data.previous_org_unit</code>,{" "}
        <code className="font-mono">config_string</code>,{" "}
        <code className="font-mono">needs_destination_update</code>, and{" "}
        <code className="font-mono">password</code>.
      </Callout>

      <h2 className="text-lg font-bold text-ink">Try it on a real event</h2>
      <p>
        This is the Data from Jordan’s final Google event. Turn on{" "}
        <strong>“Explain key fields”</strong> to annotate the important ones, then
        flip on <strong>“Dim the nulls”</strong> — watch how few fields are
        actually carrying this event. Those bright lines are the change; the faded
        ones are just the record shape.
      </p>

      <JsonViewer content={sample.content} />

      <CheckQuestion
        question="In a row, recovery_email is null. A customer asks, “Did Clever erase the recovery email?” What do you say?"
        options={[
          {
            text: "Yes — null means Clever cleared that field.",
            why: "This is the classic trap. null does not mean cleared.",
          },
          {
            text: "No — null just means recovery_email wasn’t part of this change; this event didn’t touch it.",
            correct: true,
            why: "Right. Clever sends the whole record shape every time, so unrelated fields show as null. This event simply wasn’t about the recovery email.",
          },
          {
            text: "Can’t tell from an export at all.",
            why: "You can tell: null here means “not part of this event,” so this event didn’t change it.",
          },
        ]}
      />
    </ModuleLayout>
  );
}
