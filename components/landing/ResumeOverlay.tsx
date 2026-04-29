"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LightSwitch } from "@/components/LightSwitch";
import { useTheme } from "@/components/ThemeProvider";
import { useResumeDrone } from "@/components/landing/ResumeAtmosphere";
import { ResumeWordmarkGrid } from "@/components/landing/ResumeWordmarkGrid";
import { RESUME_OVERLAY_CONTENT } from "@/lib/resume-overlay-content";

type Props = {
  onClose?: () => void;
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ResumeOverlay({ onClose }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const { audioEnabled, setAudioEnabled, reducedMotion } = useResumeDrone(isDark);
  const [voltageDrop, setVoltageDrop] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isDark || reducedMotion || typeof window === "undefined") return;

    let cancelled = false;
    const timers: number[] = [];

    const tick = () => {
      if (cancelled) return;
      const nextWait = randomBetween(8000, 12000);
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        setVoltageDrop(true);
        const resetTimer = window.setTimeout(() => {
          setVoltageDrop(false);
          tick();
        }, 40);
        timers.push(resetTimer);
      }, nextWait);
      timers.push(timer);
    };

    tick();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isDark, reducedMotion]);

  const content = useMemo(() => RESUME_OVERLAY_CONTENT, []);

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 transition-colors duration-700 ${isDark ? "bg-black/40" : "bg-[#F5F2EB]/40"}`}
      onClick={() => onClose?.()}
    >
      <article
        className="relative w-full max-w-3xl overflow-hidden rounded-[20px] text-left font-[family-name:var(--font-serif)]"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 90,
          background: isDark ? "rgba(15, 14, 12, 0.78)" : "rgba(245, 242, 235, 0.78)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          boxShadow: isDark
            ? "0 32px 64px -24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)"
            : "0 32px 64px -24px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.32)",
          color: "var(--color-ink)",
          filter: voltageDrop ? "brightness(0.6)" : "brightness(1)",
        }}
      >
        <div
          className="flex items-center justify-between gap-[18px] border-b px-[24px] py-[20px] md:px-[28px] md:py-[22px]"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
        >
          <div className="flex flex-col gap-[4px]">
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
              {content.eyebrow}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
              {content.headerMeta}
            </span>
          </div>

          <div className="flex items-center gap-[12px] md:gap-[18px]">
            <button
              type="button"
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center rounded-full p-1"
              style={{
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                boxShadow: isDark
                  ? "inset 0 1px 3px rgba(0,0,0,0.3)"
                  : "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <span
                className="rounded-full px-[14px] py-[6px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] transition-all md:px-[16px]"
                style={{
                  background: !isDark ? "#ffffff" : "transparent",
                  color: !isDark ? "#111111" : "var(--color-ink-faint)",
                  boxShadow: !isDark ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {content.toneLabels.light}
              </span>
              <span
                className="rounded-full px-[14px] py-[6px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] transition-all md:px-[16px]"
                style={{
                  background: isDark ? "#27272a" : "transparent",
                  color: isDark ? "#ffffff" : "var(--color-ink-faint)",
                  boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
                }}
              >
                {content.toneLabels.dark}
              </span>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label={isDark ? "Tone unfiltered" : "Tone professional"}
              onClick={toggle}
              className="grid h-[40px] w-[24px] place-items-center"
            >
              <LightSwitch state={isDark ? "on" : "off"} />
            </button>

            <button
              type="button"
              onClick={() => onClose?.()}
              className="grid h-[24px] w-[24px] place-items-center text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-accent)]"
              aria-label="Close resume"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="border-b px-[24px] py-[20px] md:px-[28px] md:py-[24px]"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
        >
          <p className="m-0 max-w-[34ch] text-[28px] leading-[1.1] tracking-[-0.02em] md:text-[34px]">
            {isDark ? content.summary.dark : content.summary.light}
          </p>
        </div>

        <div className="px-[24px] py-[18px] md:px-[28px] md:py-[20px]">
          {content.rows.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-1 gap-[6px] py-[18px] md:grid-cols-[180px_1fr] md:gap-[10px] ${index > 0 ? "border-t" : ""}`}
              style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }}
            >
              <span className="font-[family-name:var(--font-serif)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)] opacity-60">
                {row.label}
              </span>
              <div className="text-[18px] leading-[1.55] text-[var(--color-ink)] md:text-[17px]">
                <span>{isDark ? row.dark : row.light}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="border-t border-b px-[24px] py-[20px] md:px-[28px] md:py-[22px]"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
        >
          <div className="mb-[14px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
            {isDark ? content.gridCaption.dark : content.gridCaption.light}
          </div>
          <ResumeWordmarkGrid isDark={isDark} />
        </div>

        <div
          className="px-[24px] py-[24px] md:px-[28px]"
          style={{
            background: isDark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.22)",
          }}
        >
          <div className="flex flex-wrap items-center gap-x-[18px] gap-y-[14px]">
            <Link
              href={content.ctas.primary.href}
              className="inline-flex items-center justify-center rounded-[3px] px-[22px] py-[12px] text-[15px] font-medium transition-opacity hover:opacity-85"
              style={{
                background: isDark ? "#f4f4f5" : "#18181b",
                color: isDark ? "#18181b" : "#f4f4f5",
              }}
            >
              {isDark ? content.ctas.primary.dark : content.ctas.primary.light}
            </Link>
            <a
              href={content.ctas.secondary.href}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              style={{ textDecorationColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
            >
              {content.ctas.secondary.label}
            </a>
          </div>

          <div
            className="mt-[22px] border-t pt-[18px]"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }}
          >
            <Link
              href={content.ctas.tertiary.href}
              className={`text-[14px] transition-opacity hover:opacity-100 ${isDark ? "italic" : ""}`}
              style={{
                color: isDark ? "rgba(255,91,31,0.9)" : "var(--color-ink)",
                opacity: isDark ? 0.95 : 0.62,
              }}
            >
              {isDark ? content.ctas.tertiary.dark : content.ctas.tertiary.light}
            </Link>
          </div>

          {isDark ? (
            <div className="mt-[18px]">
              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                aria-pressed={audioEnabled}
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-accent)]"
              >
                {audioEnabled ? content.audio.on : content.audio.off}
              </button>
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
}
