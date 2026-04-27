/**
 * Intent router for the landing chat bar.
 *
 * Pure function. No side effects. No API calls. No LLM.
 * Keyword matching against a small map, with sensible lead/clarify fallback
 * when nothing matches.
 *
 * v0.4: brand keywords reconciled with Sanity's real catalog (8 brands),
 * new `contact-card` intent for say-hi / contact flows, random-pool picks
 * for `best ad` / `surprise me` / `what's your favorite`. Accepts an
 * optional `random()` so tests can pin deterministic picks.
 */

import { ALL_BRANDS, BEST_AD_POOL, FAVORITE_POOL, type FeatureKey } from "./feature-static";

export type Intent =
  | { kind: "navigate"; to: string; label: string }
  | { kind: "feature"; key: FeatureKey }
  | { kind: "card"; id: "pi" }
  | { kind: "contact-card"; variant: "hi" | "contact" }
  | { kind: "lead" }
  | { kind: "clarify" };

type RandFn = () => number;

function pick<T>(pool: readonly T[], rand: RandFn): T {
  const i = Math.floor(rand() * pool.length);
  return pool[Math.min(i, pool.length - 1)];
}

type Rule = {
  pattern: RegExp;
  intent: Intent | ((rand: RandFn) => Intent);
};

const RULES: Rule[] = [
  // PI card — check first so it doesn't fall through.
  { pattern: /(protagonist\s+ink|\bprotagonist\b|\bpi\b)/i, intent: { kind: "card", id: "pi" } },

  // Contact-card intents — before feature matches so "contact" doesn't nav.
  { pattern: /\b(contact\s+me|get\s+in\s+touch|contact)\b/i, intent: { kind: "contact-card", variant: "contact" } },
  { pattern: /\b(say\s+hi|hi|hello|hey)\b/i, intent: { kind: "contact-card", variant: "hi" } },

  // Random pools.
  { pattern: /\bsurprise\s+me\b/i, intent: (r) => ({ kind: "feature", key: pick(ALL_BRANDS, r) }) },
  { pattern: /(what'?s\s+your\s+favou?rite|\bfavou?rite\b)/i, intent: (r) => ({ kind: "feature", key: pick(FAVORITE_POOL, r) }) },
  { pattern: /\bbest\s+(ad|work|campaign|spot|project)\b/i, intent: (r) => ({ kind: "feature", key: pick(BEST_AD_POOL, r) }) },

  // Resume (before screenwriting so "cv" matches here).
  { pattern: /\b(resume|résumé|cv)\b/i, intent: { kind: "feature", key: "resume" } },

  // Screenwriting.
  { pattern: /\b(screenplay|screenplays|script|scripts|screenwriting|screenwriter|screenwriters|pilot|pilots)\b/i, intent: { kind: "feature", key: "screenwriting" } },

  // Category shortcuts surfaced by the prompt UI.
  { pattern: /\b(b2b|saas|enterprise)\b/i, intent: { kind: "feature", key: "airtable" } },
  { pattern: /\b(tech|technology|software)\s+(campaign|campaigns|work)?\b/i, intent: { kind: "feature", key: "techsure" } },
  { pattern: /\b(brand\s+voice|voice|positioning|narrative\s+strategy)\b/i, intent: { kind: "feature", key: "chevron" } },

  // Brand keywords. Order matters — more specific first.
  { pattern: /\b(techsure|your\s+tech\s+should\s+work)\b/i, intent: { kind: "feature", key: "techsure" } },
  { pattern: /\b(verizon\s+up|biggest\s+little\s+monsters|verizon)\b/i, intent: { kind: "feature", key: "verizon-up" } },
  { pattern: /\bairtable\b/i, intent: { kind: "feature", key: "airtable" } },
  { pattern: /\bchevron\b/i, intent: { kind: "feature", key: "chevron" } },
  { pattern: /\b(warner(\s*brothers|\s*bros)?|steve\s+jobs)\b/i, intent: { kind: "feature", key: "warnerbros" } },
  { pattern: /(at\s*&\s*t|\batt\b|lily|gift\s+decider)/i, intent: { kind: "feature", key: "att" } },
  { pattern: /\b(mpa|motion\s+picture\s+association|what\s+comes\s+next)\b/i, intent: { kind: "feature", key: "mpa" } },
  { pattern: /\b(bp|team\s+usa)\b/i, intent: { kind: "feature", key: "bp" } },

  // Writing.
  { pattern: /\b(writing|essay|essays|clip|clips|story|stories|column|columns|short|read\s+something)\b/i, intent: { kind: "feature", key: "writing" } },

  // Rates / availability — hire-readiness questions, before the work grid.
  { pattern: /\b(rates?|day\s+rate|pricing|how\s+much|what\s+do\s+you\s+charge|cost)\b/i, intent: { kind: "feature", key: "rates" } },
  { pattern: /\b(available|availability|booking|can\s+you\s+start|when\s+can\s+you|are\s+you\s+free|taking\s+on\s+work|freelance\s+work)\b/i, intent: { kind: "feature", key: "availability" } },

  // Work grid (broader than brand keywords; last).
  { pattern: /(\bwork\b|case\s+stud(y|ies)|\bportfolio\b|\bads\b|\bcampaigns\b|brand\s+work)/i, intent: { kind: "navigate", to: "/work", label: "case studies" } },

  // About: start conversationally on the homepage; the UI hands off to
  // /about after the short answer path is exhausted.
  { pattern: /(tell\s+me\s+about\s+(you|patrick|yourself)|about\s+(you|patrick|yourself)|who\s+are\s+you|\bbio\b|meet\s+(you|patrick)|\bapple\b)/i, intent: { kind: "feature", key: "about" } },
];

const SOLO_NAV: Record<string, Intent> = {
  about: { kind: "feature", key: "about" },
  bio: { kind: "feature", key: "about" },
  work: { kind: "navigate", to: "/work", label: "case studies" },
  portfolio: { kind: "navigate", to: "/work", label: "case studies" },
  rates: { kind: "feature", key: "rates" },
  availability: { kind: "feature", key: "availability" },
};

export function routeIntent(input: string, rand: RandFn = Math.random): Intent {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return { kind: "clarify" };

  const solo = trimmed.replace(/[.!?]+$/, "").toLowerCase();
  if (SOLO_NAV[solo]) return SOLO_NAV[solo];

  for (const { pattern, intent } of RULES) {
    if (pattern.test(trimmed)) return typeof intent === "function" ? intent(rand) : intent;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const hasAlpha = /[a-z]/i.test(trimmed);
  const hasQuestion = trimmed.includes("?");

  if (!hasAlpha) return { kind: "clarify" };
  if (words.length >= 3) return { kind: "lead" };
  if (trimmed.length >= 20) return { kind: "lead" };
  if (hasQuestion && trimmed.length >= 8) return { kind: "lead" };

  return { kind: "clarify" };
}
