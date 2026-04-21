"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * A thin vertical track on the right edge of the viewport. An accent-colored
 * segment fills from top to bottom as the reader scrolls the page. Ambient —
 * not a scrollbar, just a journey cue. Hidden below 640px.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 right-0 z-30 h-screen w-[1px] bg-[var(--color-dark-line)] max-[640px]:hidden"
    >
      <motion.div
        className="w-full origin-top bg-[var(--color-accent)]"
        style={{ scaleY: progress, height: "100%" }}
      />
    </div>
  );
}
