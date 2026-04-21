"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AboutThread } from "./AboutThread";
import { AboutInput, type AboutInputHandle } from "./AboutInput";
import { AboutChips } from "./AboutChips";
import { AboutPageView } from "./AboutPageView";
import { AboutEscape } from "./AboutEscape";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { createMatcher } from "@/lib/about-matcher";
import { loadSession, saveSession, emptySession } from "@/lib/about-session";
import { detectInjection } from "@/lib/about-injection";
import openingData from "@/data/about-opening.json";
import intentsData from "@/data/about-intents.json";
import fallbacksData from "@/data/about-fallbacks.json";
import type { Exchange, Intent, ReadMode, SessionState } from "@/lib/about-types";

const OPENING: Exchange[] = openingData.exchanges as Exchange[];

const PLACEHOLDERS = intentsData.intents
  .filter((i) => i.id !== "nice-try")
  .map((i) => i.triggers[0])
  .filter(Boolean);

const INTENTS_BY_ID = new Map<string, (typeof intentsData.intents)[number]>(
  intentsData.intents.map((i) => [i.id, i])
);

type ChipItem = { id: string; label: string };

function computeChips(intent: { followups?: string[] }): ChipItem[] {
  return (intent.followups ?? [])
    .map((fid) => {
      const fi = INTENTS_BY_ID.get(fid);
      return fi ? { id: fid, label: fi.triggers[0] ?? fid } : null;
    })
    .filter((c): c is ChipItem => c !== null);
}

