"use client";

import { useEffect, useRef, useState } from "react";

const TRANSITION_MS = 260;

export function CaseStudyAsk() {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openPanel() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
    // Double-rAF so the initial (closed) transform commits before we flip to entered.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
  }

  function closePanel() {
    setEntered(false);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setValue("");
    }, TRANSITION_MS);
  }

  useEffect(() => {
    if (!open) return;
    // Focus on enter animation frame so iOS Safari accepts it.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ⌘K / Ctrl+K — global accelerator to open the ask overlay from any surface
  // where this component is mounted. Skipped when the panel is already open
  // (the open-state effect above owns the keymap once inside).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isCmdK) return;
      e.preventDefault();
      if (!open) openPanel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    // Hard nav so the landing client remounts and its useState initializer
    // picks up ?q= from the URL cleanly.
    window.location.href = `/?q=${encodeURIComponent(trimmed)}`;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Ask for something else"
        aria-expanded={open}
        onClick={openPanel}
        className={`
          fixed bottom-[28px] right-[28px] z-30
          w-[52px] h-[52px] rounded-full
          bg-[var(--color-ink)] text-[var(--color-paper)]
          shadow-[0_12px_32px_rgba(0,0,0,0.35)]
          flex items-center justify-center
          hover:scale-[1.04] hover:bg-[var(--color-accent)]
          transition-all duration-200
          max-[820px]:bottom-[18px] max-[820px]:right-[18px]
          ${open ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}
        `}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12c0 4.418-4.03 8-9 8a9.8 9.8 0 0 1-3.2-.53L4 21l1.6-4.1A7.8 7.8 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={closePanel}
            className={`
              fixed inset-0 z-40 cursor-default
              bg-[rgba(10,9,7,0.28)]
              transition-opacity duration-[${TRANSITION_MS}ms] ease-out
              ${entered ? "opacity-100" : "opacity-0"}
            `}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ask for something else"
            style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            className={`
              fixed z-50 bottom-[28px] right-[28px]
              w-[400px] max-w-[calc(100vw-28px)]
              bg-[var(--color-paper-panel)] text-[var(--color-ink)]
              border border-[var(--color-paper-line)]
              rounded-[22px]
              shadow-[0_28px_80px_rgba(0,0,0,0.5)]
              origin-bottom-right
              transition-[opacity,transform] ease-out
              ${entered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[0.92]"}
              max-[820px]:left-[14px] max-[820px]:right-[14px] max-[820px]:bottom-[14px] max-[820px]:w-auto
            `}
          >
            <div className="flex items-center justify-between px-[22px] pt-[18px] pb-[10px]">
              <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.28em] uppercase text-[var(--color-ink-soft)]">
                Ask
              </span>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="
                  w-[26px] h-[26px] rounded-full
                  flex items-center justify-center
                  text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]
                  hover:bg-[rgba(27,26,22,0.06)]
                  transition-colors
                "
              >
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={submit} autoComplete="off" className="px-[22px] pb-[22px]">
              <p className="font-[family-name:var(--font-serif)] italic text-[22px] leading-[1.2] tracking-[-0.005em] text-[var(--color-ink)] mb-[16px]">
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
                  w-full px-[16px] py-[14px]
                  font-[family-name:var(--font-mono)] text-[14px]
                  text-[var(--color-ink)]
                  bg-[var(--color-paper)]
                  border border-[var(--color-paper-line)]
                  rounded-[12px]
                  outline-none
                  placeholder:text-[var(--color-ink-faint)]
                  focus:border-[var(--color-ink-soft)]
                  focus:shadow-[0_0_0_3px_rgba(27,26,22,0.06)]
                  transition-[border-color,box-shadow] duration-200
                "
              />
              <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[var(--color-ink-soft)] mt-[12px]">
                [Enter] to ask · [Esc] to close
              </p>
            </form>
          </div>
        </>
      )}
    </>
  );
}
