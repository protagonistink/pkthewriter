"use client";

import { useEffect, useRef } from "react";

/**
 * Construct the AudioContext synchronously inside a trusted user-gesture frame
 * (the ChatBar form submit). The instance survives the setState boundary and
 * Bucket B's setTimeout because it's already constructed. Lazy-constructing
 * inside useEffect on overlay mount would break the gesture chain (Safari).
 */
export function createWoprAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    return new Ctor();
  } catch {
    return null;
  }
}

type AudioApi = {
  click: () => void;
  startRisingTone: () => void;
  stopRisingTone: () => void;
};

const NOOP_API: AudioApi = {
  click: () => {},
  startRisingTone: () => {},
  stopRisingTone: () => {},
};

export function useWoprAudio(ctx: AudioContext | null): AudioApi {
  const apiRef = useRef<AudioApi>(NOOP_API);
  const risingRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    if (!ctx) {
      apiRef.current = NOOP_API;
      return;
    }
    if (ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }

    const click = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(2000, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
      } catch {
        // ignore — audio is non-critical
      }
    };

    const startRisingTone = () => {
      if (risingRef.current) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 6);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 6.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 7);
        risingRef.current = { osc, gain };
      } catch {
        // ignore
      }
    };

    const stopRisingTone = () => {
      const r = risingRef.current;
      if (!r) return;
      try {
        r.gain.gain.cancelScheduledValues(ctx.currentTime);
        r.gain.gain.setValueAtTime(r.gain.gain.value, ctx.currentTime);
        r.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        r.osc.stop(ctx.currentTime + 0.18);
      } catch {
        // ignore
      }
      risingRef.current = null;
    };

    apiRef.current = { click, startRisingTone, stopRisingTone };

    return () => {
      // Kill switch — stop any active oscillator, then close the context so
      // re-triggers don't stack live AudioContexts (Safari throttles after a
      // handful of leaked instances).
      const r = risingRef.current;
      if (r) {
        try { r.osc.stop(); } catch { /* ignore */ }
        risingRef.current = null;
      }
      if (ctx.state !== "closed") {
        void ctx.close().catch(() => {});
      }
      apiRef.current = NOOP_API;
    };
  }, [ctx]);

  return {
    click: () => apiRef.current.click(),
    startRisingTone: () => apiRef.current.startRisingTone(),
    stopRisingTone: () => apiRef.current.stopRisingTone(),
  };
}
