"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LightSwitch } from "./LightSwitch";

type SwitchState = "on" | "off";

type ShowPayload = {
  state: SwitchState;
  anchor: HTMLElement | null;
};

type HostState = {
  visible: boolean;
  state: SwitchState;
  style: { top: number; left: number };
};

class LightSwitchBus extends EventTarget {
  show(payload: ShowPayload) {
    this.dispatchEvent(new CustomEvent<ShowPayload>("show", { detail: payload }));
  }
  setState(state: SwitchState) {
    this.dispatchEvent(new CustomEvent<SwitchState>("set-state", { detail: state }));
  }
  hide() {
    this.dispatchEvent(new Event("hide"));
  }
}

export const lightSwitchBus = new LightSwitchBus();

const MOBILE_MAX = 820;

function computePosition(anchor: HTMLElement | null): { top: number; left: number } {
  if (typeof window === "undefined") return { top: 16, left: 16 };
  const isMobile = window.innerWidth <= MOBILE_MAX;
  if (isMobile || !anchor) {
    return { top: 16, left: Math.max(window.innerWidth - 24 - 16, 16) };
  }
  const rect = anchor.getBoundingClientRect();
  // Anchor the switch to the top-right of the anchor element, inset 12px.
  const left = Math.min(rect.right - 24 - 12, window.innerWidth - 24 - 8);
  const top = Math.max(rect.top, 8);
  return { top, left };
}

export function LightSwitchHost() {
  const [host, setHost] = useState<HostState>({
    visible: false,
    state: "on",
    style: { top: 0, left: 0 },
  });
  const [onCaseStudy, setOnCaseStudy] = useState(false);

  useEffect(() => {
    const syncPath = () => {
      setOnCaseStudy(window.location.pathname.startsWith("/work/"));
    };
    syncPath();
    window.addEventListener("popstate", syncPath);

    // Next.js App Router replaces history on client navs; poll briefly on each event loop turn.
    const pathObserver = setInterval(syncPath, 250);

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const onShow = (e: Event) => {
      if (reduced) return;
      const detail = (e as CustomEvent<ShowPayload>).detail;
      setHost({
        visible: true,
        state: detail.state,
        style: computePosition(detail.anchor),
      });
    };
    const onSetState = (e: Event) => {
      const detail = (e as CustomEvent<SwitchState>).detail;
      setHost((prev) => ({ ...prev, state: detail }));
    };
    const onHide = () => {
      setHost((prev) => ({ ...prev, visible: false }));
    };

    lightSwitchBus.addEventListener("show", onShow);
    lightSwitchBus.addEventListener("set-state", onSetState);
    lightSwitchBus.addEventListener("hide", onHide);

    return () => {
      window.removeEventListener("popstate", syncPath);
      clearInterval(pathObserver);
      lightSwitchBus.removeEventListener("show", onShow);
      lightSwitchBus.removeEventListener("set-state", onSetState);
      lightSwitchBus.removeEventListener("hide", onHide);
    };
  }, []);

  if (!host.visible || onCaseStudy || typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: host.style.top,
        left: host.style.left,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <LightSwitch state={host.state} />
    </div>,
    document.body,
  );
}
