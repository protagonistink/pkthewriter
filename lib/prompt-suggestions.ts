import Fuse from "fuse.js";

export type PromptSuggestion = {
  id: string;
  label: string;
  query: string;
  aliases: string[];
  note?: string;
};

export const FIRST_RUN_PROMPTS = [
  "/ surprise me",
  "/ show me b2b",
  "/ best ad",
] as const;

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    id: "surprise",
    label: "/ surprise me",
    query: "/ surprise me",
    aliases: ["surprise", "random", "start", "anything"],
    note: "Start somewhere good.",
  },
  {
    id: "best-ad",
    label: "/ best ad",
    query: "/ best ad",
    aliases: ["best", "favorite", "strongest", "campaign", "ad"],
    note: "A fast proof point.",
  },
  {
    id: "b2b",
    label: "/ show me b2b",
    query: "/ show me b2b",
    aliases: ["b2b", "business", "enterprise", "saas", "airtable"],
    note: "Work for grown-up products.",
  },
  {
    id: "tech",
    label: "/ tech campaigns",
    query: "/ tech campaigns",
    aliases: ["tech", "technology", "verizon", "google", "airtable", "software"],
    note: "Systems, services, software.",
  },
  {
    id: "brand-voice",
    label: "/ brand voice",
    query: "/ brand voice",
    aliases: ["voice", "positioning", "strategy", "narrative", "brand"],
    note: "The language under the campaign.",
  },
  {
    id: "apple",
    label: "Apple",
    query: "Apple",
    aliases: ["app", "apple", "iphone", "mac"],
    note: "The useful bio route.",
  },
  {
    id: "airtable",
    label: "Airtable",
    query: "Airtable",
    aliases: ["air", "airtable", "saas", "b2b"],
    note: "National launch work.",
  },
  {
    id: "chevron",
    label: "Chevron",
    query: "Chevron",
    aliases: ["chev", "chevron", "energy", "brand system"],
    note: "Strategy-first brand work.",
  },
  {
    id: "att",
    label: "AT&T",
    query: "AT&T",
    aliases: ["att", "at&t", "lily", "holiday"],
    note: "Digital activation.",
  },
  {
    id: "mpa",
    label: "MPA",
    query: "MPA",
    aliases: ["mpa", "motion picture", "movies", "cinema"],
    note: "Industry body, human voice.",
  },
  {
    id: "warner",
    label: "Warner Bros.",
    query: "Warner Bros.",
    aliases: ["warner", "warner bros", "steve jobs", "film"],
    note: "Awards-season restraint.",
  },
  {
    id: "writing",
    label: "/ writing",
    query: "/ writing",
    aliases: ["writing", "essay", "essays", "clips", "story"],
    note: "Published pieces.",
  },
  {
    id: "screenwriting",
    label: "/ screenwriting",
    query: "/ screenwriting",
    aliases: ["screen", "screenplay", "screenwriting", "script", "pilot"],
    note: "Yes, really.",
  },
  {
    id: "resume",
    label: "/ resume",
    query: "/ resume",
    aliases: ["resume", "résumé", "cv", "experience"],
    note: "One-page version.",
  },
];

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.38,
  distance: 80,
  minMatchCharLength: 2,
  ignoreLocation: true,
  keys: [
    { name: "label", weight: 0.55 },
    { name: "query", weight: 0.35 },
    { name: "aliases", weight: 0.75 },
  ],
};

const fuse = new Fuse(PROMPT_SUGGESTIONS, FUSE_OPTIONS);

export function promptSuggestions(input: string, limit = 3): PromptSuggestion[] {
  const q = input.trim().replace(/^\/\s*/, "");
  if (!q) return PROMPT_SUGGESTIONS.filter((item) => FIRST_RUN_PROMPTS.includes(item.query as (typeof FIRST_RUN_PROMPTS)[number]));

  const exactPrefix = PROMPT_SUGGESTIONS.filter((item) =>
    [item.label, item.query, ...item.aliases].some((candidate) =>
      candidate.toLowerCase().replace(/^\/\s*/, "").startsWith(q.toLowerCase())
    )
  );

  const fuzzy = fuse
    .search(q)
    .filter((hit) => typeof hit.score !== "number" || hit.score <= 0.38)
    .map((hit) => hit.item);

  return uniqueById([...exactPrefix, ...fuzzy]).slice(0, limit);
}

export function promptGhostCompletion(input: string): string | null {
  const raw = input;
  const q = raw.trimStart();
  if (q.length < 2) return null;

  const lower = q.toLowerCase();
  const match = promptSuggestions(q, 1)[0];
  if (!match) return null;

  const candidates = [match.query, match.label, ...match.aliases].filter((candidate) =>
    candidate.toLowerCase().startsWith(lower)
  );
  const completion = candidates.sort((a, b) => a.length - b.length)[0] ?? match.query;
  if (completion.toLowerCase() === lower) return null;
  if (!completion.toLowerCase().startsWith(lower)) return null;
  return completion;
}

function uniqueById(items: PromptSuggestion[]): PromptSuggestion[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
