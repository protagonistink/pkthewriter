import Link from "next/link";

/**
 * Fixed top-left "← back" link — the only top-nav element on /about.
 * Primary hireability actions live in the AboutFab bottom-right.
 */
export function AboutFloatingNav() {
  return (
    <nav
      aria-label="About page navigation"
      className="fixed top-[22px] left-[28px] z-30 max-[640px]:top-[14px] max-[640px]:left-[16px]"
    >
      <Link
        href="/"
        className="
          font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em]
          text-[var(--color-dark-ink-soft)]
          hover:text-[var(--color-dark-ink)]
          transition-colors duration-200
        "
      >
        ← back
      </Link>
    </nav>
  );
}
