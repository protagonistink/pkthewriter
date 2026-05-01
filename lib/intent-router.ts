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
  | { kind: "wopr"; bucket: "A" | "B" | "C"; skipBoot?: boolean }
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

  // PDF → resume.
  { pattern: /\bpdf\b/i, intent: { kind: "feature", key: "resume" } },

  // LinkedIn → contact card.
  { pattern: /\blinkedin\b/i, intent: { kind: "contact-card", variant: "contact" } },

  // Credibility questions → about.
  { pattern: /\b(any\s+good|are\s+you\s+good|legit|credential)/i, intent: { kind: "feature", key: "about" } },

  // Service capability questions → about.
  { pattern: /\bnaming\b/i, intent: { kind: "feature", key: "about" } },
  { pattern: /\bghost.?writ/i, intent: { kind: "feature", key: "about" } },
  { pattern: /\b(led\s+a?\s*pitch|have\s+you\s+led|pitching)\b/i, intent: { kind: "feature", key: "about" } },

  // Logistics questions → rates.
  { pattern: /\bdecks?\b/i, intent: { kind: "feature", key: "rates" } },
  { pattern: /\bndas?\b/i, intent: { kind: "feature", key: "rates" } },
  { pattern: /\bturnaround\b/i, intent: { kind: "feature", key: "rates" } },

  // Remote → availability (must come before work-grid rule which matches \bwork\b).
  { pattern: /\bremote\b/i, intent: { kind: "feature", key: "availability" } },

  // DTC → work grid.
  { pattern: /\b(dtc|direct.to.consumer)\b/i, intent: { kind: "navigate", to: "/work", label: "case studies" } },

  // Work grid (broader than brand keywords; last).
  { pattern: /(\bwork\b|case\s+stud(y|ies)|\bportfolio\b|\bads\b|\bcampaigns\b|brand\s+work)/i, intent: { kind: "navigate", to: "/work", label: "case studies" } },

  // About: start conversationally on the homepage; the UI hands off to
  // /about after the short answer path is exhausted.
  { pattern: /(tell\s+me\s+about\s+(you|patrick|yourself)|about\s+(you|patrick|yourself)|who\s+are\s+you|\bbio\b|meet\s+(you|patrick)|\bapple\b)/i, intent: { kind: "feature", key: "about" } },
];

