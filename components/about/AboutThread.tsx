"use client";

import type { Exchange } from "@/lib/about-types";
import { AboutBubble } from "./AboutBubble";

type TypingMap = {
  [index: number]: { speed: number; onDone?: () => void };
};

type Props = {
  exchanges: Exchange[];
  /** Map of exchange index → typing config. Absent = static render. */
  typingMap?: TypingMap;
  instant?: boolean;
};

export function AboutThread({ exchanges, typingMap, instant }: Props) {
  return (
    <div className="relative">
      {/* SR-only transcript: full content immediately on first render, before any typing. */}
      <ol className="sr-only" aria-label="Transcript">
        {exchanges.map((ex, i) => (
          <li key={i}>
            <span>{ex.role === "visitor" ? "Visitor" : "Patrick"}: </span>
            <span>{ex.text}</span>
          </li>
        ))}
      </ol>

      {/* Visual thread */}
      <ol aria-hidden="true" className="flex flex-col gap-[32px] list-none p-0 m-0">
        {exchanges.map((ex, i) => (
          <AboutBubble
            key={i}
            exchange={ex}
            typing={typingMap?.[i]}
            instant={instant}
          />
        ))}
      </ol>
    </div>
  );
}
