import type { SessionState } from "./about-types";

const KEY = "pkw:about:v1";

export function emptySession(): SessionState {
  return {
    seenIntentIds: new Set(),
    servedReplyKeys: new Set(),
    servedFallbackIndices: new Set(),
    moodHistory: [],
  };
}

export function loadSession(): SessionState {
  if (typeof window === "undefined") return emptySession();
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return emptySession();
    const parsed = JSON.parse(raw) as {
      seenIntentIds: string[];
      servedReplyKeys: string[];
      servedFallbackIndices: number[];
      moodHistory: SessionState["moodHistory"];
    };
    return {
      seenIntentIds: new Set(parsed.seenIntentIds ?? []),
      servedReplyKeys: new Set(parsed.servedReplyKeys ?? []),
      servedFallbackIndices: new Set(parsed.servedFallbackIndices ?? []),
      moodHistory: parsed.moodHistory ?? [],
    };
  } catch {
    return emptySession();
  }
}

export function saveSession(s: SessionState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({
        seenIntentIds: [...s.seenIntentIds],
        servedReplyKeys: [...s.servedReplyKeys],
        servedFallbackIndices: [...s.servedFallbackIndices],
        moodHistory: s.moodHistory.slice(-5),
      })
    );
  } catch {
    /* quota or disabled storage — no-op */
  }
}
