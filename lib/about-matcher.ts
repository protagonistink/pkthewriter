import Fuse from "fuse.js";
import type { Intent, Reply, SessionState, Mood } from "./about-types";

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.4,
  distance: 200,
  minMatchCharLength: 3,
  ignoreLocation: true,
  keys: ["trigger"],
};

type FuseRecord = { trigger: string; intentId: string };

export type MatcherDeps = {
  intents: Intent[];
  fallbacks: string[];
};

export type Matcher = {
  match(query: string): Intent | null;
  pickReply(
    intent: Intent,
    session: SessionState,
    input: string
  ): { reply: Reply; variantIndex: number };
  pickFallback(session: SessionState): { text: string; index: number };
  detectMood(input: string): Mood;
  /** Returns the canonical (first) trigger matching the prefix — for ghost-text completion. */
  ghostComplete(partial: string): string | null;
};

export function createMatcher({ intents, fallbacks }: MatcherDeps): Matcher {
  const records: FuseRecord[] = intents.flatMap((i) =>
    i.triggers.map((trigger) => ({ trigger, intentId: i.id }))
  );
  const fuse = new Fuse(records, FUSE_OPTIONS);
  const intentsById = new Map(intents.map((i) => [i.id, i]));

  function detectMood(input: string): Mood {
    const t = input.trim();
    if (!t) return "default";
    const letters = t.replace(/[^A-Za-z]/g, "");
    const allCaps = letters.length >= 4 && letters === letters.toUpperCase();
    const excl = (t.match(/!/g) ?? []).length >= 1;
    if (allCaps || excl) return "playful";
    if (
      t.length >= 60 &&
      /[.?]/.test(t) &&
      !/\b(yo|hey|lol|wanna)\b/i.test(t)
    )
      return "formal";
    return "default";
  }

  function match(query: string): Intent | null {
    const q = query.trim();
    if (!q) return null;
    const hits = fuse.search(q);
    if (hits.length === 0) return null;
    const best = hits[0];
    if (typeof best.score === "number" && best.score > 0.4) return null;
    return intentsById.get(best.item.intentId) ?? null;
  }

  function pickReply(
    intent: Intent,
    session: SessionState,
    input: string
  ): { reply: Reply; variantIndex: number } {
    const mood = detectMood(input);
    const withIndex = intent.replies.map((r, i) => ({ r, i }));

    const unseen = withIndex.filter(
      ({ i }) => !session.servedReplyKeys.has(`${intent.id}:${i}`)
    );
    const moodMatchUnseen = unseen.filter(
      ({ r }) => (r.mood ?? "default") === mood
    );
    const pool =
      moodMatchUnseen.length > 0
        ? moodMatchUnseen
        : unseen.length > 0
          ? unseen
          : withIndex;
    const chosen = pool[0];
    return { reply: chosen.r, variantIndex: chosen.i };
  }

  function pickFallback(session: SessionState): { text: string; index: number } {
    const all = fallbacks.map((text, index) => ({ text, index }));
    const unseen = all.filter(
      (f) => !session.servedFallbackIndices.has(f.index)
    );
    const pool = unseen.length > 0 ? unseen : all;
    return pool[0];
  }

  function ghostComplete(partial: string): string | null {
    const p = partial.trim().toLowerCase();
    if (p.length < 2) return null;
    for (const intent of intents) {
      for (const trigger of intent.triggers) {
        if (
          trigger.toLowerCase().startsWith(p) &&
          trigger.toLowerCase() !== p
        ) {
          return trigger;
        }
      }
    }
    const hits = fuse.search(partial);
    if (
      hits.length > 0 &&
      typeof hits[0].score === "number" &&
      hits[0].score <= 0.2
    ) {
      return hits[0].item.trigger;
    }
    return null;
  }

  return { match, pickReply, pickFallback, detectMood, ghostComplete };
}
