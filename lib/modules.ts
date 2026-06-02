export interface ModuleMeta {
  slug: string;
  order: number;
  title: string;
  objective: string;
  minutes: number;
  blurb: string;
}

export const MODULES: ModuleMeta[] = [
  {
    slug: "what-is-an-export",
    order: 1,
    title: "What an events export is",
    objective:
      "Explain what an events export shows and when a CS agent should pull one.",
    minutes: 4,
    blurb:
      "One user, one action per row. The receipt of everything Clever did to an account.",
  },
  {
    slug: "the-columns",
    order: 2,
    title: "The seven columns",
    objective: "Identify all seven columns and where the real detail lives.",
    minutes: 4,
    blurb: "Six columns set the scene; the Data column holds the story.",
  },
  {
    slug: "reading-the-data",
    order: 3,
    title: "Reading the Data field",
    objective:
      "Navigate the Data JSON by category and apply the null ≠ deleted rule.",
    minutes: 7,
    blurb:
      "JSON without the fear: learn the field groups and the five fields that matter most.",
  },
  {
    slug: "tracing-a-problem",
    order: 4,
    title: "Tracing a problem",
    objective:
      "Use the 5-step method to reconstruct what happened to one account.",
    minutes: 8,
    blurb:
      "Follow Jordan Avery from SouthWest into *Restricted and back out to HighSchool.",
  },
  {
    slug: "gotchas-and-glossary",
    order: 5,
    title: "Gotchas & glossary",
    objective: "Recall the common traps and the vocabulary CS uses daily.",
    minutes: 5,
    blurb: "The mistakes that bite new agents — and the words to sound fluent.",
  },
];

export function moduleBySlug(slug: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function nextModule(slug: string): ModuleMeta | undefined {
  const m = moduleBySlug(slug);
  if (!m) return undefined;
  return MODULES.find((x) => x.order === m.order + 1);
}

export function prevModule(slug: string): ModuleMeta | undefined {
  const m = moduleBySlug(slug);
  if (!m) return undefined;
  return MODULES.find((x) => x.order === m.order - 1);
}

/** Stable IDs for everything a learner can "complete" (modules + quiz). */
export const ALL_STEP_IDS: string[] = [
  ...MODULES.map((m) => `module:${m.slug}`),
  "quiz",
];
