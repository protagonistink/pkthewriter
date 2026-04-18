import Link from "next/link";
import type { ReactNode } from "react";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";

export default function CaseStudyLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]"
    >
      <header className="absolute top-0 left-0 right-0 z-20 px-[40px] pt-[28px] max-[820px]:px-[22px] max-[820px]:pt-[20px]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-serif)] text-[18px] tracking-[-0.01em] text-[var(--color-ink)] hover:opacity-80 transition-opacity"
          >
            Patrick Kirkland
          </Link>
          <Link
            href="/work"
            className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] transition-colors"
          >
            ← All work
          </Link>
        </div>
      </header>
      {children}
      <CaseStudyAsk />
    </div>
  );
}
