"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function CanvasTakeover({
  children,
  backHref = "/",
}: {
  children: React.ReactNode;
  backHref?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-[var(--color-paper)] text-[var(--color-paper-text)]"
      style={{ colorScheme: "light" }}
    >
      <div className="sticky top-0 bg-[var(--color-paper)]/90 backdrop-blur border-b border-[var(--color-paper-border)] z-20">
        <div className="max-w-[820px] mx-auto px-6 py-4">
          <Link
            href={backHref}
            className="font-voice text-sm text-[var(--color-paper-text-muted)] hover:text-[var(--color-paper-text)] transition-colors"
          >
            ← back
          </Link>
        </div>
      </div>
      <div className="max-w-[820px] mx-auto px-6 py-12">{children}</div>
    </motion.div>
  );
}
