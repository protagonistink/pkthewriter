"use client";

import Link from "next/link";

type Props = {
  email: string;
};

export function AboutEscape({ email }: Props) {
  return (
    <nav
      aria-label="Quick links"
      className="
        fixed bottom-[24px] left-1/2 -translate-x-1/2
        flex items-center gap-[20px] z-[40]
        bg-[var(--color-paper)] border border-[var(--color-paper-line)]
        rounded-[3px] px-[16px] py-[10px]
        shadow-[0_2px_12px_rgba(27,26,22,0.06)]
      "
    >
      <Link
        href="/work"
        className="
          font-[family-name:var(--font-mono)] text-[13px] tracking-[0.04em]
          text-[var(--color-ink-soft)]
          hover:text-[var(--color-ink)]
          transition-colors
        "
      >
        see the work →
      </Link>
      <span aria-hidden="true" className="w-px h-[14px] bg-[var(--color-paper-line)]" />
      <a
        href={`mailto:${email}`}
        className="
          font-[family-name:var(--font-mono)] text-[13px] tracking-[0.04em]
          text-[var(--color-ink-soft)]
          hover:text-[var(--color-ink)]
          transition-colors
        "
      >
        email me →
      </a>
    </nav>
  );
}
