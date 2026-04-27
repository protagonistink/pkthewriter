"use client";

import { useEffect } from "react";
import { lightSwitchBus } from "@/components/LightSwitchHost";

const SCROLL_MISMATCH_PX = 120;

export function CaseStudyTransitions() {
  useEffect(() => {
    document.body.dataset.route = "case-study";
    return () => {
      if (document.body.dataset.route === "case-study") {
        delete document.body.dataset.route;
      }
    };
  }, []);

  useEffect(() => {
    const onPop = () => {
      if (typeof document.startViewTransition !== "function") return;
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Determine whether to run the light-switch reverse or the crossfade fallback.
      // We can't reliably know the destination pathname during popstate (the history
      // entry hasn't fully resolved), so we read it synchronously after the next tick.
      window.requestAnimationFrame(() => {
        const destPath = window.location.pathname;
        const returningToWork = destPath === "/work";
        let useSwitch = true;

        if (returningToWork) {
          try {
            const stored = window.sessionStorage.getItem("workScrollY");
            if (stored !== null) {
              const expected = parseInt(stored, 10);
              if (!Number.isNaN(expected) && Math.abs(window.scrollY - expected) > SCROLL_MISMATCH_PX) {
                useSwitch = false;
                document.body.dataset.transition = "back-crossfade";
              }
            }
          } catch {
            // sessionStorage can throw — just use the switch.
          }
        }

        // Mount the switch in "off" state and flip to "on" for paper-toned destinations.
        const destIsPaper = returningToWork || destPath === "/" || destPath === "/about";
        if (useSwitch && destIsPaper) {
          lightSwitchBus.show({ state: "off", anchor: null });
          window.requestAnimationFrame(() => {
            lightSwitchBus.setState("on");
          });
        }

        const transition = document.startViewTransition(() => {});
        transition.finished.finally(() => {
          lightSwitchBus.hide();
          delete document.body.dataset.transition;
        });
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return null;
}
