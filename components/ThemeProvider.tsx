"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type Tone = "professional" | "unfiltered";

type ThemeContextValue = {
  theme: Theme;
  tone: Tone;
  setTheme: (theme: Theme) => void;
  setTone: (tone: Tone) => void;
  toggle: () => void;
};

const THEME_KEY = "portfolio-theme";
const TONE_KEY = "portfolio-tone";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = window.sessionStorage.getItem(THEME_KEY);
    return storedTheme === "dark" ? "dark" : "light";
  });
  const [tone, setToneState] = useState<Tone>(() => {
    if (typeof window === "undefined") return "professional";
    const storedTone = window.sessionStorage.getItem(TONE_KEY);
    return storedTone === "unfiltered" ? "unfiltered" : "professional";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(TONE_KEY, tone);
  }, [tone]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const setTone = useCallback((nextTone: Tone) => {
    setToneState(nextTone);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      setToneState(nextTheme === "dark" ? "unfiltered" : "professional");
      return nextTheme;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, tone, setTheme, setTone, toggle }),
    [theme, tone, setTheme, setTone, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return context;
}
