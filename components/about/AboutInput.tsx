"use client";

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  placeholders: string[];
  onSubmit: (text: string) => void;
  ghostComplete: (partial: string) => string | null;
  /** True while the opening thread is still auto-playing. */
  disabled: boolean;
};

export type AboutInputHandle = { focus: () => void };

export const AboutInput = forwardRef<AboutInputHandle, Props>(function AboutInput(
  { placeholders, onSubmit, ghostComplete, disabled },
  ref
) {
  const prefersReduced = useReducedMotion();
  const honeypotId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => requestAnimationFrame(() => inputRef.current?.focus()),
  }));

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [phIndex, setPhIndex] = useState(0);

  // Ghost completion — only when input has value and not disabled
  const ghost = value && !disabled ? ghostComplete(value) : null;
  const ghostSuffix = ghost && ghost.toLowerCase().startsWith(value.toLowerCase())
    ? ghost.slice(value.length)
    : null;

  // Placeholder cycling — every 4s, paused when focused, typing, reduced-motion, or disabled
  useEffect(() => {
    if (prefersReduced || focused || value || disabled || placeholders.length <= 1) return;
    const id = setInterval(() => {
      setPhIndex((i) => (i + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(id);
  }, [prefersReduced, focused, value, disabled, placeholders.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && ghostSuffix) {
        e.preventDefault();
        if (ghost) setValue(ghost);
      }
    },
    [ghost, ghostSuffix]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    onSubmit(trimmed);
  };

  // Focus input once opening thread finishes playing
  useEffect(() => {
    if (!disabled) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [disabled]);

  const placeholder = placeholders[phIndex] ?? placeholders[0] ?? "";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-[32px]"
      autoComplete="off"
    >
      <label htmlFor="about-input" className="sr-only">
        Ask Patrick a question
      </label>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        id={honeypotId}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-0 h-0 opacity-0"
        aria-hidden="true"
      />
      {/* Implicit submit for Enter key */}
      <button type="submit" aria-hidden="true" tabIndex={-1} className="sr-only">
        Send
      </button>

      <div className="relative">
        {/* Ghost text layer — absolutely positioned, same font/padding as input */}
        {ghostSuffix && (
          <div
            aria-hidden="true"
            className="
              absolute inset-0
              px-[24px] py-[22px]
              font-[family-name:var(--font-mono)] text-[16px] leading-normal
              pointer-events-none overflow-hidden whitespace-pre
              flex items-center
            "
          >
            <span className="invisible">{value}</span>
            <span className="text-[var(--color-ink-faint)]">{ghostSuffix}</span>
          </div>
        )}

        <input
          ref={inputRef}
          id="about-input"
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Ask Patrick a question"
          className="
            w-full px-[24px] pr-[48px] py-[22px]
            font-[family-name:var(--font-mono)] text-[16px]
            text-[var(--color-ink)]
            bg-[var(--color-paper-panel)]
            border border-[var(--color-paper-line)]
            rounded-[3px]
            outline-none
            placeholder:text-[var(--color-ink-faint)]
            focus:border-[var(--color-ink-soft)]
            focus:shadow-[0_0_0_2px_rgba(27,26,22,0.12)]
            transition-[border-color,box-shadow] duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        />
      </div>

      {ghostSuffix && (
        <p
          aria-hidden="true"
          className="
            mt-[6px] mx-[6px]
            font-[family-name:var(--font-mono)] text-[12px]
            text-[var(--color-ink-faint)]
            tracking-[0.04em]
          "
        >
          tab to complete
        </p>
      )}
    </form>
  );
});

