"use client";

// If you add `transform`, `filter`, `backdrop-filter`, or `will-change` to a
// container parent of WOPROverlay, this z-index breaks. Move the overlay to a
// portal or relocate it in the tree.

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { track } from "@vercel/analytics";
import styles from "./wopr.module.css";
import { useWoprAudio } from "./hooks/useWoprAudio";
import { useTypewriter } from "./hooks/useTypewriter";
import { EscIndicator } from "./EscIndicator";
import { BootSequence } from "./phases/BootSequence";
import { TicTacToeBoard } from "./phases/TicTacToeBoard";
import { ScenarioCascade } from "./phases/ScenarioCascade";
import { GlitchBridge } from "./phases/GlitchBridge";
import { WorldMapCanvas, type GeoJsonRoot } from "./phases/WorldMapCanvas";
import { ResolutionScreen } from "./phases/ResolutionScreen";

type Phase =
  | "boot"
  | "game-act1"
  | "game-act2"
  | "cascade"
  | "bridge"
  | "map"
  | "resolution"
  | "aborting"
  | "done";

type Props = {
  trigger: string;
  bucket: "A" | "B" | "C";
  skipBoot: boolean;
  audioCtx: AudioContext | null;
  onDismiss: () => void;
};

const ABORT_TEXT = "SYSTEM OVERRIDE DETECTED...\nABORTING.";

// Phase budgets (ms) — sum ≤ 30s non-interactive per the plan's runtime budget.
// Game Act 2/3 timings live inside TicTacToeBoard; Phase 6 runs its own clock.
const T_BOOT = 5000;
const T_CASCADE = 3000;
const T_BRIDGE = 1000;
const T_MAP = 10000;

