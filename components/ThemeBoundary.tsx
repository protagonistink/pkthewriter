"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ThemeBoundary() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const root = document.documentElement;
    const isDark = pathname.startsWith("/work");
    const theme = isDark ? "dark" : "light";
    root.dataset.theme = theme;
    return () => {
      delete root.dataset.theme;
    };
  }, [pathname]);

  return null;
}
