export const RESUME_WORDMARK_KEYS = [
  "verizon",
  "att",
  "warnerbros",
  "chevron",
  "airtable",
  "mercedesbenz",
  "toyota",
  "beatsbydre",
  "americanexpress",
  "mpa",
] as const;

export type ResumeWordmarkKey = (typeof RESUME_WORDMARK_KEYS)[number];

export const LINKEDIN_URL = "https://www.linkedin.com/in/patrickkirkland/";

type ResumeRow = {
  label: string;
  /** Label override in dark mode (optional) */
  darkLabel?: string;
  light: string | string[];
  dark: string | string[];
};

export const RESUME_OVERLAY_CONTENT = {
  rows: [
    {
      label: "Experience",
      light: ["20+ years", "Agency-side and brand-side"],
      dark: ["20+ years", "Agency-side and brand-side"],
    },
    {
      label: "Roles",
      light: ["Campaign platforms", "Launch copy", "Narrative strategy", "Scripts", "Decks"],
      dark: ["Campaign platforms", "Launch copy", "Narrative strategy", "Scripts", "Decks"],
    },
    {
      label: "Recognition",
      light: ["ADDYs", "Austin Film", "CES", "#1 iBooks nonfiction", "NYT × RACies Silver"],
      dark: ["ADDYs", "Austin Film", "CES", "#1 iBooks nonfiction", "NYT × RACies Silver"],
    },
    {
      label: "Connection",
      light: "Connect on LinkedIn",
      dark: "LinkedIn",
    },
  ] satisfies ResumeRow[],
  ctas: {
    secondary: {
      label: "Download PDF",
      href: "/resume",
    },
  },
  audio: {
    off: "[ AUDIO: OFF ]",
    on: "[ AUDIO: ON ]",
  },
} as const;
