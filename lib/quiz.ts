export type QuizItem =
  | {
      id: string;
      kind: "mcq";
      prompt: string;
      scenario?: boolean;
      options: { text: string; correct?: boolean }[];
      explain: string;
    }
  | {
      id: string;
      kind: "self";
      prompt: string;
      model: string[];
    };

export const QUIZ: QuizItem[] = [
  {
    id: "q1",
    kind: "mcq",
    prompt: "A field inside Data shows null. What does that mean?",
    options: [
      { text: "Clever deleted that value from the account." },
      { text: "The field simply isn’t part of this change.", correct: true },
      { text: "The destination rejected the value." },
      { text: "The user never had a value there." },
    ],
    explain:
      "Clever sends the full record shape on every event, so the populated fields are the ones that mattered. null means “not part of this event” — never tell a customer a field was cleared just because it’s null.",
  },
  {
    id: "q2",
    kind: "mcq",
    prompt: "Which two event types cover the vast majority of rows?",
    options: [
      { text: "created and deleted" },
      { text: "matched and updated", correct: true },
      { text: "login and logout" },
      { text: "error and retry" },
    ],
    explain:
      "matched links a destination account to the Clever user (early in the history); updated pushes a change to an already-linked account. Other types exist but are rare.",
  },
  {
    id: "q3",
    kind: "mcq",
    scenario: true,
    prompt:
      "Scenario: an account is sitting in the *Restricted OU. What’s the most likely cause, and what do you check first?",
    options: [
      { text: "Clever has a bug — escalate to engineering right away." },
      {
        text: "The incoming building code didn’t match any rule in config_string — check the code on the user’s record against the rules.",
        correct: true,
      },
      { text: "The destination is down — check Google’s status page." },
      { text: "The password failed to sync — re-push the password." },
    ],
    explain:
      "*Restricted is the catch-all the template falls through to when no if-equals rule matches. It almost always means the source data didn’t match a mapping rule, not that Clever broke.",
  },
  {
    id: "q4",
    kind: "mcq",
    scenario: true,
    prompt:
      "Scenario: a customer says “Clever moved the teacher in Google, but Active Directory still shows the old org-unit.” What should you keep in mind while reading the export?",
    options: [
      {
        text: "Google and AD are separate sync targets — verify each destination’s own events; a change in one doesn’t imply the other.",
        correct: true,
      },
      { text: "The export only covers Google, so AD isn’t included." },
      {
        text: "Timestamps are local time, so the AD change just hasn’t happened yet.",
      },
      { text: "needs_destination_update only applies to AD." },
    ],
    explain:
      "Each destination is its own independent timeline. Split the export by destination and read AD’s rows on their own — don’t assume the two systems are in lockstep.",
  },
  {
    id: "q5",
    kind: "self",
    prompt:
      "In your own words, outline the 5-step method for tracing a problem in an export.",
    model: [
      "Sort oldest-first so you read the story forward.",
      "Split by destination — read Google and AD as two parallel timelines.",
      "Find the matched events to see when each account was linked.",
      "For each updated event, compare org_unit to reverse_data.previous_org_unit (and the same for groups / custom fields).",
      "When something’s wrong, read the config_string — most placement and naming behavior comes from that template.",
    ],
  },
];

export const QUIZ_TOTAL = QUIZ.length;
