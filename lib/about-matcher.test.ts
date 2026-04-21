import { describe, it, expect } from "vitest";
import { createMatcher } from "./about-matcher";
import type { Intent, SessionState } from "./about-types";
import { emptySession } from "./about-session";

// Minimal fixture intents used across tests.
const INTENTS: Intent[] = [
  {
    id: "what-i-do",
    category: "essentials",
    triggers: ["what do you do", "what's your job", "are you a copywriter"],
    replies: [
      { mood: "default", text: "Default reply" },
      { mood: "playful", text: "Playful reply" },
    ],
    followups: ["years-experience"],
  },
  {
    id: "am-i-available",
    category: "essentials",
    triggers: [
      "are you available for work",
      "are you taking projects",
      "are you free for work",
    ],
    replies: [{ mood: "default", text: "Available reply" }],
    followups: [],
  },
  {
    id: "brands",
    category: "essentials",
    triggers: ["what brands have you worked on", "who are your clients"],
    replies: [{ mood: "default", text: "Brands reply" }],
    followups: [],
  },
];

const FALLBACKS = ["Fallback A", "Fallback B", "Fallback C"];

const matcher = createMatcher({ intents: INTENTS, fallbacks: FALLBACKS });

function sessionWith(keys: string[]): SessionState {
  return {
    ...emptySession(),
    servedReplyKeys: new Set(keys),
  };
}

function sessionWithFallbacks(indices: number[]): SessionState {
  return {
    ...emptySession(),
    servedFallbackIndices: new Set(indices),
  };
}

// ─── Match ───────────────────────────────────────────────────────────────────

describe("match", () => {
  it("exact match returns the correct intent", () => {
    const result = matcher.match("what do you do");
    expect(result?.id).toBe("what-i-do");
  });

  it("fuzzy match: typo ('what do yu do' → what-i-do)", () => {
    const result = matcher.match("what do yu do");
    expect(result?.id).toBe("what-i-do");
  });

  it("fuzzy match: paraphrase ('are you free for work' → am-i-available)", () => {
    const result = matcher.match("are you free for work");
    expect(result?.id).toBe("am-i-available");
  });

  it("no match above threshold returns null ('what's the weather')", () => {
    const result = matcher.match("what's the weather");
    expect(result).toBeNull();
  });

  it("empty input returns null", () => {
    expect(matcher.match("")).toBeNull();
  });

  it("whitespace-only input returns null", () => {
    expect(matcher.match("   ")).toBeNull();
  });
});

// ─── Mood detection ──────────────────────────────────────────────────────────

describe("detectMood", () => {
  it("ALL CAPS input (4+ letters) → playful", () => {
    expect(matcher.detectMood("WHAT DO YOU DO")).toBe("playful");
  });

  it("exclamation mark → playful", () => {
    expect(matcher.detectMood("what do you do!")).toBe("playful");
  });

  it("long formal sentence → formal", () => {
    const long =
      "I am reaching out because I would like to understand your availability and process for a potential engagement.";
    expect(matcher.detectMood(long)).toBe("formal");
  });

  it("short lowercase question → default", () => {
    expect(matcher.detectMood("what do you do")).toBe("default");
  });
});

// ─── Reply rotation ───────────────────────────────────────────────────────────

describe("pickReply rotation", () => {
  it("unseen variant preferred: session has variant 0 seen → returns variant 1", () => {
    const session = sessionWith(["what-i-do:0"]);
    const { variantIndex } = matcher.pickReply(
      INTENTS[0],
      session,
      "what do you do"
    );
    expect(variantIndex).toBe(1);
  });

  it("mood match wins over raw recency: ALL CAPS → playful variant (index 1) even when default (0) also unseen", () => {
    const session = emptySession();
    const { variantIndex } = matcher.pickReply(
      INTENTS[0],
      session,
      "WHAT DO YOU DO"
    );
    expect(variantIndex).toBe(1);
  });

  it("loops when all variants seen: still returns a variant", () => {
    const session = sessionWith(["what-i-do:0", "what-i-do:1"]);
    const { reply } = matcher.pickReply(
      INTENTS[0],
      session,
      "what do you do"
    );
    expect(reply).toBeDefined();
  });
});

// ─── Fallback rotation ────────────────────────────────────────────────────────

describe("pickFallback rotation", () => {
  it("first call returns index 0", () => {
    const { index } = matcher.pickFallback(emptySession());
    expect(index).toBe(0);
  });

  it("after index 0 seen → returns index 1", () => {
    const session = sessionWithFallbacks([0]);
    const { index } = matcher.pickFallback(session);
    expect(index).toBe(1);
  });

  it("all fallbacks seen → loops back to index 0", () => {
    const session = sessionWithFallbacks([0, 1, 2]);
    const { index } = matcher.pickFallback(session);
    expect(index).toBe(0);
  });
});

// ─── Ghost completion ─────────────────────────────────────────────────────────

describe("ghostComplete", () => {
  it("prefix hit: 'what do' → 'what do you do'", () => {
    expect(matcher.ghostComplete("what do")).toBe("what do you do");
  });

  it("too short (1 char) → null", () => {
    expect(matcher.ghostComplete("w")).toBeNull();
  });

  it("no match ('zzzz') → null", () => {
    expect(matcher.ghostComplete("zzzz")).toBeNull();
  });
});
