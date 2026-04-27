"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { routeIntent } from "@/lib/intent-router";
import type { FeatureKey } from "@/lib/feature-resolver";
import { buildRotationPlan, LANDING_PLACEHOLDER } from "@/lib/placeholder-rotation";
import {
  promptGhostCompletion,
  promptSuggestions,
} from "@/lib/prompt-suggestions";

type Status = "idle" | "sending" | "sent" | "navigating" | "error";
type Mode = "initial" | "clarify";

const CLARIFY_SUGGESTIONS = [
  "/ best ad",
  "/ screenwriting",
  "/ contact",
];

// Always-visible chips below the input. Anchor the high-intent doors so a
// reluctant visitor has a path without typing.
const PERSISTENT_CHIPS = [
  { query: "/ resume", label: "/ resume" },
  { query: "/ work", label: "/ work" },
  { query: "/ rates", label: "/ rates" },
  { query: "/ availability", label: "/ availability" },
  { query: "/ writing samples", label: "/ writing samples" },
  { query: "/ surprise me", label: "/ surprise me" },
] as const;

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
  const [placeholder, setPlaceholder] = useState<string>(LANDING_PLACEHOLDER);
  const [placeholderAction, setPlaceholderAction] = useState<string>(LANDING_PLACEHOLDER);
  const [clarifyQuery, setClarifyQuery] = useState("");
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [dismissedGhostFor, setDismissedGhostFor] = useState("");
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

  // Animated rotating placeholder. Pauses on focus, on input, and on
  // prefers-reduced-motion. Always lands on LANDING_PLACEHOLDER.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaceholder(LANDING_PLACEHOLDER);
      setPlaceholderAction(LANDING_PLACEHOLDER);
      return;
    }

    const plan = buildRotationPlan();
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        timers.push(t);
      });
    }

    function typeOut(target: string) {
      return new Promise<void>((resolve) => {
        let i = 0;
        function step() {
          if (cancelled) return resolve();
          i += 1;
          setPlaceholder(target.slice(0, i));
          if (i >= target.length) return resolve();
          const t = setTimeout(step, 38);
          timers.push(t);
        }
        step();
      });
    }

    function eraseBack() {
      return new Promise<void>((resolve) => {
        function step() {
          if (cancelled) return resolve();
          setPlaceholder((prev) => {
            const next = prev.slice(0, -1);
            if (next.length === 0) {
              const t = setTimeout(resolve, 0);
              timers.push(t);
              return next;
            }
            const t = setTimeout(step, 22);
            timers.push(t);
            return next;
          });
        }
        step();
      });
    }

    async function run() {
      // Hold the canonical "/ surprise me" as a clean first impression,
      // then keep offering doors until the visitor takes one.
      await wait(1400);
      let i = 0;
      while (!cancelled) {
        const target = plan[i % plan.length];
        if (cancelled) return;
        setPlaceholderAction(target);
        await eraseBack();
        await wait(140);
        await typeOut(target);
        await wait(1600);
        i += 1;
      }
    }

    void run();

    return () => {
      cancelled = true;
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouchLike(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  function stopRotation() {
    setPlaceholder(LANDING_PLACEHOLDER);
    setPlaceholderAction(LANDING_PLACEHOLDER);
  }

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
    void dispatch(value.trim() ? value : placeholderAction);
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
    onReset();
    requestAnimationFrame(() => inputRef.current?.focus());
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
            stopRotation();
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
          placeholder={followupMode ? "ask a follow-up" : placeholder}
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
            aria-label={value.trim() ? "Submit prompt" : `Run ${placeholderAction}`}
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
      </div>

      {!inResponse && mode !== "clarify" && (
        <div className="mt-[16px] flex flex-wrap gap-[8px]">
          {PERSISTENT_CHIPS.map((chip) => (
            <button
              key={chip.query}
              type="button"
              onClick={() => handleSuggestion(chip.query)}
              className="
                font-[family-name:var(--font-mono)] text-[12px]
                min-h-[44px] px-[14px] py-[8px] rounded-full
                border border-[var(--color-paper-line)]
                text-[var(--color-ink-soft)]
                hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]
                transition-colors
              "
            >
              {chip.label}
            </button>
          ))}
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