export function AboutClient() {
  const matcher = useMemo(
    () =>
      createMatcher({
        intents: intentsData.intents as Parameters<typeof createMatcher>[0]["intents"],
        fallbacks: fallbacksData.fallbacks.map((f) => f.text),
      }),
    []
  );
  const prefersReduced = useReducedMotion();
  const inputRef = useRef<AboutInputHandle>(null);

  // ── Opening thread ────────────────────────────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fastForward, setFastForward] = useState(false);
  const instant = !!(fastForward || prefersReduced);

  const handleFastForward = useCallback(() => {
    if (!isPlaying) return;
    setFastForward(true);
    setVisibleCount(OPENING.length);
    setIsPlaying(false);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const onInteract = () => handleFastForward();
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });
    return () => {
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, [isPlaying, handleFastForward]);

  useEffect(() => {
    if (prefersReduced) {
      setFastForward(true);
      setVisibleCount(OPENING.length);
      setIsPlaying(false);
    }
  }, [prefersReduced]);

  const onBubbleDone = useCallback((index: number) => {
    const next = index + 1;
    if (next < OPENING.length) {
      setVisibleCount(next + 1);
    } else {
      setIsPlaying(false);
    }
  }, []);

  // ── Read mode ─────────────────────────────────────────────────────────────
  const [readMode, setReadMode] = useState<ReadMode>("chat");

  // ── Branch state ──────────────────────────────────────────────────────────
  const [branchExchanges, setBranchExchanges] = useState<Exchange[]>([]);
  const [branchTypingIndex, setBranchTypingIndex] = useState<number | null>(null);
  const [activeChips, setActiveChips] = useState<ChipItem[]>([]);
  const [session, setSession] = useState<SessionState>(() =>
    typeof window === "undefined" ? emptySession() : loadSession()
  );

  // Refs for stale-closure-safe access inside callbacks
  const branchLengthRef = useRef(0);
  branchLengthRef.current = branchExchanges.length;
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const pendingChipsRef = useRef<ChipItem[]>([]);

  const onBranchTypingDone = useCallback(() => {
    setBranchTypingIndex(null);
    setActiveChips(pendingChipsRef.current);
    pendingChipsRef.current = [];
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (raw: string) => {
      const query = raw.trim();
      if (!query) return;

      setActiveChips([]);
      setBranchTypingIndex(null);
      pendingChipsRef.current = [];

      const currentSession = sessionRef.current;
      const visitorTurn: Exchange = { role: "visitor", text: query };
      let patrickTurn: Exchange;

      if (detectInjection(query)) {
        const niceTry = INTENTS_BY_ID.get("nice-try");
        if (!niceTry) return;
        const { reply } = matcher.pickReply(niceTry as Intent, currentSession, query);
        patrickTurn = { role: "patrick", text: reply.text, intentId: "nice-try" };
      } else {
        const intent = matcher.match(query);
        if (intent) {
          const { reply, variantIndex } = matcher.pickReply(
            intent as Intent,
            currentSession,
            query
          );
          patrickTurn = { role: "patrick", text: reply.text, intentId: intent.id };
          pendingChipsRef.current = computeChips(intent);

          const updated: SessionState = {
            seenIntentIds: new Set([...currentSession.seenIntentIds, intent.id]),
            servedReplyKeys: new Set([
              ...currentSession.servedReplyKeys,
              `${intent.id}:${variantIndex}`,
            ]),
            servedFallbackIndices: currentSession.servedFallbackIndices,
            moodHistory: [
              ...currentSession.moodHistory,
              matcher.detectMood(query),
            ].slice(-5),
          };
          setSession(updated);
          saveSession(updated);
        } else {
          const { text, index } = matcher.pickFallback(currentSession);
          patrickTurn = { role: "patrick", text };

          const updated: SessionState = {
            ...currentSession,
            servedFallbackIndices: new Set([
              ...currentSession.servedFallbackIndices,
              index,
            ]),
          };
          setSession(updated);
          saveSession(updated);
        }
      }

      // Patrick is at branchLength + 1 (visitor at +0, Patrick at +1)
      const patrickBranchIndex = branchLengthRef.current + 1;
      setBranchTypingIndex(patrickBranchIndex);
      setBranchExchanges((prev) => [...prev, visitorTurn, patrickTurn]);
    },
    [matcher] // session/branchExchanges accessed via refs
  );

  // ── Assemble thread ───────────────────────────────────────────────────────
  const openingExchanges = OPENING.slice(0, visibleCount);
  const allExchanges: Exchange[] = [...openingExchanges, ...branchExchanges];

  const openingTypingMap =
    isPlaying && !instant
      ? {
          [visibleCount - 1]: {
            speed: OPENING[visibleCount - 1]?.role === "visitor" ? 40 : 25,
            onDone: () => onBubbleDone(visibleCount - 1),
          },
        }
      : undefined;

  const branchTypingMap =
    !isPlaying && branchTypingIndex !== null
      ? {
          [openingExchanges.length + branchTypingIndex]: {
            speed: 25,
            onDone: onBranchTypingDone,
          },
        }
      : undefined;

  const typingMap = openingTypingMap ?? branchTypingMap;

  const links = intentsData.links;

  return (
    <>
      {/* Read / chat toggle — pinned top-right */}
      <button
        type="button"
        aria-pressed={readMode === "page"}
        onClick={() => setReadMode((m) => (m === "chat" ? "page" : "chat"))}
        className="
          fixed top-[64px] right-[24px] z-[50]
          font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em]
          px-[12px] py-[6px]
          border border-[var(--color-paper-line)]
          text-[var(--color-ink-soft)]
          bg-[var(--color-paper)]
          rounded-[3px]
          hover:text-[var(--color-ink)] hover:border-[var(--color-ink-soft)]
          transition-colors
        "
      >
        {readMode === "chat" ? "read as a page" : "read as a chat"}
      </button>

      {readMode === "page" ? (
        <AboutPageView exchanges={allExchanges} links={links} />
      ) : (
        <section className="relative text-[var(--color-ink)] pt-[6vh] pb-[24vh] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[720px] mx-auto">
            <AboutThread
              exchanges={allExchanges}
              typingMap={typingMap}
              instant={instant}
            />
            <AboutChips chips={activeChips} onSelect={handleSubmit} />
            <AboutInput
              ref={inputRef}
              placeholders={PLACEHOLDERS}
              onSubmit={handleSubmit}
              ghostComplete={matcher.ghostComplete}
              disabled={isPlaying}
            />
          </div>
        </section>
      )}
      {readMode === "chat" && <AboutEscape email={links.email} />}
      <CaseStudyAsk />
    </>
  );
}
