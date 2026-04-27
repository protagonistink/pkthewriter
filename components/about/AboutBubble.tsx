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
  const label = isVisitor ? "YOU" : "ME";
  // Strip leading "/ " so the bubble's own accent token doesn't double-up
  // with opening-thread prefilled entries that include it in the text.
  const bodyText =
    isVisitor && exchange.text.startsWith("/ ")
      ? exchange.text.slice(2)
      : exchange.text;

  return (
    <li className="list-none">
      <div aria-hidden="true" className="flex items-center gap-[12px] mb-[10px]">
        <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.28em] uppercase text-[var(--color-ink-soft)] shrink-0 select-none">
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--color-paper-line-soft)]" />
      </div>
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
        <>
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
          {exchange.artifact && <AboutArtifact artifact={exchange.artifact} />}
        </>
      )}
    </li>
  );
}

function AboutArtifact({
  artifact,
}: {
  artifact: NonNullable<Extract<Exchange, { role: "patrick" }>["artifact"]>;
}) {
  return (
    <aside
      className="
        mt-[18px] max-w-[620px]
        border border-[var(--color-paper-line-soft)]
        bg-[var(--color-paper-panel)]
        px-[18px] py-[14px]
        font-[family-name:var(--font-mono)]
        shadow-[0_1px_0_rgba(255,255,255,0.55)]
      "
    >
      <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-soft)] mb-[10px]">
        {artifact.title}
      </p>
      <ul className="m-0 p-0 list-none space-y-[8px]">
        {artifact.items.map((item) => (
          <li key={item} className="text-[13px] leading-[1.5] text-[var(--color-ink-mid)]">
            <span className="text-[var(--color-accent)] mr-[8px]" aria-hidden="true">
              /
            </span>
            {item}
          </li>
        ))}
      </ul>
    </aside>
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
