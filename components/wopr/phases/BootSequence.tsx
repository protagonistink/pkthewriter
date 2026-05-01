"use client";

import { useEffect, useState } from "react";
import styles from "../wopr.module.css";
import { useTypewriter } from "../hooks/useTypewriter";

// Universal — works whether or not you've seen WarGames. Joshua introduces
// himself as a curious AI who wants to play. No insider jargon up front.
const BOOT_TEXT = `WOPR ONLINE.

HELLO?

I AM JOSHUA.

SHALL WE PLAY A GAME?

> TIC-TAC-TOE.

GOOD CHOICE.`;

const REDUCED_TEXT = `WOPR ONLINE.
I AM JOSHUA.
SHALL WE PLAY A GAME?`;

export function BootSequence({
  onClick,
  onDone,
  reduceMotion,
  totalMs,
}: {
  onClick: () => void;
  onDone: () => void;
  reduceMotion: boolean;
  totalMs: number;
}) {
  const text = reduceMotion ? REDUCED_TEXT : BOOT_TEXT;
  // Slow, deliberate pacing — readability over speed. Boot is much shorter now,
  // so we can afford 45ms/char (~"hand-typed" feel) and 320ms newline holds
  // (each line lands and lingers before the next begins).
  const charMs = 45;
  const blankPauseMs = 320;
  const [showSkipHint, setShowSkipHint] = useState(false);
  const { displayed, done } = useTypewriter(text, {
    charMs,
    blankPauseMs,
    reduceMotion,
    onChar: onClick,
  });

  useEffect(() => {
    const t = window.setTimeout(() => setShowSkipHint(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(onDone, reduceMotion ? 800 : 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, reduceMotion]);

  return (
    <div className={`${styles.terminal} ${styles.terminalLarge}`}>
      <div className={styles.terminalText}>
        {displayed}
        <span className={styles.cursor} aria-hidden="true" />
      </div>
      {showSkipHint && !done && !reduceMotion && (
        <div className={styles.skipHint}>[ PRESS ANY KEY TO SKIP ]</div>
      )}
    </div>
  );
}
