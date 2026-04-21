"use client";

import type { Exchange } from "@/lib/about-types";
import { AboutTyper } from "./AboutTyper";

type TypingConfig = {
  speed: number;
  onDone?: () => void;
};

type Props = {
  exchange: Exchange;
  typing?: TypingConfig;
  instant?: boolean;
};

export function AboutBubble({ exchange, typing, instant }: Props) {
  const isVisitor = exchange.role === "visitor";
  const label = isVisitor ? "VISITOR" : "PATRICK";
  // Strip leading "/ " so the bubble's own accent token doesn't double-up
  // with opening-thread prefilled entries that include it in the text.
  const bodyText =
    isVisitor && exchange.text.startsWith("/ ")
      ? exchange.text.slice(2)
      : exchange.text;

  return (
    <li className="list-none">
      <p
        aria-hidden="true"
        className="
          font-[family-name:var(--font-mono)] text-[10px]
          tracking-[0.28em] uppercase
          text-[var(--color-ink-soft)]
          mb-[6px]
        "
      >
        {label}
      </p>
      {isVisitor ? (
        <p
          className="
            font-[family-name:var(--font-mono)] text-[15px] leading-[1.55]
            text-[var(--color-ink)]
          "
        >
          <span className="text-[var(--color-accent)] mr-[4px]" aria-hidden="true">
            /
          </span>
          <RenderedText
            text={bodyText}
            typing={typing}
            instant={instant}
          />
        </p>
      ) : (
        <p
          className="
            font-[family-name:var(--font-serif)] text-[17px] leading-[1.6]
            text-[var(--color-ink)]
          "
        >
          <RenderedText
            text={bodyText}
            typing={typing}
            instant={instant}
          />
        </p>
      )}
    </li>
  );
}

function RenderedText({
  text,
  typing,
  instant,
}: {
  text: string;
  typing?: TypingConfig;
  instant?: boolean;
}) {
  if (!typing) return <>{text}</>;
  return (
    <AboutTyper
      text={text}
      speed={typing.speed}
      instant={!!instant}
      onDone={typing.onDone}
    />
  );
}
