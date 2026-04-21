import Link from "next/link";
import type { ReactNode } from "react";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { SiteHeader } from "@/components/landing/SiteHeader";

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <div className="absolute top-0 left-0 right-0 z-20">
        <SiteHeader
          rightSlot={
            <Link
              href="/work"
              className="
                inline-block pt-[10px]
                font-[family-name:var(--font-mono)] text-[12px] tracking-[0.2em] uppercase
                text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] transition-colors
              "
            >
              ← All work
            </Link>
          }
        />
      </div>
      <main id="main">{children}</main>
      <CaseStudyAsk />
    </div>
  );
}
