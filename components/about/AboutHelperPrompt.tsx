"use client";

import { useState } from "react";

const ROTATING_PLACEHOLDERS = [
  "/ resume",
  "/ work",
  "/ rates",
  "/ availability",
  "/ surprise me",
] as const;

/**
 * Inline mobile-only helper prompt for the bottom of /about. Mirrors the
 * landing chat composer's look — submission redirects to /?q= so the home
 * page's intent router handles routing. Server component-friendly: no
 * dependency on the LandingClient state machine.
 */
export function AboutHelperPrompt() {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    const next = trimmed
      ? `/?q=${encodeURIComponent(trimmed)}`
      : `/?q=${encodeURIComponent(ROTATING_PLACEHOLDERS[0])}`;
    window.location.href = next;
  }

  return (
    <section
      aria-label="Ask Patrick"
      className="hidden max-[820px]:block border-t border-[var(--color-paper-line)] bg-[var(--color-paper)] px-[22px] pt-[48px] pb-[120px]"
    >
      <p className="mb-[14px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">
        &gt; one more thing
      </p>
      <h2 className="mb-[20px] font-[family-name:var(--font-serif)] text-[clamp(34px,8vw,52px)] leading-[1.02] tracking-[-0.025em] text-[var(--color-ink)]">
        Ask anything.
      </h2>
      <form onSubmit={submit} autoComplete="off">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`${ROTATING_PLACEHOLDERS[0]} · or ask anything`}
            aria-label="Ask Patrick a question"
            className="
              w-full px-[18px] pr-[88px] py-[18px]
              font-[family-name:var(--font-mono)] text-[15px]
              text-[var(--color-ink)]
              bg-[var(--color-paper-panel)]
              border border-[var(--color-paper-line)]
              rounded-[6px]
              outline-none
              placeholder:text-[var(--color-ink-faint)]
              focus:border-[var(--color-ink-soft)]
              focus:shadow-[0_0_0_2px_rgba(27,26,22,0.12)]
              transition-[border-color,box-shadow] duration-200
            "
          />
          <button
            type="submit"
            aria-label="Submit"
            className="
              absolute right-[8px] top-1/2 -translate-y-1/2
              min-w-[64px] h-[36px] px-[12px]
              font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]
              border border-[var(--color-paper-line)] rounded-[4px]
              text-[var(--color-ink-soft)] bg-[var(--color-paper)]
              hover:text-[var(--color-ink)] hover:border-[var(--color-ink-soft)]
              transition-colors
            "
          >
            Go →
          </button>
        </div>
      </form>
    </section>
  );
}
