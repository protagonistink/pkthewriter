"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";
import { lightSwitchBus } from "@/components/LightSwitchHost";

type NavigateOpts = {
  titleEl?: HTMLElement | null;
  anchorEl?: HTMLElement | null;
};

let inFlight = false;
let currentTitleEl: HTMLElement | null = null;
let cleanupTimerId: number | null = null;

function hasStartViewTransition(): boolean {
  return typeof document !== "undefined" && typeof document.startViewTransition === "function";
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function clearStaleTitleName() {
  if (currentTitleEl) {
    currentTitleEl.style.viewTransitionName = "";
    currentTitleEl = null;
  }
}

function runCleanup() {
  clearStaleTitleName();
  lightSwitchBus.hide();
  inFlight = false;
  if (cleanupTimerId !== null) {
    window.clearTimeout(cleanupTimerId);
    cleanupTimerId = null;
  }
}

export function useCaseStudyTransition() {
  const router = useRouter();

  const navigate = useCallback(
    (e: ReactMouseEvent, href: string, opts: NavigateOpts = {}) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      if (inFlight) {
        e.preventDefault();
        return;
      }

      if (!hasStartViewTransition() || prefersReducedMotion()) {
        e.preventDefault();
        router.push(href);
        return;
      }

      e.preventDefault();

      // Persist /work scroll position so the back-nav fallback can detect mismatch.
      if (window.location.pathname === "/work") {
        try {
          window.sessionStorage.setItem("workScrollY", String(window.scrollY));
        } catch {
          // sessionStorage can throw in privacy modes — ignore.
        }
      }

      // Case-study → case-study: skip switch overlay entirely, still do title handoff.
      const isCaseStudyToCaseStudy = window.location.pathname.startsWith("/work/");

      clearStaleTitleName();

      const titleEl = opts.titleEl ?? null;
      const titleText = titleEl?.textContent?.trim() ?? "";
      if (titleEl && titleText.length >= 3) {
        titleEl.style.viewTransitionName = "case-study-title";
        currentTitleEl = titleEl;
      }

      inFlight = true;

      if (!isCaseStudyToCaseStudy) {
        lightSwitchBus.show({ state: "on", anchor: opts.anchorEl ?? null });
        // Schedule the flip on the next frame so initial state paints first.
        window.requestAnimationFrame(() => {
          lightSwitchBus.setState("off");
        });
      }

      const startTransition = () => {
        const transition = document.startViewTransition(() => {
          router.push(href);
        });

        cleanupTimerId = window.setTimeout(() => {
          runCleanup();
        }, 800);

        transition.finished.finally(() => {
          runCleanup();
        });
      };

      if (isCaseStudyToCaseStudy) {
        startTransition();
      } else {
        window.setTimeout(startTransition, 90);
      }
    },
    [router],
  );

  return { navigate };
}
