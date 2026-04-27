"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Rail } from "@/components/landing/Rail";

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
      className="grid grid-cols-[auto_1fr] min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]"
      style={{ colorScheme: "light" }}
    >
      <Rail />
      <div className="flex flex-col min-w-0">
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
        <main id="main" className="flex-1 max-w-[820px] w-full mx-auto px-6 py-12">{children}</main>
        <SiteFooter />
      </div>
      <CaseStudyAsk />
    </motion.div>
  );
}
