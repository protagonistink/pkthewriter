"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AboutThread } from "./AboutThread";
import { AboutInput } from "./AboutInput";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { createMatcher } from "@/lib/about-matcher";
import openingData from "@/data/about-opening.json";
import intentsData from "@/data/about-intents.json";
import fallbacksData from "@/data/about-fallbacks.json";
import type { Exchange } from "@/lib/about-types";

const OPENING: Exchange[] = openingData.exchanges as Exchange[];

// Canonical triggers (first trigger per intent) for placeholder cycling
const PLACEHOLDERS = intentsData.intents
  .filter((i) => i.id !== "nice-try")
  .map((i) => i.triggers[0])
  .filter(Boolean);

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
  // Exchange 0 is the prefilled visitor line — shown statically.
  // Start with 2 so exchange 1 (first Patrick reply) begins typing immediately.
  const [visibleCount, setVisibleCount] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fastForward, setFastForward] = useState(false);

  const instant = !!(fastForward || prefersReduced);

  // Fast-forward on first click or keydown while still playing
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

  // Reduced-motion: skip all typing from mount
  useEffect(() => {
    if (prefersReduced) {
      setFastForward(true);
      setVisibleCount(OPENING.length);
      setIsPlaying(false);
    }
  }, [prefersReduced]);

  // Called when a bubble finishes typing — advance to the next exchange
  const onBubbleDone = useCallback(
    (index: number) => {
      const next = index + 1;
      if (next < OPENING.length) {
        setVisibleCount(next + 1);
      } else {
        setIsPlaying(false);
      }
    },
    []
  );

  const visibleExchanges = OPENING.slice(0, visibleCount);

  // Build typing map: only the last visible exchange gets a typer
  const typingMap =
    isPlaying && !instant
      ? {
          [visibleCount - 1]: {
            speed:
              OPENING[visibleCount - 1]?.role === "visitor" ? 40 : 25,
            onDone: () => onBubbleDone(visibleCount - 1),
          },
        }
      : undefined;

  return (
    <>
      <section className="relative text-[var(--color-ink)] pt-[6vh] pb-[24vh] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[720px] mx-auto">
          <AboutThread
            exchanges={visibleExchanges}
            typingMap={typingMap}
            instant={instant}
          />
          <AboutInput
            placeholders={PLACEHOLDERS}
            onSubmit={() => {}}
            ghostComplete={matcher.ghostComplete}
            disabled={isPlaying}
          />
        </div>
      </section>
      <CaseStudyAsk />
    </>
  );
}
