"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useResumeDrone } from "@/components/landing/ResumeAtmosphere";
import { ResumeWordmarkGrid } from "@/components/landing/ResumeWordmarkGrid";
import { CommandModal } from "@/components/ui/CommandModal";
import { RESUME_OVERLAY_CONTENT, LINKEDIN_URL } from "@/lib/resume-overlay-content";

const UI_SANS = `system-ui, -apple-system, "Inter", sans-serif`;

type Props = {
  onClose?: () => void;
};

export function ResumeOverlay({ onClose }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const { audioEnabled, setAudioEnabled } = useResumeDrone(isDark);

  const content = useMemo(() => RESUME_OVERLAY_CONTENT, []);

  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    setIsNarrow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Black Mirror glitch — fires once or twice while the modal is open, dark mode only
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    if (!isDark) return;
    let cancelled = false;
    const timers: number[] = [];

    const fire = () => {
      if (cancelled) return;
      setGlitching(true);
      timers.push(window.setTimeout(() => setGlitching(false), 520));
    };

    // First glitch: 2–3s after open
    timers.push(window.setTimeout(fire, 2000 + Math.random() * 1000));
    // Maybe a second: 12–22s later (50% chance)
    if (Math.random() < 0.5) {
      timers.push(window.setTimeout(fire, 12000 + Math.random() * 10000));
    }

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [isDark]);

  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  // ── Simple mode toggle — one button, no slash, no physical switch ──────────
  const themeToggle = (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        fontFamily: UI_SANS,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        padding: "6px 14px",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)"}`,
        borderRadius: 4,
        background: "transparent",
        color: "currentColor",
        cursor: "pointer",
        opacity: 0.65,
        transition: "opacity 150ms",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.65")}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );

  const underlineColor = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.28)";

  // ── Row content renderer — multi-item arrays flow into 2 columns ──────────
  const renderContent = (
    value: string | readonly string[],
    isConnection: boolean
  ) => {
    if (isConnection) {
      const borderRest = isDark ? "rgba(255,255,255,0.22)" : "var(--color-accent)";
      const borderHover = isDark ? "rgba(255,255,255,0.40)" : "var(--color-accent)";
      const fillHover = isDark ? "rgba(255,255,255,0.06)" : "rgba(192, 84, 46, 0.08)";

      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", alignItems: "center" }}>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 17,
              color: "inherit",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "baseline",
              gap: 6,
              transition: "opacity 150ms",
              width: "fit-content",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.65")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            LinkedIn
            <span aria-hidden style={{ fontSize: 13, opacity: 0.55 }}>↗</span>
          </a>
          <Link
            href={content.ctas.secondary.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: UI_SANS,
              fontSize: 11,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              textDecoration: "none",
              color: isDark ? "currentColor" : "var(--color-accent)",
              border: `1px solid ${borderRest}`,
              borderRadius: 4,
              padding: "7px 16px",
              background: "transparent",
              transition: "background 150ms, border-color 150ms",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = fillHover;
              el.style.borderColor = borderHover;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.borderColor = borderRest;
            }}
          >
            Download PDF
          </Link>
        </div>
      );
    }

    const lines = Array.isArray(value) ? value : [value];

    if (lines.length >= 4) {
      // Multi-item: flow into 2 columns
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px 16px",
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--color-ink)",
          }}
        >
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontFamily: "var(--font-serif)",
          fontSize: 17,
          lineHeight: 1.4,
          color: "var(--color-ink)",
        }}
      >
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    );
  };

  return (
    <CommandModal
      title="Resume"
      onClose={onClose}
      headerActions={themeToggle}
      aria-label="Resume"
    >
      {/* Client press wall — lives at the top, full-width */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${dividerColor}`,
        }}
      >
        <div
          style={{
            fontFamily: UI_SANS,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            opacity: 0.38,
            marginBottom: 14,
          }}
        >
          Selected clients
        </div>
        <ResumeWordmarkGrid isDark={isDark} />
      </div>

      {/* Rows — 2-column settings layout */}
      <div
        className={glitching ? "cmd-glitch-active" : undefined}
        style={{ padding: "8px 24px 12px" }}
      >
        {content.rows.map((row, index) => {
          const isConnection = row.label === "Connection";
          const label = row.label;
          const value = isDark ? row.dark : row.light;

          return (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: isNarrow ? "1fr" : "160px 1fr",
                alignItems: "start",
                gap: "0 12px",
                padding: "13px 0",
                borderTop: index > 0 ? `1px solid ${dividerColor}` : "none",
              }}
            >
              {/* Col 1 — UI label */}
              <span
                style={{
                  fontFamily: UI_SANS,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                  lineHeight: 1,
                  paddingTop: 3,
                  opacity: 0.45,
                  color: "currentColor",
                }}
              >
                {label}
              </span>
              {/* Col 2 — content */}
              {renderContent(value, isConnection)}
            </div>
          );
        })}
      </div>

      {/* Dark-mode-only audio toggle — slim footer */}
      {isDark && (
        <div
          style={{
            padding: "14px 24px 18px",
            borderTop: `1px solid ${dividerColor}`,
          }}
        >
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-pressed={audioEnabled}
            style={{
              fontFamily: UI_SANS,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              opacity: 0.42,
              transition: "opacity 150ms",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "currentColor",
              padding: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.42")}
          >
            {audioEnabled ? content.audio.on : content.audio.off}
          </button>
        </div>
      )}
    </CommandModal>
  );
}
