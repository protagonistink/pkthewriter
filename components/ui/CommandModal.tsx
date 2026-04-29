"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/ThemeProvider";

// ─── Aura ────────────────────────────────────────────────────────────────────

function LightAura() {
  return (
    <div
      aria-hidden="true"
      className="cmd-aura pointer-events-none absolute"
      style={{
        width: 1400,
        height: 1400,
        top: "50%",
        left: "50%",
        marginTop: -700,
        marginLeft: -700,
        borderRadius: "50%",
        animation: "cmd-aura-enter 400ms ease both, cmd-aura-spin 24s linear infinite",
        animationDelay: "0ms, 0ms",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse 55% 80% at 45% 52%, rgba(192, 84, 46, 0.48) 0%, rgba(192, 84, 46, 0.14) 45%, transparent 70%)",
          opacity: 0.30,
        }}
      />
    </div>
  );
}

// Two spikes — Fincher, not cartoon. Short enough init delay to guarantee a hit.
// Coordinates in 1400×1400 space
const SPIKE_DEFS: { points: string; cycle: number; initDelay: number }[] = [
  {
    points: "240,60 275,150 252,150 298,268 270,268 330,430",
    cycle: 5000,
    initDelay: 1500,
  },
  {
    points: "1140,110 1092,220 1118,220 1065,345 1090,345 1028,500",
    cycle: 9000,
    initDelay: 4000,
  },
];

function VoltageSvg({
  points,
  cycle,
  initDelay,
}: {
  points: string;
  cycle: number;
  initDelay: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timerId: number;

    const schedule = () => {
      // Stagger so they never fire simultaneously
      const jitter = Math.random() * 1200 - 600;
      timerId = window.setTimeout(() => {
        if (cancelled) return;
        setVisible(true);
        // Very brief flash — 40–65ms
        timerId = window.setTimeout(() => {
          if (cancelled) return;
          setVisible(false);
          schedule();
        }, 40 + Math.random() * 25);
      }, cycle + jitter);
    };

    timerId = window.setTimeout(schedule, initDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [cycle, initDelay]);

  if (!visible) return null;

  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="rgba(255, 228, 195, 0.60)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DarkAura() {
  return (
    <div
      aria-hidden="true"
      className="cmd-aura pointer-events-none absolute"
      style={{
        width: 1400,
        height: 1400,
        top: "50%",
        left: "50%",
        marginTop: -700,
        marginLeft: -700,
        borderRadius: "50%",
        overflow: "visible",
        animation: "cmd-aura-enter 400ms ease both",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(130, 8, 8, 0.55) 0%, rgba(160, 16, 16, 0.22) 42%, transparent 68%)",
          animation: "cmd-aura-pulse 4s ease-in-out infinite",
        }}
      />
      {SPIKE_DEFS.map((def, i) => (
        <VoltageSvg key={i} points={def.points} cycle={def.cycle} initDelay={def.initDelay} />
      ))}
    </div>
  );
}

// ─── Corner Brackets ─────────────────────────────────────────────────────────

const BRACKET_POS: Record<"tl" | "tr" | "br" | "bl", CSSProperties> = {
  tl: { top: -14, left: -14 },
  tr: { top: -14, right: -14 },
  br: { bottom: -14, right: -14 },
  bl: { bottom: -14, left: -14 },
};
const BRACKET_ROTATION = { tl: 0, tr: 90, br: 180, bl: 270 };
const BRACKET_DELAY_INDEX = { tl: 0, tr: 1, br: 2, bl: 3 };

function CornerBracket({
  pos,
  isDark,
}: {
  pos: "tl" | "tr" | "br" | "bl";
  isDark: boolean;
}) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    if (!isDark) return;
    let cancelled = false;
    let timerId: number;

    const schedule = () => {
      timerId = window.setTimeout(() => {
        if (cancelled) return;
        setFlicker(true);
        timerId = window.setTimeout(() => {
          if (cancelled) return;
          setFlicker(false);
          schedule();
        }, 80);
      }, 4000 + Math.random() * 1200);
    };

    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [isDark]);

  const delayIndex = BRACKET_DELAY_INDEX[pos];
  const drawDelay = 520 + delayIndex * 50;

  const color = isDark
    ? flicker
      ? "rgba(255, 240, 220, 1.0)"
      : "rgba(255, 240, 220, 0.55)"
    : "rgba(27, 26, 22, 0.28)";

  const armStyle = (axis: "h" | "v", delay: number): CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    ...(axis === "h"
      ? { width: 24, height: 1, transformOrigin: "left center" }
      : { width: 1, height: 24, transformOrigin: "top center" }),
    background: color,
    transition: "background 80ms",
    animation: `${axis === "h" ? "cmd-bracket-h" : "cmd-bracket-v"} 250ms ease-out ${delay}ms both`,
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        ...BRACKET_POS[pos],
        width: 24,
        height: 24,
        transform: `rotate(${BRACKET_ROTATION[pos]}deg)`,
        pointerEvents: "none",
      }}
    >
      <div className="cmd-bracket-h" style={armStyle("h", drawDelay)} />
      <div className="cmd-bracket-v" style={armStyle("v", drawDelay)} />
    </div>
  );
}