export function WOPROverlay({ trigger, bucket, skipBoot, audioCtx, onDismiss }: Props) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(skipBoot ? "game-act2" : "boot");
  const audio = useWoprAudio(audioCtx);
  const dismissCalledRef = useRef(false);

  // Apply / remove site-shell desaturation.
  useEffect(() => {
    const shell = typeof document !== "undefined" ? document.getElementById("site-shell") : null;
    if (!shell) return;
    const prevFilter = shell.style.filter;
    const prevTransition = shell.style.transition;
    shell.style.transition = "filter 800ms ease";
    shell.style.filter = "saturate(0.3)";
    return () => {
      // Animate back to saturate(1), then strip the inline style after the
      // transition fires (or 850ms safety timeout). filter→none is a discrete
      // change and pops; filter→saturate(1) animates cleanly.
      // Guard the safety timeout against React StrictMode's double-mount: only
      // strip if our saturate(1) marker is still the live value. A sibling
      // remount that sets saturate(0.3) again will fail this check.
      shell.style.filter = "saturate(1)";
      let cleared = false;
      const clear = () => {
        if (cleared) return;
        cleared = true;
        shell.removeEventListener("transitionend", clear);
        if (shell.style.filter !== "saturate(1)") return;
        shell.style.filter = prevFilter;
        shell.style.transition = prevTransition;
      };
      shell.addEventListener("transitionend", clear);
      window.setTimeout(clear, 850);
    };
  }, []);

  // Geo data — fetch on mount, hold in ref. Phase 5 reads from this ref;
  // failures fall back to the stylized grid in WorldMapCanvas.
  const geoRef = useRef<{ data: GeoJsonRoot | null; error: boolean }>({
    data: null,
    error: false,
  });
  useEffect(() => {
    let cancelled = false;
    fetch("/wopr/world-110m.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: GeoJsonRoot) => {
        if (cancelled) return;
        geoRef.current = { data, error: false };
      })
      .catch(() => {
        if (cancelled) return;
        geoRef.current = { data: null, error: true };
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Analytics: triggered.
  useEffect(() => {
    track("easter_egg_triggered", { bucket, trigger });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = useCallback(
    (kind: "completed" | "escaped") => {
      if (dismissCalledRef.current) return;
      dismissCalledRef.current = true;
      audio.stopRisingTone();
      if (kind === "completed") {
        track("easter_egg_completed");
      } else {
        track("easter_egg_escaped", { phase });
      }
      onDismiss();
    },
    [audio, phase, onDismiss]
  );

  // ESC handler — fires from any non-done phase.
  useEffect(() => {
    if (phase === "done") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Don't steal ESC from another modal that's layered on top of us.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      e.preventDefault();
      e.stopPropagation();
      if (phase === "aborting") return;
      setPhase("aborting");
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [phase]);

  // Skip-on-any-key during boot.
  useEffect(() => {
    if (phase !== "boot" || reduceMotion) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") return; // ESC is abort, handled above
      e.preventDefault();
      setPhase("game-act1");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, reduceMotion]);

  // Reduced-motion fast path: boot → resolution (skip everything else).
  useEffect(() => {
    if (!reduceMotion) return;
    if (phase === "boot") {
      const t = window.setTimeout(() => setPhase("resolution"), 1200);
      return () => clearTimeout(t);
    }
  }, [reduceMotion, phase]);

  // Audio kicks: rising tone starts on takeover blur.
  const onTakeoverStart = useCallback(() => {
    audio.startRisingTone();
  }, [audio]);

  // Phase transitions (boot → game, etc.)
  const goNext = useCallback((next: Phase) => {
    setPhase(next);
  }, []);

  const onBootDone = useCallback(() => goNext("game-act1"), [goNext]);
  const onGameResolved = useCallback(() => goNext("cascade"), [goNext]);
  const onCascadeDone = useCallback(() => goNext("bridge"), [goNext]);
  const onBridgeDone = useCallback(() => goNext("map"), [goNext]);
  const onMapDone = useCallback(() => goNext("resolution"), [goNext]);

  const initialBoardPhase: "act1-player" | "act2-blur" =
    skipBoot && phase === "game-act2" ? "act2-blur" : "act1-player";

  return (
    <>
      {phase === "boot" && (
        <div className={styles.root} role="dialog" aria-label="WOPR easter egg">
          <BootSequence
            onClick={audio.click}
            onDone={onBootDone}
            reduceMotion={!!reduceMotion}
            totalMs={T_BOOT}
          />
          <EscIndicator />
        </div>
      )}

      {(phase === "game-act1" || phase === "game-act2") && (
        <>
          <TicTacToeBoard
            initialPhase={initialBoardPhase}
            reduceMotion={!!reduceMotion}
            onClick={audio.click}
            onTakeoverStart={onTakeoverStart}
            onResolved={onGameResolved}
          />
          <EscIndicator />
        </>
      )}

      {phase === "cascade" && (
        <div className={styles.root} role="dialog" aria-label="WOPR easter egg">
          <ScenarioCascade
            onClick={audio.click}
            onDone={onCascadeDone}
            reduceMotion={!!reduceMotion}
            totalMs={T_CASCADE}
          />
          <EscIndicator />
        </div>
      )}

      {phase === "bridge" && (
        <>
          <GlitchBridge onDone={onBridgeDone} reduceMotion={!!reduceMotion} totalMs={T_BRIDGE} />
          <EscIndicator />
        </>
      )}

      {phase === "map" && (
        <>
          <WorldMapCanvas
            geoRef={geoRef}
            reduceMotion={!!reduceMotion}
            onDone={onMapDone}
            totalMs={T_MAP}
          />
          <EscIndicator />
        </>
      )}

      {phase === "resolution" && (
        <div className={styles.root} role="dialog" aria-label="WOPR easter egg">
          <ResolutionScreen
            onClick={audio.click}
            onDismiss={() => {
              setPhase("done");
              dismiss("completed");
            }}
            reduceMotion={!!reduceMotion}
          />
          <EscIndicator />
        </div>
      )}

      {phase === "aborting" && (
        <div className={styles.root} role="dialog" aria-label="WOPR aborting">
          <AbortScreen onDone={() => dismiss("escaped")} />
        </div>
      )}
    </>
  );
}

function AbortScreen({ onDone }: { onDone: () => void }) {
  const { displayed, done } = useTypewriter(ABORT_TEXT, { charMs: 22, blankPauseMs: 100 });
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(onDone, 350);
    return () => clearTimeout(t);
  }, [done, onDone]);
  return (
    <div className={styles.terminal}>
      <div className={styles.terminalText}>{displayed}</div>
    </div>
  );
}
