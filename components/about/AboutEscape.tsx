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
        flex gap-[24px] z-[40]
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
