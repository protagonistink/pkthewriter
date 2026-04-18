"use client";

import { useEffect, useId, useRef, useState } from "react";
import { routeIntent } from "@/lib/intent-router";
import type { FeatureKey } from "@/lib/feature-resolver";

type Status = "idle" | "sending" | "sent" | "navigating" | "error";
type Mode = "initial" | "clarify";

const CLARIFY_SUGGESTIONS = [
  "Show me your best ad",
  "Do you write screenplays?",
  "How do we work together?",
];

const THINKING_LINES = [
  "Hmmm…",
  "Let me think…",
  "Good one. One sec…",
  "Give me a beat…",
];

type Props = {
  onLead: (message: string) => Promise<void>;
  onNavigate: (to: string) => void;
  onCard: (id: "pi") => void;
  onFeature: (key: FeatureKey, raw: string) => void;
  /** Parent-controlled "response" state — renders × clear and adjusts helper copy. */
  inResponse: boolean;
  onReset: () => void;
  /** When true, focus the chat input after mount (e.g. arriving via /?ask=1). */
  autoFocus?: boolean;
};

export function ChatBar({
  onLead,
  onNavigate,
  onCard,
  onFeature,
  inResponse,
  onReset,
  autoFocus,
}: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("initial");
  const [reply, setReply] = useState<string | null>(null);
  const honeypotId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global "/" → focus input, "Escape" → reset. Mirrors Hifi.html.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !inEditable) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        if (inResponse) {
          e.preventDefault();
          reset();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inResponse]);

  useEffect(() => {
    if (autoFocus) {
      // Wait for paint so iOS Safari accepts the focus.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [autoFocus]);

  async function dispatch(message: string) {
    const trimmed = message.trim();
    if (!trimmed || status === "sending" || status === "navigating") return;

    const intent = routeIntent(trimmed);

    switch (intent.kind) {
      case "navigate": {
        setStatus("navigating");
        setMode("initial");
        setReply(`→ opening ${intent.label}…`);
        setTimeout(() => onNavigate(intent.to), 280);
        return;
      }
      case "feature": {
        setMode("initial");
        setStatus("sending");
        setReply(THINKING_LINES[Math.floor(Math.random() * THINKING_LINES.length)]);
        setTimeout(() => {
          setReply(null);
          setStatus("idle");
          onFeature(intent.key, trimmed);
        }, 650);
        return;
      }
      case "card": {
        setValue("");
        setMode("initial");
        setReply(null);
        onCard(intent.id);
        return;
      }
      case "clarify": {
        setMode("clarify");
        setReply(null);
        return;
      }
      case "lead": {
        setStatus("sending");
        setMode("initial");
        setReply("I wrote that down — you'll hear from me.");
        try {
          await onLead(trimmed);
          setStatus("sent");
        } catch {
          setStatus("error");
          setReply("Something broke on my end. Try again, or just email me.");
        }
        return;
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void dispatch(value);
  }

  function handleSuggestion(text: string) {
    setValue(text);
    void dispatch(text);
  }

  function reset() {
    setValue("");
    setReply(null);
    setMode("initial");
    setStatus("idle");
    onReset();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" autoComplete="off">
      <label htmlFor="chat" className="sr-only">Ask me something</label>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        id={honeypotId}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-0 h-0 opacity-0"
        aria-hidden="true"
      />
      {/* Implicit-submit target. With a honeypot input in the form, the
          browser needs a submit button for Enter to dispatch submit. */}
      <button type="submit" aria-hidden="true" tabIndex={-1} className="sr-only">
        Send
      </button>
      <div className="relative mb-[14px]">
        <input
          ref={inputRef}
          id="chat"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (mode === "clarify") setMode("initial");
          }}
          placeholder="/ best ad"
          aria-label="Ask Patrick a question"
          className="
            w-full px-[24px] pr-[48px] py-[22px]
            font-[family-name:var(--font-mono)] text-[16px]
            text-[var(--color-ink)]
            bg-[var(--color-paper-panel)]
            border border-[var(--color-paper-line)]
            rounded-[18px]
            outline-none
            placeholder:text-[var(--color-ink-faint)]
            focus:border-[var(--color-ink-soft)]
            focus:shadow-[0_0_0_3px_rgba(27,26,22,0.04)]
            transition-[border-color,box-shadow,background] duration-200
          "
        />
        <button
          type="button"
          onClick={reset}
          aria-label="Clear and go back"
          className="
            prompt-clear
            absolute right-[18px] top-1/2 -translate-y-1/2
            w-[26px] h-[26px] rounded-full
            items-center justify-center
            text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]
            hover:bg-[rgba(27,26,22,0.05)]
            transition-colors
          "
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
      </div>
      <p
        className="
          prompt-help
          font-[family-name:var(--font-mono)] text-[11px]
          text-[var(--color-ink-soft)] m-0 mx-[6px]
          tracking-[0.02em]
        "
      >
        Tell me in your own words. [Enter] to respond.
      </p>

      {mode === "clarify" && (
        <div className="mt-[18px] flex flex-wrap gap-[10px]">
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-soft)] tracking-[0.2em] uppercase self-center mr-1">
            try:
          </span>
          {CLARIFY_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="
                font-[family-name:var(--font-mono)] text-[13px]
                px-[14px] py-[6px] rounded-full
                border border-[var(--color-paper-line)]
                text-[var(--color-ink-mid)]
                hover:text-[var(--color-ink)] hover:border-[var(--color-ink-soft)]
                transition-colors
              "
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {reply && !inResponse && (
        <div className="mt-[18px] font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-mid)]">
          <span className="text-[var(--color-accent)] mr-1">→</span>
          {reply}
          {status === "sent" && <span className="ml-2 text-[var(--color-accent)]">•</span>}
        </div>
      )}
    </form>
  );
}
