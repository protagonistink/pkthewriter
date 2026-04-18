/**
 * Intent router for the landing chat bar.
 *
 * Pure function. No side effects. No API calls. No LLM.
 * Keyword matching against a small map, with sensible lead/clarify fallback
 * when nothing matches.
 *
 * Match order matters — first hit wins. More specific keywords come before
 * broader ones (e.g. `verizon` before `work`, `resume` before `about`).
 *
 * v0.3: adds a `feature` intent — resolves certain keywords to an in-place
 * feature card on the landing page instead of navigating. Navigation is
 * still available via the rail.
 */

import type { FeatureKey } from "./feature-static";

export type Intent =
  | { kind: "navigate"; to: string; label: string }
  | { kind: "feature"; key: FeatureKey }
  | { kind: "card"; id: "pi" }
  | { kind: "lead" }
  | { kind: "clarify" };

type Rule = {
  pattern: RegExp;
  intent: Intent;
};

const RULES: Rule[] = [
  // PI card — check first so it doesn't fall through to lead.
  {
    pattern: /(protagonist\s+ink|\bprotagonist\b|\bpi\b)/i,
    intent: { kind: "card", id: "pi" },
  },

  // Resume — in-place feature card; CTA opens /about#resume.
  {
    pattern: /\b(resume|résumé|cv)\b/i,
    intent: { kind: "feature", key: "resume" },
  },

  // Screenwriting — in-place feature card.
  {
    pattern: /\b(screenplay|screenplays|script|scripts|screenwriting|screenwriter|screenwriters|pilot|pilots)\b/i,
    intent: { kind: "feature", key: "screenwriting" },
  },

  // Specific brands — in-place feature cards.
  {
    pattern: /\bverizon\b/i,
    intent: { kind: "feature", key: "verizon" },
  },
  {
    pattern: /\bapple\b/i,
    intent: { kind: "feature", key: "apple" },
  },
  {
    pattern: /\b(mercedes|benz)\b/i,
    intent: { kind: "feature", key: "mercedes" },
  },

  // "Best ad" default → Verizon feature.
  {
    pattern: /\bbest\s+(ad|work|campaign|spot|project)\b/i,
    intent: { kind: "feature", key: "verizon" },
  },

  // Writing (clips, essays, stories) — in-place feature card.
  {
    pattern: /\b(writing|essay|essays|clip|clips|story|stories|column|columns|short|read\s+something)\b/i,
    intent: { kind: "feature", key: "writing" },
  },

  // Work grid — route to /work (the "old-way" indexed list).
  {
    pattern: /(\bwork\b|case\s+stud(y|ies)|\bportfolio\b|\bad\b|\bads\b|\bcampaign\b|\bcampaigns\b|brand\s+work)/i,
    intent: { kind: "navigate", to: "/work", label: "case studies" },
  },

  // About — only match specific phrases. Solo "about" is handled by SOLO_NAV.
  {
    pattern: /(about\s+(you|patrick|yourself)|who\s+are\s+you|\bbio\b|meet\s+(you|patrick))/i,
    intent: { kind: "navigate", to: "/about", label: "about" },
  },
];

// Exact single-word navigation — the whole message is just this word (± punctuation).
const SOLO_NAV: Record<string, Intent> = {
  about: { kind: "navigate", to: "/about", label: "about" },
  bio: { kind: "navigate", to: "/about", label: "about" },
  work: { kind: "navigate", to: "/work", label: "case studies" },
  portfolio: { kind: "navigate", to: "/work", label: "case studies" },
};

export function routeIntent(input: string): Intent {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return { kind: "clarify" };

  // Solo-word nav: the entire message is one token from SOLO_NAV.
  const solo = trimmed.replace(/[.!?]+$/, "").toLowerCase();
  if (SOLO_NAV[solo]) return SOLO_NAV[solo];

  for (const { pattern, intent } of RULES) {
    if (pattern.test(trimmed)) return intent;
  }

  // No keyword matched — decide lead vs. clarify based on message shape.
  const words = trimmed.split(/\s+/).filter(Boolean);
  const hasAlpha = /[a-z]/i.test(trimmed);
  const hasQuestion = trimmed.includes("?");

  if (!hasAlpha) return { kind: "clarify" };

  if (words.length >= 3) return { kind: "lead" };
  if (trimmed.length >= 20) return { kind: "lead" };
  if (hasQuestion && trimmed.length >= 8) return { kind: "lead" };

  return { kind: "clarify" };
}
