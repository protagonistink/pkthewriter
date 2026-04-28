"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { routeIntent } from "@/lib/intent-router";
import type { FeatureKey } from "@/lib/feature-resolver";
import {
  promptGhostCompletion,
  promptSuggestions,
} from "@/lib/prompt-suggestions";

type Status = "idle" | "sending" | "sent" | "navigating" | "error";
type Mode = "initial" | "clarify";

const CLARIFY_SUGGESTIONS = [
  "/ best ad",
  "/ screenwriting",
  "/ hire me",
];

// Slow, confident rotation. Pauses while the visitor is typing. The pool
// surfaces the same high-intent doors the chip row used to expose, mixing
// slash commands, plain-English sentences, and questions so the prompt
// reads like a real conversation starter rather than a menu of commands.
// Every entry has a clean route through lib/intent-router.ts.
const ROTATING_PLACEHOLDERS = [
  "/ resume",
  "Show me your best campaign.",
  "What did you do for Airtable?",
  "/ rates",
  "Tell me about Protagonist Ink.",
  "Are you available in Q3?",
  "/ writing samples",
  "Show me a script.",
  "Who are you?",
  "/ surprise me",
] as const;

// Per-character typing speed and post-type hold + fade-out durations. The
// fade duration must match the .prompt-placeholder-rotator CSS transition.
const TYPE_CHAR_MS = 38;
const HOLD_MS = 1900;
const FADE_MS = 420;

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
  onContactCard: (variant: "hi" | "contact") => void;
  onContextMessage?: (message: string) => boolean;
  /** Parent-controlled "response" state — renders × clear and adjusts helper copy. */
  inResponse: boolean;
  followupMode?: boolean;
  onReset: () => void;
  /** When true, focus the chat input after mount (e.g. arriving via /?ask=1). */
  autoFocus?: boolean;
  /** When non-empty, pre-fill the input and auto-dispatch on mount — used by
   *  the case-study "Ask" overlay which navigates back to /?q=<text>. */
  initialQuery?: string;
};

