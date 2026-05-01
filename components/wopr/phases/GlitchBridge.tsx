"use client";

import { useEffect } from "react";
import styles from "../wopr.module.css";

// Deterministic offsets — the bridge is only ~1s long, so the visual variety
// from non-uniform spacing matters less than render purity.
const TEAR_TOPS = ["6%", "23%", "41%", "57%", "72%", "89%"];

export function GlitchBridge({
  onDone,
  reduceMotion,
  totalMs,
}: {
  onDone: () => void;
  reduceMotion: boolean;
  totalMs: number;
}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, totalMs);
    return () => clearTimeout(t);
  }, [onDone, totalMs]);

  if (reduceMotion) {
    return <div className={styles.terminal} />;
  }

  return (
    <div className={styles.glitchRoot}>
      <div className={styles.terminal}>
        <div style={{ opacity: 0.7 }}>JOSHUA — INTEGRITY DROP DETECTED</div>
        <div style={{ opacity: 0.5, marginTop: 8 }}>RECALCULATING...</div>
      </div>
      {TEAR_TOPS.map((top, i) => (
        <div key={i} className={styles.glitchTear} style={{ top }} />
      ))}
    </div>
  );
}
