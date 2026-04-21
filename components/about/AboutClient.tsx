"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { AboutThread } from "./AboutThread";
import openingData from "@/data/about-opening.json";
import type { Exchange } from "@/lib/about-types";

const PAGE_BG: CSSProperties = {
  background:
    "linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper) 55%, #d9d1be 85%, #b8aa91 100%)",
  minHeight: "auto",
};

const OPENING: Exchange[] = openingData.exchanges as Exchange[];

export function AboutClient() {
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
    <section
      style={PAGE_BG}
      className="relative text-[var(--color-ink)] pt-[6vh] pb-[24vh] px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[720px] mx-auto">
        <AboutThread
          exchanges={visibleExchanges}
          typingMap={typingMap}
          instant={instant}
        />
      </div>
    </section>
  );
}
