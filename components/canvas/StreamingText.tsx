"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type Props = {
  text: string;
  /** ms per character. Default 55. */
  speed?: number;
  /** ms before typing starts after trigger. Default 0. */
  startDelay?: number;
  /** When true, start immediately on mount instead of on first scroll into view. */
  immediate?: boolean;
  /** Fires once typing completes (used to chain lines). */
  onComplete?: () => void;
  /** Fires the moment typing begins (used for staggered lines). */
  onStart?: () => void;
  className?: string;
  /** When false, skip rendering the caret entirely (used on non-active lines). */
  showCaret?: boolean;
};

/**
 * Types a string character-by-character, with a blinking caret that fades out
 * when typing completes. Triggers on first scroll-into-view unless `immediate`.
 * Respects prefers-reduced-motion — renders the full string instantly, no caret.
 */
export function StreamingText({
  text,
  speed = 55,
  startDelay = 0,
  immediate = false,
  onComplete,
  onStart,
  className,
  showCaret = true,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  const onStartRef = useRef(onStart);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStartRef.current = onStart;
  });

  const shouldStart = immediate || inView;
  const effectiveIndex = reduce ? text.length : index;
  const effectiveDone = reduce ? true : done;

  useEffect(() => {
    if (reduce) {
      if (!startedRef.current) {
        startedRef.current = true;
        onStartRef.current?.();
        onCompleteRef.current?.();
      }
      return;
    }
    if (!shouldStart || startedRef.current) return;
    startedRef.current = true;

    let interval: ReturnType<typeof setInterval> | undefined;
    const delayTimer = setTimeout(() => {
      onStartRef.current?.();
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setIndex(i);
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
          onCompleteRef.current?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      if (interval) clearInterval(interval);
      clearTimeout(delayTimer);
    };
  }, [shouldStart, reduce, speed, startDelay, text]);

  const visible = text.slice(0, effectiveIndex);
  const caretVisible = showCaret && !reduce && !effectiveDone;

  return (
    <span ref={ref} className={className}>
      <span>{visible}</span>
      {caretVisible && (
        <span
          aria-hidden="true"
          className="about-caret inline-block w-[0.08em] ml-[0.05em] translate-y-[0.05em] self-end"
          style={{
            animation: "caret-blink 1s step-start infinite",
            background: "currentColor",
            height: "1em",
            verticalAlign: "-0.12em",
          }}
        />
      )}
    </span>
  );
}
