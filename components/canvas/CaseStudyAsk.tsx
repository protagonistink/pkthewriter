"use client";

import { useEffect, useRef, useState } from "react";

export function CaseStudyAsk() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setOpen(false);
    setValue("");
    // Hard navigation so the landing client remounts and its useState
    // initializer picks up ?q= from the URL. router.push() preserved stale
    // state between the two routes and the auto-dispatch never fired.
    window.location.href = `/?q=${encodeURIComponent(trimmed)}`;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Ask for something else"
        onClick={() => setOpen(true)}
        className="
          fixed bottom-[28px] right-[28px] z-30
          w-[52px] h-[52px] rounded-full
          bg-[var(--color-ink)] text-[var(--color-paper)]
          shadow-[0_12px_32px_rgba(0,0,0,0.35)]
          flex items-center justify-center
          hover:scale-[1.04] hover:bg-[var(--color-accent)]
          transition-all duration-200
          max-[820px]:bottom-[18px] max-[820px]:right-[18px]
        "
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12c0 4.418-4.03 8-9 8a9.8 9.8 0 0 1-3.2-.53L4 21l1.6-4.1A7.8 7.8 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask for something else"
          className="fixed inset-0 z-40 flex items-start justify-center pt-[22vh] px-[24px] max-[820px]:pt-[18vh]"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[rgba(10,9,7,0.72)] backdrop-blur-[4px]"
          />
          <form
            onSubmit={submit}
            autoComplete="off"
            className="relative w-full max-w-[560px]"
          >
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)] mb-[14px] text-center">
              What do you want to see next?
            </p>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="/ ask anything"
              aria-label="Ask for something else"
              className="
                w-full px-[24px] py-[20px]
                font-[family-name:var(--font-mono)] text-[16px]
                text-[var(--color-ink)]
                bg-[var(--color-paper-panel)]
                border border-[var(--color-paper-line)]
                rounded-[18px]
                outline-none
                placeholder:text-[var(--color-ink-faint)]
                focus:border-[var(--color-ink-soft)]
                focus:shadow-[0_0_0_3px_rgba(27,26,22,0.08)]
                shadow-[0_24px_60px_rgba(0,0,0,0.45)]
                transition-[border-color,box-shadow] duration-200
              "
            />
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.02em] text-[var(--color-ink-soft)] mt-[14px] text-center">
              [Enter] to ask · [Esc] to close
            </p>
          </form>
        </div>
      )}
    </>
  );
}