export function ChatBar({
  onLead,
  onNavigate,
  onCard,
  onFeature,
  onContactCard,
  onContextMessage,
  inResponse,
  followupMode,
  onReset,
  autoFocus,
  initialQuery,
}: Props) {
  const [value, setValue] = useState(initialQuery ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("initial");
  const [reply, setReply] = useState<string | null>(null);
  const [clarifyQuery, setClarifyQuery] = useState("");
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [dismissedGhostFor, setDismissedGhostFor] = useState("");
  // Placeholder rotation state. `displayed` is the partial string visible
  // during typing; `phase` drives the CSS opacity transition for the fade-
  // out segment. The full target for the current rotation is exposed via
  // a ref so the empty-submit fallback dispatches the whole prompt rather
  // than whatever has been typed so far.
  const [displayed, setDisplayed] = useState<string>(ROTATING_PLACEHOLDERS[0]);
  const [phase, setPhase] = useState<"typing" | "holding" | "fading">("holding");
  const targetRef = useRef<string>(ROTATING_PLACEHOLDERS[0]);
  // Lead-flow state: after a free-text prompt fires the lead intent we keep
  // the original message and surface an inline email-capture form so the
  // visitor isn't dead-ended.
  const [originalLeadMessage, setOriginalLeadMessage] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadEmailStatus, setLeadEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const ghost = useMemo(() => {
    if (isTouchLike || followupMode || mode === "clarify") return null;
    if (value && value === dismissedGhostFor) return null;
    return promptGhostCompletion(value);
  }, [dismissedGhostFor, followupMode, isTouchLike, mode, value]);
  const ghostSuffix =
    ghost && ghost.toLowerCase().startsWith(value.trimStart().toLowerCase())
      ? ghost.slice(value.trimStart().length)
      : "";
  const activeSuggestions = useMemo(
    () => promptSuggestions(mode === "clarify" ? clarifyQuery : value, 3),
    [clarifyQuery, mode, value]
  );

  // Placeholder rotation: type the next prompt in character-by-character,
  // hold the full string visible, fade out, advance, repeat. Pauses while
  // the visitor is typing, in clarify, or while a feature/lead dispatch is
  // in flight. Honors prefers-reduced-motion (renders the resting target
  // statically with no animation).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (value.length > 0) return;
    if (mode === "clarify") return;
    if (status === "sending" || status === "sent") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(targetRef.current);
      setPhase("holding");
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    let idx = (ROTATING_PLACEHOLDERS as readonly string[]).indexOf(targetRef.current);
    if (idx < 0) idx = 0;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, ms);
        timers.push(t);
      });

    async function typeOut(target: string) {
      setPhase("typing");
      setDisplayed("");
      for (let i = 1; i <= target.length; i += 1) {
        if (cancelled) return;
        setDisplayed(target.slice(0, i));
        await wait(TYPE_CHAR_MS);
      }
    }

    async function run() {
      // First frame sits on the resting target so there's no blank flash
      // before the first fade.
      targetRef.current = ROTATING_PLACEHOLDERS[idx];
      setDisplayed(targetRef.current);
      setPhase("holding");
      await wait(HOLD_MS);
      while (!cancelled) {
        setPhase("fading");
        await wait(FADE_MS);
        if (cancelled) return;
        idx = (idx + 1) % ROTATING_PLACEHOLDERS.length;
        targetRef.current = ROTATING_PLACEHOLDERS[idx];
        await typeOut(targetRef.current);
        if (cancelled) return;
        setPhase("holding");
        await wait(HOLD_MS);
      }
    }

    void run();

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [value, mode, status]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouchLike(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  function sceneUpdate(update: () => void) {
    if (typeof document === "undefined") {
      update();
      return;
    }
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (!motionOk || !doc.startViewTransition) {
      update();
      return;
    }
    doc.startViewTransition(update);
  }

  // Global "/" or ⌘K/Ctrl+K → focus input. "Escape" → reset.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
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

  // If landing loaded with ?q=… (e.g. from the case-study Ask overlay), run
  // that query through the dispatcher once on mount. Guarded by a ref so
  // re-renders don't re-fire it.
  const autoFiredRef = useRef(false);
  useEffect(() => {
    if (autoFiredRef.current) return;
    const q = initialQuery?.trim();
    if (!q) return;
    autoFiredRef.current = true;
    void dispatch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function dispatch(message: string) {
    const trimmed = message.trim();
    if (!trimmed || status === "sending" || status === "navigating") return;

    const intent = routeIntent(trimmed);
    const shouldStayInConversation =
      inResponse && (intent.kind === "lead" || intent.kind === "clarify");

    if (shouldStayInConversation && onContextMessage?.(trimmed)) {
      setValue("");
      setMode("initial");
      setReply(null);
      setStatus("idle");
      return;
    }

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
          sceneUpdate(() => {
            setValue("");
            onFeature(intent.key, trimmed);
          });
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
      case "contact-card": {
        setMode("initial");
        setReply(null);
        setValue("");
        onContactCard(intent.variant);
        return;
      }
      case "clarify": {
        setClarifyQuery(trimmed);
        setMode("clarify");
        setReply(null);
        return;
      }
      case "lead": {
        setOriginalLeadMessage(trimmed);
        setStatus("sending");
        setMode("initial");
        setReply(null);
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
    void dispatch(value.trim() ? value : targetRef.current);
  }

  function handleSuggestion(text: string) {
    setValue(text);
    void dispatch(text);
  }

  function acceptGhost() {
    if (!ghost) return false;
    setValue(ghost);
    setDismissedGhostFor("");
    setMode("initial");
    return true;
  }

  function reset() {
    setValue("");
    setReply(null);
    setMode("initial");
    setClarifyQuery("");
    setDismissedGhostFor("");
    setStatus("idle");
    setOriginalLeadMessage("");
    setLeadEmail("");
    setLeadEmailStatus("idle");
    onReset();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function submitLeadEmail() {
    const email = leadEmail.trim();
    if (!email || leadEmailStatus === "sending") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLeadEmailStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Reply email: ${email}\nOriginal message: ${originalLeadMessage || "(no prior prompt)"}`,
          context: "contact",
        }),
      });
      if (!res.ok) throw new Error();
      setLeadEmailStatus("sent");
    } catch {
      setLeadEmailStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="chat-composer w-full"
      autoComplete="off"
      style={{ viewTransitionName: "chat-input" }}
    >
      <label htmlFor="chat" className="sr-only">Ask me something</label>
      <div className="relative mb-[14px]">
        <input
          ref={inputRef}
          id="chat"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setDismissedGhostFor("");
            if (mode === "clarify") setMode("initial");
          }}
          onKeyDown={(e) => {
            if ((e.key === "Tab" || e.key === "ArrowRight") && acceptGhost()) {
              e.preventDefault();
              return;
            }
            if (e.key === "Escape" && ghost) {
              e.preventDefault();
              setDismissedGhostFor(value);
            }
          }}
          // Native placeholder is empty when we're rotating — the fading
          // overlay span below renders the visible value so it can crossfade
          // between rotations. Followup mode falls back to a plain native
          // string since rotation pauses there.
          placeholder={followupMode ? "ask a follow-up" : ""}
          aria-label="Ask Patrick a question"
          className="
            w-full px-[24px] pr-[104px] py-[22px]
            font-[family-name:var(--font-mono)] text-[16px]
            text-[var(--color-ink)]
            bg-[var(--color-paper-panel)]
            border border-[var(--color-paper-line)]
            rounded-[3px]
            outline-none
            placeholder:text-[var(--color-ink-faint)]
            focus:border-[var(--color-ink-soft)]
            focus:shadow-[0_0_0_2px_rgba(27,26,22,0.12)]
            transition-[border-color,box-shadow,background] duration-200
            max-[430px]:px-[16px] max-[430px]:pr-[78px] max-[430px]:py-[18px]
          "
        />
        {value === "" && !followupMode && mode !== "clarify" && status === "idle" && (
          <span
            aria-hidden="true"
            data-phase={phase}
            className="
              prompt-placeholder-rotator
              pointer-events-none absolute left-[24px] top-1/2 -translate-y-1/2
              font-[family-name:var(--font-mono)] text-[16px] text-[var(--color-ink-faint)]
              max-[430px]:left-[16px]
              whitespace-nowrap overflow-hidden max-w-[calc(100%-104px)]
              max-[430px]:max-w-[calc(100%-78px)]
            "
          >
            {displayed}
          </span>
        )}
        {ghostSuffix && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute left-[24px] top-1/2
              font-[family-name:var(--font-mono)] text-[16px]
              text-[var(--color-ink-faint)] opacity-55
              max-[430px]:left-[16px]
              motion-safe:transition-opacity
            "
            style={{ transform: `translate(${value.length}ch, -50%)` }}
          >
            {ghostSuffix}
          </span>
        )}
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
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
        {/* Empty input submits the active rotating prompt; typed input submits itself. */}
        {!inResponse && (
          <button
            type="submit"
            aria-label={value.trim() ? "Submit prompt" : `Run ${targetRef.current}`}
            className="
              prompt-keycap prompt-submit
              flex
              absolute right-[18px] top-0 bottom-0 my-auto
              min-w-[64px] h-[34px] px-[12px] items-center justify-center
              rounded-[3px] border border-[var(--color-paper-line)]
              font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]
              text-[var(--color-ink-soft)] bg-[var(--color-paper)]
              transition-[box-shadow,border-color,color,background-color] duration-200
              max-[430px]:right-[10px] max-[430px]:min-w-[58px] max-[430px]:px-[10px] max-[430px]:text-[10px]
            "
          >
            Let&apos;s Go
          </button>
        )}
        {inResponse && (
          <button
            type="submit"
            aria-label="Ask another question"
            className="
              absolute right-[18px] top-0 bottom-0 my-auto h-[34px]
              flex items-center px-[8px]
              font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]
              text-[var(--color-accent)] hover:text-[var(--color-ink)]
              transition-colors
              max-[430px]:right-[10px]
            "
          >
            Ask another →
          </button>
        )}
      </div>

      {!inResponse && mode !== "clarify" && status !== "sending" && status !== "sent" && (
        <div className="mt-[10px]">
          <Link
            href="/work"
            className="
              inline-flex items-center gap-[6px]
              font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em]
              text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]
              transition-colors
            "
          >
            Or skip the chat and see the work <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {mode === "clarify" && (
        <div className="mt-[18px] flex flex-wrap gap-[10px]">
          <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-soft)] tracking-[0.2em] uppercase self-center mr-1">
            closest doors:
          </span>
          {(activeSuggestions.length ? activeSuggestions.map((s) => s.query) : CLARIFY_SUGGESTIONS).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className="
                font-[family-name:var(--font-mono)] text-[13px]
                min-h-[44px] px-[14px] py-[8px] rounded-full
                border border-[var(--color-paper-line)]
                text-[var(--color-ink-mid)]
                hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]
                transition-colors
              "
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Lead success — inline email capture so the visitor isn't dead-ended.
          Posts to /api/lead with context "contact" once the user supplies an
          address. Falls back to the resume so reluctant senders still leave
          with something. */}
      {status === "sent" && !inResponse && mode !== "clarify" && (
        <div className="mt-[18px]">
          <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-mid)] mb-[12px]">
            <span className="text-[var(--color-accent)] mr-1">→</span>
            {leadEmailStatus === "sent"
              ? "I wrote that down. Expect a reply within 24 hours."
              : "I wrote that down. Where should I reply?"}
          </p>
          {leadEmailStatus !== "sent" && (
            <div className="flex gap-[8px] items-center mb-[12px] max-[430px]:flex-wrap">
              <input
                type="email"
                required
                placeholder="your email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void submitLeadEmail();
                  }
                }}
                aria-label="Your email"
                className="
                  font-[family-name:var(--font-mono)] text-[13px]
                  border border-[var(--color-paper-line)] bg-[var(--color-paper-panel)]
                  px-[12px] py-[9px] rounded-[6px] flex-1 min-w-0
                  outline-none focus:border-[var(--color-ink-soft)]
                  placeholder:text-[var(--color-ink-faint)]
                  text-[var(--color-ink)]
                "
              />
              <button
                type="button"
                onClick={() => void submitLeadEmail()}
                disabled={leadEmailStatus === "sending" || !leadEmail.trim()}
                className="
                  font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.14em]
                  border border-[var(--color-paper-line)] px-[14px] py-[9px] rounded-[6px]
                  text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink-soft)]
                  transition-colors disabled:opacity-50 whitespace-nowrap
                "
              >
                {leadEmailStatus === "sending" ? "…" : "Send →"}
              </button>
            </div>
          )}
          {leadEmailStatus === "error" && (
            <p className="font-[family-name:var(--font-mono)] text-[12px] text-red-700 mb-[10px]">
              Something broke on my end. Try again, or email patrick@pkthewriter.com directly.
            </p>
          )}
          <a
            href="/resume"
            className="
              font-[family-name:var(--font-mono)] text-[12px]
              text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]
              transition-colors
            "
          >
            Or grab my resume now →
          </a>
        </div>
      )}

      {reply && !inResponse && status !== "sent" && (
        <div className="mt-[18px] font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-mid)]">
          <span className="text-[var(--color-accent)] mr-1">→</span>
          {reply}
        </div>
      )}
    </form>
  );
}
