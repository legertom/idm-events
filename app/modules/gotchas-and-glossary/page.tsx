import { ModuleLayout } from "@/components/ModuleLayout";
import { Callout } from "@/components/Callout";
import { CheckQuestion } from "@/components/CheckQuestion";
import { FlipCardGrid } from "@/components/FlipCard";
import { GLOSSARY } from "@/lib/glossary";

const GOTCHAS: Array<{ title: string; body: string }> = [
  {
    title: "*Restricted is the catch-all OU",
    body: "When the incoming code matches no if-equals rule in config_string, the template falls through to a default usually named *Restricted. It almost always means the source data didn’t match a mapping rule — not that Clever broke. Check the code on the user’s record against the rules.",
  },
  {
    title: "Read config_string for breakage",
    body: "A missing entry or a syntax slip (e.g. two values run together with no separator) changes how it resolves. If it looks malformed on one event and correct on a later one, the customer likely fixed it between syncs.",
  },
  {
    title: "null ≠ deleted",
    body: "It means “not part of this event.” Never tell a customer a field was cleared just because it’s null in a row.",
  },
  {
    title: "Google and AD are separate",
    body: "A change in one destination does not imply the same in the other. Verify each on its own timeline.",
  },
  {
    title: "Timestamps are UTC",
    body: "Convert to the district’s local time before quoting times, or you’ll be hours off.",
  },
  {
    title: "needs_destination_update: true",
    body: "Means a change was queued to write out — useful when a customer says “Clever knew, but the destination never updated.”",
  },
  {
    title: "One export = one user",
    body: "It is not a district-wide audit log. Pull one export per user you’re investigating.",
  },
];

export default function Module5() {
  return (
    <ModuleLayout slug="gotchas-and-glossary">
      <p>
        Almost every wrong conclusion a new agent draws comes from one of these
        traps. Skim them now; they’ll save you a bad customer email later.
      </p>

      <div className="space-y-3">
        {GOTCHAS.map((g) => (
          <div
            key={g.title}
            className="rounded-xl border border-amber-200 bg-amber-50/60 p-4"
          >
            <p className="flex items-center gap-2 font-semibold text-amber-900">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-200 text-[11px] font-bold">
                !
              </span>
              {g.title}
            </p>
            <p className="mt-1 pl-7 text-sm leading-6 text-ink-soft">{g.body}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-ink">Glossary — tap a card to flip it</h2>
      <p>
        The vocabulary CS uses daily. Read the term, say the definition in your
        head, then flip to check yourself.
      </p>

      <FlipCardGrid items={GLOSSARY} />

      <Callout tone="info" title="Almost done">
        That’s the whole method. Next up is a five-question quiz — including two
        real scenarios — to lock it in.
      </Callout>

      <CheckQuestion
        question="An event’s Timestamp is 2026-06-01T19:59:13.000Z and the district is in US Central time. A customer asks when the change happened. What do you do?"
        options={[
          {
            text: "Quote 19:59 — the time in the export is the time it happened.",
            why: "The Z means UTC. Quoting it as local time would be hours off.",
          },
          {
            text: "Convert from UTC to the district’s local time first, then quote that.",
            correct: true,
            why: "Right. The trailing Z means UTC. Convert before quoting (here, ~2:59 PM Central) so you and the customer are talking about the same moment.",
          },
          {
            text: "Tell them exports don’t include reliable times.",
            why: "They do — the times are precise; they’re just in UTC and need converting.",
          },
        ]}
      />
    </ModuleLayout>
  );
}
