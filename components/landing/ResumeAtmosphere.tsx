"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_KEY = "resume-overlay-audio";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export function useResumeDrone(active: boolean) {
  const reducedMotion = usePrefersReducedMotion();
  const [audioEnabled, setAudioEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(AUDIO_KEY) === "on";
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const oscillatorRefs = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(AUDIO_KEY, audioEnabled ? "on" : "off");
  }, [audioEnabled]);

  useEffect(() => {
    if (!audioEnabled || typeof window === "undefined") return;
    if (audioContextRef.current) return;

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const context = new AudioCtx();
    const master = context.createGain();
    const lfoGain = context.createGain();
    const lfo = context.createOscillator();
    const oscA = context.createOscillator();
    const oscB = context.createOscillator();

    master.gain.value = 0;
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.01;
    oscA.frequency.value = 41;
    oscB.frequency.value = 55;
    oscA.type = "sine";
    oscB.type = "triangle";

    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    oscA.connect(master);
    oscB.connect(master);
    master.connect(context.destination);

    lfo.start();
    oscA.start();
    oscB.start();

    audioContextRef.current = context;
    gainRef.current = master;
    lfoGainRef.current = lfoGain;
    oscillatorRefs.current = [lfo, oscA, oscB];

    return () => {
      oscillatorRefs.current.forEach((oscillator) => oscillator.stop());
      oscillatorRefs.current = [];
      void context.close();
      audioContextRef.current = null;
      gainRef.current = null;
      lfoGainRef.current = null;
    };
  }, [audioEnabled]);

  useEffect(() => {
    const context = audioContextRef.current;
    const gainNode = gainRef.current;
    if (!context || !gainNode) return;

    const now = context.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    const nextLevel = audioEnabled && active ? 0.028 : 0;
    if (reducedMotion) {
      gainNode.gain.setValueAtTime(nextLevel, now);
    } else {
      gainNode.gain.linearRampToValueAtTime(nextLevel, now + 1.2);
    }
    if (audioEnabled && context.state === "suspended") {
      void context.resume();
    }
  }, [active, audioEnabled, reducedMotion]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    function onVisibilityChange() {
      const context = audioContextRef.current;
      const gainNode = gainRef.current;
      if (!context || !gainNode) return;
      const now = context.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      if (document.hidden) {
        gainNode.gain.setValueAtTime(0, now);
        return;
      }
      if (audioEnabled && active) {
        gainNode.gain.setValueAtTime(reducedMotion ? 0.028 : 0.018, now);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [active, audioEnabled, reducedMotion]);

  return { audioEnabled, setAudioEnabled, reducedMotion };
}

type AtmosphereProps = {
  active: boolean;
  children: React.ReactNode;
};

export function ResumeAtmosphere({ active, children }: AtmosphereProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [scannerTop, setScannerTop] = useState(0);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scannerDuration, setScannerDuration] = useState(10000);

  useEffect(() => {
    if (!active || reducedMotion || typeof window === "undefined") return;

    let cancelled = false;
    const timers: number[] = [];

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    async function run() {
      while (!cancelled) {
        await wait(randomBetween(4000, 11000));
        if (cancelled) return;

        const duration = randomBetween(9000, 14000);
        const shouldAbort = Math.random() < 0.25;
        const end = shouldAbort ? randomBetween(24, 72) : 104;

        setScannerDuration(duration);
        setScannerVisible(false);
        setScannerTop(0);

        schedule(() => {
          setScannerVisible(true);
          schedule(() => {
            setScannerTop(end);
          }, 40);
        }, 0);

        await wait(Math.round(duration * (end / 104)));
        if (cancelled) return;

        setScannerVisible(false);
        await wait(shouldAbort ? randomBetween(5000, 9000) : 900);
      }
    }

    void run();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active, reducedMotion]);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {children}
      {!reducedMotion ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 h-[88px]"
          style={{
            top: `${scannerTop}%`,
            opacity: scannerVisible ? 0.95 : 0,
            transition: `top ${scannerDuration}ms linear, opacity 420ms ease`,
            background:
              "linear-gradient(180deg, rgba(255,91,31,0) 0%, rgba(255,91,31,0.2) 28%, rgba(255,91,31,0.9) 56%, rgba(255,91,31,0.12) 100%)",
            mixBlendMode: "color-dodge",
            filter: "blur(4px)",
          }}
        />
      ) : null}
    </div>
  );
}