// ─── CommandModal ─────────────────────────────────────────────────────────────

const UI_SANS = `system-ui, -apple-system, "Inter", sans-serif`;

type Props = {
  title: string;
  onClose?: () => void;
  /** Rendered between title block and × button */
  headerActions?: ReactNode;
  children: ReactNode;
  "aria-label"?: string;
};

export function CommandModal({
  title,
  onClose,
  headerActions,
  children,
  "aria-label": ariaLabel,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const glassStyle: CSSProperties = isDark
    ? {
        background: "rgba(10, 9, 8, 0.80)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255, 255, 255, 0.07)",
          "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
          "0 32px 64px -16px rgba(0, 0, 0, 0.70)",
          "0 12px 24px -8px rgba(0, 0, 0, 0.50)",
        ].join(", "),
      }
    : {
        background: "rgba(245, 240, 230, 0.68)",
        backdropFilter: "blur(48px) saturate(180%)",
        WebkitBackdropFilter: "blur(48px) saturate(180%)",
        boxShadow: [
          "inset 0 1px 0 rgba(255, 255, 255, 0.85)",
          "inset 0 0 0 1px rgba(255, 255, 255, 0.45)",
          "0 16px 50px rgba(0, 0, 0, 0.08)",
        ].join(", "),
      };

  const dividerColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  if (!mounted) return null;

  return createPortal(
    // Backdrop — blurs the page so the hero copy behind it is illegible
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 88,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 80,
        paddingBottom: 200,
        paddingLeft: 16,
        paddingRight: 16,
        background: isDark ? "rgba(0, 0, 0, 0.45)" : "rgba(240, 236, 226, 0.55)",
        backdropFilter: "blur(28px) saturate(120%)",
        WebkitBackdropFilter: "blur(28px) saturate(120%)",
      }}
      onClick={() => onClose?.()}
    >
      {/* Modal wrapper */}
      <div
        ref={modalRef}
        className="cmd-modal-wrapper"
        style={{
          position: "relative",
          zIndex: 90,
          width: "100%",
          maxWidth: "48rem",
          animation: "cmd-modal-enter 300ms cubic-bezier(0.16, 1, 0.3, 1) 200ms both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Aura — inside wrapper so it only glows behind the modal, not the full backdrop */}
        {isDark ? <DarkAura /> : <LightAura />}

        <article
          aria-label={ariaLabel ?? title}
          style={{
            ...glassStyle,
            borderRadius: 24,
            overflow: "hidden",
            color: "var(--color-ink)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100dvh - 280px)",
          }}
        >
          {/* Header — all UI_SANS, pinned */}
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              padding: "18px 24px",
              borderBottom: `1px solid ${dividerColor}`,
            }}
          >
            <span
              style={{
                fontFamily: UI_SANS,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                lineHeight: 1,
                opacity: 0.5,
              }}
            >
              {title}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {headerActions}
              <button
                type="button"
                onClick={() => onClose?.()}
                aria-label="Close"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 28,
                  height: 28,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "currentColor",
                  padding: 0,
                  opacity: 0.40,
                  transition: "opacity 150ms",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.40")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body — scrolls independently */}
          <div style={{ overflowY: "auto", flex: "1 1 auto", minHeight: 0 }}>
            {children}
          </div>
        </article>

        {/* Corner brackets */}
        <CornerBracket pos="tl" isDark={isDark} />
        <CornerBracket pos="tr" isDark={isDark} />
        <CornerBracket pos="br" isDark={isDark} />
        <CornerBracket pos="bl" isDark={isDark} />
      </div>
    </div>,
    document.body
  );
}