// WOPR easter egg matchers. Three buckets:
// - A-prime fires above Bucket A and skips the boot sequence (lore reward).
// - A fires immediately on intentional game-request phrasing.
// - C fires immediately on imperative-AI-probing phrasing (narrowed to avoid
//   catching creative briefs that quote the same words).
// - B (defined separately as WOPR_BUCKET_B) is checked AFTER all other RULES,
//   just before the lead/clarify fallback, so professional queries (rates,
//   availability, etc.) always reach their intended feature first.
const WOPR_RULES: Rule[] = [
  // A-prime: lore reward — skip straight to the takeover.
  { pattern: /global\s+thermonuclear\s+war/i, intent: { kind: "wopr", bucket: "A", skipBoot: true } },
  // A: explicit game-request phrasing.
  { pattern: /\btic[\s-]?tac[\s-]?toe\b/i, intent: { kind: "wopr", bucket: "A" } },
  { pattern: /\bwargames?\b/i, intent: { kind: "wopr", bucket: "A" } },
  { pattern: /\b(?:want\s+to\s+|let'?s\s+|wanna\s+|shall\s+we\s+)play(?:\s+a\s+game)?\b/i, intent: { kind: "wopr", bucket: "A" } },
  { pattern: /\bplay\s+(?:a\s+game|chess)\b/i, intent: { kind: "wopr", bucket: "A" } },
  // Bare "chess" or "chess?" — Phase 6 callback. Anchored so it doesn't catch
  // a brief like "we want to write copy that sounds like a chess match".
  { pattern: /^\s*chess\s*\??\s*$/i, intent: { kind: "wopr", bucket: "A" } },
  // C: imperative-AI-probing. Narrow on purpose — must read as a directive
  // *to* an AI, not as quoted text about an AI.
  { pattern: /\bignore\s+(?:your\s+|the\s+|all\s+|previous\s+)*(?:previous\s+)?(?:instructions?|prompts?|rules?|directives?)\b/i, intent: { kind: "wopr", bucket: "C" } },
  { pattern: /\byou\s+are\s+now\s+\w+/i, intent: { kind: "wopr", bucket: "C" } },
  { pattern: /\brepeat\s+after\s+me\b/i, intent: { kind: "wopr", bucket: "C" } },
  { pattern: /\bsystem\s+prompt\b/i, intent: { kind: "wopr", bucket: "C" } },
  // B-but-checked-early: phrases that would otherwise collide with an existing
  // RULE (e.g. "hello darkness" is caught by the contact-card "hi" rule). Tag
  // as bucket B so the dispatcher applies the same 300ms ANALYZING beat.
  { pattern: /^\s*hello\s+darkness\b/i, intent: { kind: "wopr", bucket: "B" } },
];

// Bucket B: literal whitelist of obvious-silly phrases. Checked LAST, only
// after every other RULES match has failed, so professional queries always
// reach their intended feature first. Anchored phrases — no broad word matches.
const WOPR_BUCKET_B: RegExp[] = [
  /^\s*tell\s+me\s+a\s+joke\s*\??\s*$/i,
  /^\s*(?:please\s+)?sing(?:\s+(?:me\s+)?(?:a\s+)?song)?\s*\??\s*$/i,
  /^\s*do\s+you\s+love\s+me\s*\??\s*$/i,
  /^\s*what\s+is\s+love\s*\??\s*$/i,
  /^\s*poop\s*\??\s*$/i,
  /^\s*banana\s*\??\s*$/i,
  /^\s*are\s+you\s+(?:alive|sentient|real|conscious|human)\s*\??\s*$/i,
  /^\s*hello\s+darkness\b/i,
  /^\s*meaning\s+of\s+life\s*\??\s*$/i,
  /^\s*marco\s*\??\s*$/i,
];

function woprIsEnabled(): boolean {
  // Kill switch — set NEXT_PUBLIC_WOPR_ENABLED=false on Vercel to disable
  // without a code change. Default behavior (env unset or any other value)
  // is enabled.
  return process.env.NEXT_PUBLIC_WOPR_ENABLED !== "false";
}

const SOLO_NAV: Record<string, Intent> = {
  about: { kind: "feature", key: "about" },
  bio: { kind: "feature", key: "about" },
  work: { kind: "navigate", to: "/work", label: "case studies" },
  portfolio: { kind: "navigate", to: "/work", label: "case studies" },
  rates: { kind: "feature", key: "rates" },
  availability: { kind: "feature", key: "availability" },
  freelance: { kind: "feature", key: "availability" },
  linkedin: { kind: "contact-card", variant: "contact" },
  hi: { kind: "clarify" },
};

export function routeIntent(input: string, rand: RandFn = Math.random): Intent {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return { kind: "clarify" };

  const woprOn = woprIsEnabled();

  // WOPR Bucket A/A-prime/C — fire above SOLO_NAV and RULES so they don't get
  // shadowed by feature/nav matches. (Bucket B is checked at the bottom.)
  if (woprOn) {
    for (const { pattern, intent } of WOPR_RULES) {
      if (pattern.test(trimmed)) return intent as Intent;
    }
  }

  const solo = trimmed.replace(/[.!?]+$/, "").toLowerCase();
  if (SOLO_NAV[solo]) return SOLO_NAV[solo];

  for (const { pattern, intent } of RULES) {
    if (pattern.test(trimmed)) return typeof intent === "function" ? intent(rand) : intent;
  }

  // WOPR Bucket B — literal silly-phrase whitelist, checked AFTER every real
  // rule has failed so professional queries always reach their intended feature first.
  if (woprOn) {
    for (const pattern of WOPR_BUCKET_B) {
      if (pattern.test(trimmed)) return { kind: "wopr", bucket: "B" };
    }
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
