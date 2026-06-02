import { ModuleLayout } from "@/components/ModuleLayout";
import { Callout } from "@/components/Callout";
import { CheckQuestion } from "@/components/CheckQuestion";
import { EventTimeline } from "@/components/EventTimeline";
import { OuDiff } from "@/components/OuDiff";
import { ConfigStringSimulator } from "@/components/ConfigStringSimulator";

const STEPS = [
  ["Sort oldest-first", "Exports arrive newest-first; flip them so you read the story forward."],
  ["Split by destination", "Google and AD are independent. Read them as two parallel timelines."],
  ["Find the matched events", "They anchor when Clever first linked each account."],
  [
    "Compare org_unit to previous_org_unit",
    "For each updated event, diff the two (and groups / custom fields) to see what actually changed.",
  ],
  [
    "Read the config_string",
    "Most placement and naming behavior comes from that template — not a manual setting.",
  ],
];

export default function Module4() {
  return (
    <ModuleLayout slug="tracing-a-problem">
      <p>
        Here’s the skill the whole course builds to: taking an export and
        reconstructing what happened, in order, until the cause is obvious. There’s
        a repeatable five-step method.
      </p>

      <ol className="space-y-2">
        {STEPS.map(([title, body], i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-ink">{title}</p>
              <p className="text-sm leading-6 text-ink-soft">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="text-lg font-bold text-ink">Steps 1–3 · Sort, split, and find the anchors</h2>
      <p>
        Below is Jordan’s export again. Set it to <strong>Oldest first</strong> to
        read forward, then use the destination filter to see Google and AD on their
        own. Notice the two <strong>Matched</strong> rows — a Google match in July
        and an AD match in August. Those are when each account got linked.
      </p>

      <EventTimeline initialOrder="old" />

      <p>
        Reading forward, the story is: matched in Google (Jul) and AD (Aug), a
        password and some account-claim steps (Aug), then placed in the{" "}
        <strong>SouthWest</strong> staff OU in both systems with a{" "}
        <code className="font-mono">Z</code> home drive (Sep). Everything’s healthy.
        Then in late May the account moves <strong>out of SouthWest into{" "}
        <code className="font-mono">*Restricted</code></strong> in both systems and
        is dropped from the SouthWest staff group.
      </p>

      <h2 className="text-lg font-bold text-ink">Step 4 · Diff org_unit against previous_org_unit</h2>
      <p>
        This is the move you’re looking for. Pick the placements below and watch{" "}
        <code className="font-mono">org_unit</code> versus{" "}
        <code className="font-mono">reverse_data.previous_org_unit</code>. The jumps
        into <code className="font-mono">*Restricted</code> are the symptom.
      </p>

      <OuDiff />

      <h2 className="text-lg font-bold text-ink">Step 5 · Read the config_string to learn why</h2>
      <p>
        On June 1, two Google syncs ran about two and a half hours apart. The first
        landed Jordan in <code className="font-mono">*Restricted</code>; the second
        landed them in <strong>HighSchool</strong>. Same account, same building
        code — the only thing that changed was the template. Type Jordan’s code{" "}
        <code className="font-mono">340</code> and flip between the broken and fixed
        templates:
      </p>

      <ConfigStringSimulator />

      <Callout tone="key" title="The verdict — was it Clever or the data?">
        Clever did exactly what its template said. Jordan’s building code had{" "}
        <strong>no matching rule</strong>, so every sync correctly fell through to
        the <code className="font-mono">*Restricted</code> catch-all. The moment the
        district added the <code className="font-mono">340 → HighSchool</code> rule
        (and fixed a run-together syntax slip), the next sync resolved cleanly. The
        fix lived in the <strong>customer’s data</strong>, not in Clever.
      </Callout>

      <CheckQuestion
        question="You’ve sorted oldest-first and split by destination. The last Google event still shows *Restricted, but you see a later AD event placing the user correctly. What’s the safest read?"
        options={[
          {
            text: "The user is fixed everywhere, since AD looks right.",
            why: "Google and AD are separate. A correct AD event says nothing about Google’s state.",
          },
          {
            text: "Google still needs attention — each destination is its own timeline, so verify Google on its own.",
            correct: true,
            why: "Right. Don’t let one destination’s good news cover for the other. Check Google’s own latest event and its config_string.",
          },
          {
            text: "It’s a Clever bug, because the two destinations disagree.",
            why: "Disagreement between destinations is expected — they sync independently and can be driven by different templates.",
          },
        ]}
      />
    </ModuleLayout>
  );
}
