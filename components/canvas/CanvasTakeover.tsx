"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";

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
      className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]"
      style={{ colorScheme: "light" }}
    >
      <SiteHeader
        rightSlot={
          <Link
            href={backHref}
            className="
              inline-block pt-[10px]
              font-[family-name:var(--font-mono)] text-[12px] tracking-[0.2em] uppercase
              text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] transition-colors
            "
          >
            ← Back
          </Link>
        }
      />
      <main id="main" className="max-w-[820px] mx-auto px-6 py-12">{children}</main>
      <CaseStudyAsk />
    </motion.div>
  );
}
