"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";

export function AllWorkBackLink() {
  const router = useRouter();

  const onClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const go = () => router.push("/work");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof document.startViewTransition !== "function") {
      go();
      return;
    }
    document.body.dataset.transition = "back-crossfade";
    const transition = document.startViewTransition(go);
    void transition.finished.finally(() => {
      if (document.body.dataset.transition === "back-crossfade") {
        delete document.body.dataset.transition;
      }
    });
  };

  return (
    <Link
      href="/work"
      onClick={onClick}
      className="
        inline-block pt-[10px]
        font-[family-name:var(--font-mono)] text-[12px] tracking-[0.2em] uppercase
        text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] transition-colors
      "
    >
      ← All work
    </Link>
  );
}
