"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  charMs?: number;
  blankPauseMs?: number;
  startDelayMs?: number;
  reduceMotion?: boolean;
  onChar?: () => void;
  onDone?: () => void;
};

/**
 * Renders `text` character-by-character. Honors reduced-motion by snapping
 * straight to the final string. Calls `onChar` once per visible character so
 * the parent can fire a typewriter-click sound.
 */
export function useTypewriter(text: string, opts: Options = {}) {
  const {
    charMs = 28,
    blankPauseMs = 200,
    startDelayMs = 0,
    reduceMotion = false,
    onChar,
    onDone,
  } = opts;
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const onCharRef = useRef(onChar);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onCharRef.current = onChar;
    onDoneRef.current = onDone;
  });

  // Reset and re-run when text/reduceMotion change. This is a state machine
  // driven by props — setState-in-effect is the right pattern here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (reduceMotion) {
      setDisplayed(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    let cancelled = false;
    const timeouts: number[] = [];
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        setDone(true);
        onDoneRef.current?.();
        return;
      }
      const ch = text[i];
      i += 1;
      setDisplayed(text.slice(0, i));
      if (ch !== " " && ch !== "\n") onCharRef.current?.();
      const delay = ch === "\n" ? blankPauseMs : charMs;
      const t = window.setTimeout(tick, delay);
      timeouts.push(t);
    };

    const t0 = window.setTimeout(tick, startDelayMs);
    timeouts.push(t0);

    return () => {
      cancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [text, charMs, blankPauseMs, startDelayMs, reduceMotion]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { displayed, done };
}
