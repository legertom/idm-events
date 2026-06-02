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

      <h2 className="text-lg font-bold text-ink">
        JSON in 90 seconds (no engineering required)
      </h2>
      <p>
        The Data field is just <strong>labeled boxes</strong>. There are only two
        shapes you ever need to recognize:
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-sm font-semibold text-ink">{"{ }"} an object</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            A set of <code className="font-mono">&quot;label&quot;: value</code>{" "}
            pairs. The whole Data field is one big object called{" "}
            <code className="font-mono">content</code>, and boxes can sit inside
            boxes.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="font-mono text-sm font-semibold text-ink">{"[ ]"} an array</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            A <strong>list</strong> of items (often more objects).{" "}
            <code className="font-mono">member_of</code> and{" "}
            <code className="font-mono">external_ids</code> are arrays.
          </p>
        </div>
      </div>
      <p>
        When the course (or a teammate in a ticket) writes a path like{" "}
        <code className="font-mono">reverse_data.previous_org_unit</code>, the dots
        just mean <strong>“go inside.”</strong> Open the{" "}
        <code className="font-mono">reverse_data</code> box, then read its{" "}
        <code className="font-mono">previous_org_unit</code> label. Paths are simply
        directions to a value.
      </p>
      <div className="scroll-slim overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6">
        <div className="text-slate-500">content {"{"}</div>
        <div className="pl-4">
          <span className="text-brand-700">&quot;org_unit&quot;</span>:{" "}
          <span className="text-emerald-700">&quot;/AllUsers/Staff/HighSchool&quot;</span>
        </div>
        <div className="pl-4">
          <span className="text-brand-700">&quot;reverse_data&quot;</span>: {"{"}{" "}
          <span className="text-amber-700">← a box inside the box</span>
        </div>
        <div className="pl-8">
          <span className="text-brand-700">&quot;previous_org_unit&quot;</span>:{" "}
          <span className="text-emerald-700">&quot;/AllUsers/Staff/Brookside&quot;</span>
        </div>
        <div className="pl-4 text-slate-500">{"}"}</div>
        <div className="pl-4">
          <span className="text-brand-700">&quot;external_ids&quot;</span>: [{" "}
          <span className="text-amber-700">← a list</span>
        </div>
        <div className="pl-8 text-slate-500">
          {"{"} <span className="text-brand-700">&quot;customType&quot;</span>:{" "}
          <span className="text-emerald-700">&quot;pk&quot;</span>,{" "}
          <span className="text-brand-700">&quot;value&quot;</span>:{" "}
          <span className="text-emerald-700">&quot;4021&quot;</span> {"}"}, …
        </div>
        <div className="pl-4 text-slate-500">]</div>
        <div className="text-slate-500">{"}"}</div>
      </div>
      <p className="text-sm text-ink-muted">
        Follow the path:{" "}
        <code className="font-mono">reverse_data.previous_org_unit</code> →{" "}
        <code className="font-mono">&quot;/AllUsers/Staff/Brookside&quot;</code>.
      </p>

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

      <h2 className="text-lg font-bold text-ink">Two complex strings, decoded</h2>
      <p>
        Two fields look intimidating but follow simple, fixed rules. Learn to read
        them once and they’re easy forever.
      </p>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-ink">
          <code className="font-mono">ad_dest_dn</code> — an Active Directory
          location
        </p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">
          A “distinguished name.” Read it <strong>right to left</strong>:
        </p>
        <div className="scroll-slim mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 font-mono text-xs">
          <span className="rounded bg-sky-100 px-1 text-sky-800">CN=Jordan.Avery</span>
          ,{" "}
          <span className="rounded bg-emerald-100 px-1 text-emerald-800">OU=SouthWest</span>
          ,{" "}
          <span className="rounded bg-emerald-100 px-1 text-emerald-800">OU=Staff</span>
          ,{" "}
          <span className="rounded bg-emerald-100 px-1 text-emerald-800">OU=AllUsers</span>
          ,{" "}
          <span className="rounded bg-violet-100 px-1 text-violet-800">DC=maplewood</span>
          ,{" "}
          <span className="rounded bg-violet-100 px-1 text-violet-800">DC=example</span>
          ,{" "}
          <span className="rounded bg-violet-100 px-1 text-violet-800">DC=org</span>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-ink-soft">
          <li>
            <span className="rounded bg-violet-100 px-1 font-mono text-[11px] text-violet-800">DC</span>{" "}
            — the domain (<code className="font-mono">maplewood.example.org</code>),
            always at the end.
          </li>
          <li>
            <span className="rounded bg-emerald-100 px-1 font-mono text-[11px] text-emerald-800">OU</span>{" "}
            — the folders, nested. The{" "}
            <strong>leftmost OU is where the account actually sits</strong>{" "}
            (SouthWest); each one to its right is the parent.
          </li>
          <li>
            <span className="rounded bg-sky-100 px-1 font-mono text-[11px] text-sky-800">CN</span>{" "}
            — the account itself, always at the start.
          </li>
        </ul>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          So it reads: the <strong>Jordan.Avery</strong> account, in{" "}
          <strong>SouthWest</strong>, inside Staff, inside AllUsers. It’s AD’s
          version of <code className="font-mono">org_unit</code>.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-ink">
          <code className="font-mono">config_string</code> — the OU lookup table
        </p>
        <div className="scroll-slim mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 font-mono text-xs leading-6">
          <span className="text-ink-muted">orgunit=</span>
          <span className="rounded bg-sky-100 px-1 text-sky-800">/AllUsers/Staff/</span>
          {"{{"}{" "}
          <span className="rounded bg-emerald-100 px-1 text-emerald-800">
            if equals teacher.ext.ou_account &quot;340&quot; &quot;HighSchool&quot;
          </span>{" "}
          …{" "}
          <span className="rounded bg-amber-100 px-1 text-amber-900">&quot;*Restricted&quot;</span>
          {"}};"}
        </div>
        <ul className="mt-3 space-y-1.5 text-sm leading-6 text-ink-soft">
          <li>
            <span className="rounded bg-sky-100 px-1 text-[11px] font-semibold text-sky-800">prefix</span>{" "}
            — the parent folder every result hangs off.
          </li>
          <li>
            <span className="rounded bg-emerald-100 px-1 text-[11px] font-semibold text-emerald-800">if equals</span>{" "}
            rules — one per building: “if the user’s{" "}
            <code className="font-mono">ou_account</code> code is X, place them in
            folder Y.” Read it like a lookup table.
          </li>
          <li>
            <span className="rounded bg-amber-100 px-1 text-[11px] font-semibold text-amber-900">fallback</span>{" "}
            — the last bare value (here{" "}
            <code className="font-mono">*Restricted</code>), used when no rule
            matched.
          </li>
        </ul>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          You’ll run this one interactively in the next module.
        </p>
      </div>

      <Callout tone="info" title="These reading skills are the universal part">
        Following a JSON path, decoding a DN, and parsing{" "}
        <code className="font-mono">config_string</code> work on{" "}
        <strong>any</strong> district’s export. The names and values change from
        district to district — these shapes don’t. This is the part worth getting
        truly comfortable with.
      </Callout>

      <CheckQuestion
        question="An account’s ad_dest_dn is CN=A.Teacher,OU=Maple,OU=Staff,OU=AllUsers,DC=… — which folder is the account actually in?"
        options={[
          {
            text: "Staff — it’s in the middle.",
            why: "Staff is a parent folder. The account’s real folder is the leftmost OU.",
          },
          {
            text: "Maple — the leftmost OU is the innermost folder the account sits in.",
            correct: true,
            why: "Right. Read a DN right-to-left: DC = domain, OU = nested folders (leftmost is innermost), CN = the account.",
          },
          {
            text: "You can’t tell from a DN alone.",
            why: "You can — the leftmost OU is always the account’s actual folder.",
          },
        ]}
      />

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
