"use client";

import { motion } from "motion/react";

type Props = { state: "on" | "off" };

export function LightSwitch({ state }: Props) {
  const angle = state === "on" ? -15 : 15;

  return (
    <svg
      className="lightswitch"
      width="24"
      height="40"
      viewBox="0 0 24 40"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* Plate */}
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="35"
        rx="2"
        stroke="var(--color-ink-soft)"
        strokeWidth="1"
        fill="var(--color-paper-panel, #f3ecdc)"
      />
      {/* Lever — pivots around the plate center (12, 20) */}
      <motion.g
        style={{ transformOrigin: "12px 20px", color: "var(--color-ink)" }}
        initial={false}
        animate={{
          rotate: angle,
          color: [
            "var(--color-ink)",
            "var(--color-accent)",
            "var(--color-ink)",
          ],
        }}
        transition={{
          rotate: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
          color: { duration: 0.18, ease: "linear", times: [0, 0.5, 1] },
        }}
      >
        <rect
          x="9.5"
          y="9"
          width="5"
          height="22"
          rx="1.5"
          fill="currentColor"
        />
        <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
      </motion.g>
    </svg>
  );
}
