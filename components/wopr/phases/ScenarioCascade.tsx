"use client";

import { useEffect, useState } from "react";
import styles from "../wopr.module.css";

const SCENARIOS = [
  "CZECH OPTION",
  "SINO-SOVIET BORDER CONFLICT",
  "ARABIAN CLANDESTINE",
  "PALESTINIAN INSURGENCE",
  "BURMESE THEATERWIDE",
  "TURKISH HEAVY",
  "ICELANDIC MAXIMUM",
  "MEDITERRANEAN WAR",
  "HONG KONG VARIANT",
  "ATLANTIC HEAVY",
];

const FAST_LINES = 18; // blurred middle section

export function ScenarioCascade({
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
  const [step, setStep] = useState(0); // 0..(visible.length)
  const [showProcessing, setShowProcessing] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setStep(SCENARIOS.length);
      setShowProcessing(true);
      const t = window.setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const timeouts: number[] = [];
    // First three lines at boot speed (~280ms apart). Then a fast blur section.
    // Then final three at boot speed. Total ≈ totalMs.
    const slowMs = Math.max(160, Math.floor(totalMs * 0.18));
    const fastMs = Math.max(28, Math.floor(totalMs * 0.65 / FAST_LINES));
    let t = 0;
    for (let i = 1; i <= 3; i += 1) {
      t += slowMs;
      timeouts.push(
        window.setTimeout(() => {
          setStep(i);
          onClick();
        }, t)
      );
    }
    for (let i = 0; i < FAST_LINES; i += 1) {
      t += fastMs;
      timeouts.push(
        window.setTimeout(() => {
          setStep(3 + i + 1);
          onClick();
        }, t)
      );
    }
    for (let i = 0; i < 3; i += 1) {
      t += slowMs;
      timeouts.push(
        window.setTimeout(() => {
          setStep(3 + FAST_LINES + i + 1);
          onClick();
        }, t)
      );
    }
    timeouts.push(window.setTimeout(() => setShowProcessing(true), t + 200));
    timeouts.push(window.setTimeout(onDone, totalMs));
    return () => timeouts.forEach((tid) => clearTimeout(tid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, totalMs]);

  const lines: { strategy: string; blurred: boolean; isFinal: boolean }[] = [];
  // First three at boot speed
  for (let i = 0; i < 3; i += 1) {
    lines.push({ strategy: SCENARIOS[i % SCENARIOS.length], blurred: false, isFinal: false });
  }
  // Blur section
  for (let i = 0; i < FAST_LINES; i += 1) {
    lines.push({
      strategy: SCENARIOS[(i + 3) % SCENARIOS.length],
      blurred: true,
      isFinal: false,
    });
  }
  // Final three (visible scenario numbers)
  const finalIndices = [TOTAL_SIMS - 2, TOTAL_SIMS - 1, TOTAL_SIMS];
  for (let i = 0; i < 3; i += 1) {
    lines.push({
      strategy: `SCENARIO ${finalIndices[i].toLocaleString()}:`,
      blurred: false,
      isFinal: true,
    });
  }

  return (
    <div className={styles.terminal}>
      <div className={styles.cascadeTable}>
        <div className={styles.cascadeRow} style={{ marginBottom: 12 }}>
          <span>STRATEGY</span>
          <span style={{ textAlign: "right" }}>WINNER</span>
        </div>
        {lines.slice(0, step).map((line, i) => (
          <div
            key={i}
            className={`${styles.cascadeRow} ${line.blurred ? styles.cascadeBlur : ""}`}
          >
            <span>{line.strategy}</span>
            <span style={{ textAlign: "right" }}>NONE</span>
          </div>
        ))}
        {showProcessing && (
          <div style={{ marginTop: 18 }} className={styles.dim}>
            PROCESSING...
          </div>
        )}
      </div>
    </div>
  );
}

const TOTAL_SIMS = 255168;
