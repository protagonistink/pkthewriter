"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeBoundary() {
  const pathname = usePathname() ?? "/";
  const { theme, tone } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const isForcedDark = pathname.startsWith("/work/");
    root.dataset.theme = isForcedDark ? "dark" : theme;
    root.dataset.tone = tone;
    return () => {
      delete root.dataset.theme;
      delete root.dataset.tone;
    };
  }, [pathname, theme, tone]);

  return null;
}
