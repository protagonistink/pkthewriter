"use client";

import { useEffect, useRef, useState } from "react";

const TRANSITION_MS = 260;
const SUGGESTIONS = ["Recent work", "Availability", "Rates"];

type Props = {
  email: string;
  resumeUrl?: string;
  linkedinUrl?: string;
};

/**
 * Bottom-right FAB persistent on /about. Reconnects the page to the site's
 * chat DNA: tapping opens a small panel with a chat input that submits to
 * /?q=<encoded>, plus Resume and LinkedIn quick-actions. Mobile: full-width
 * bottom sheet.
 */
export function AboutFab({ email, resumeUrl, linkedinUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openPanel() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
  }

  function closePanel() {
    setEntered(false);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setValue("");
      triggerRef.current?.focus();
    }, TRANSITION_MS);
  }

  // Focus trap + Esc + focus on open
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function navigateWith(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    window.location.href = `/?q=${encodeURIComponent(trimmed)}`;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigateWith(value);
  }

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Ask Patrick"
        aria-expanded={open}
        aria-controls="about-fab-panel"
        onClick={openPanel}
        className={`
          fixed bottom-[24px] right-[24px] z-40
          flex items-center gap-[10px]
          pl-[14px] pr-[18px] py-[10px]
          rounded-full
          bg-[var(--color-dark-panel)] text-[var(--color-dark-ink)]
          border border-[var(--color-dark-line)]
          shadow-[0_12px_32px_rgba(0,0,0,0.5)]
          hover:border-[var(--color-accent)] hover:text-[var(--color-dark-ink)]
          transition-[transform,border-color,opacity] duration-200
          max-[640px]:bottom-[16px] max-[640px]:right-[16px]
          ${open ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"}
        `}
      >
        <span
          aria-hidden="true"
          className="about-pulse-dot inline-block w-[7px] h-[7px] rounded-full bg-[var(--color-accent)]"
          style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
        />
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em]">
          Ask Patrick
        </span>
      </button>

      {open && (
        <>
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close panel"
            tabIndex={-1}
            onClick={closePanel}
            style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            className={`
              fixed inset-0 z-40 cursor-default
              bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px]
              transition-opacity ease-out
              ${entered ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Panel */}
          <div
            ref={panelRef}
            id="about-fab-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Ask Patrick"
            style={{ transitionDuration: `${TRANSITION_MS}ms` }}
            className={`
              fixed z-50 bottom-[24px] right-[24px]
              w-[360px] max-w-[calc(100vw-48px)]
              bg-[var(--color-dark-panel)] text-[var(--color-dark-ink)]
              border border-[var(--color-dark-line)]
              rounded-[20px]
              shadow-[0_28px_80px_rgba(0,0,0,0.6)]
              origin-bottom-right
              transition-[opacity,transform] ease-out
              ${entered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[0.94]"}
              max-[640px]:left-[12px] max-[640px]:right-[12px] max-[640px]:bottom-[12px] max-[640px]:w-auto
              max-[640px]:rounded-[22px]
            `}
          >
            <div className="flex items-center justify-between px-[20px] pt-[16px] pb-[8px]">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-dark-ink-soft)]">
                ask patrick anything
              </span>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close"
                className="
                  w-[26px] h-[26px] rounded-full
                  flex items-center justify-center
                  text-[var(--color-dark-ink-soft)] hover:text-[var(--color-dark-ink)]
                  hover:bg-[rgba(255,255,255,0.04)]
                  transition-colors
                "
              >
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={submit} autoComplete="off" className="px-[20px] pb-[16px]">
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="/ ask me anything"
                aria-label="Ask Patrick"
                className="
                  w-full px-[14px] py-[12px]
                  font-[family-name:var(--font-mono)] text-[13px]
                  text-[var(--color-dark-ink)]
                  bg-[var(--color-dark-bg)]
                  border border-[var(--color-dark-line)]
                  rounded-[10px]
                  outline-none
                  placeholder:text-[var(--color-dark-ink-soft)]
                  focus:border-[var(--color-accent)]
                  focus:shadow-[0_0_0_3px_rgba(192,84,46,0.14)]
                  transition-[border-color,box-shadow] duration-200
                "
              />
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[var(--color-dark-ink-soft)] mt-[10px]">
                [Enter] to ask · [Esc] to close
              </p>
            </form>

            <div className="px-[20px] pb-[14px] flex flex-wrap gap-[6px]">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => navigateWith(s)}
                  className="
                    font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em]
                    text-[var(--color-dark-ink-mid)]
                    border border-[var(--color-dark-line)]
                    rounded-full px-[10px] py-[5px]
                    hover:text-[var(--color-dark-ink)] hover:border-[var(--color-accent)]
                    transition-colors
                  "
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="border-t border-[var(--color-dark-line)] px-[20px] py-[12px] flex flex-col gap-[8px]">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-between
                    font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em]
                    text-[var(--color-dark-ink-mid)]
                    hover:text-[var(--color-dark-ink)]
                    transition-colors
                  "
                >
                  <span>↓ download resume</span>
                  <span aria-hidden="true">pdf</span>
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-between
                    font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em]
                    text-[var(--color-dark-ink-mid)]
                    hover:text-[var(--color-dark-ink)]
                    transition-colors
                  "
                >
                  <span>↗ open linkedin</span>
                  <span aria-hidden="true">.com</span>
                </a>
              )}
              <a
                href={`mailto:${email}`}
                className="
                  flex items-center justify-between
                  font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em]
                  text-[var(--color-dark-ink-mid)]
                  hover:text-[var(--color-dark-ink)]
                  transition-colors
                "
              >
                <span>✉ email direct</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="border-t border-[var(--color-dark-line)] px-[20px] py-[10px] flex items-center gap-[8px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-dark-ink-soft)]">
              <span
                aria-hidden="true"
                className="about-pulse-dot inline-block w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              accepting projects · Q3 2026
            </div>
          </div>
        </>
      )}
    </>
  );
}
