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

type ResumeRow = {
  label: string;
  light: string | string[];
  dark: string | string[];
  closer?: string;
};

export const RESUME_OVERLAY_CONTENT = {
  eyebrow: "Writer Settings",
  headerMeta: "Abridged CV · Recruiter-Safe",
  summary: {
    light: ["Writer", "Creative Director", "Brand Storyteller"],
    dark: ["Writer", "Creative Director", "Brand Storyteller"],
  },
  toneLabels: {
    light: "Light Mode",
    dark: "Dark Mode",
  },
  gridCaption: {
    light: "Selected clients.",
    dark: "Selected clients.",
  },
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
      label: "Billing",
      light: "Yes please.",
      dark: "Worth it.",
    },
    {
      label: "Notifications",
      light: "Connect on LinkedIn",
      dark: "Find me on LinkedIn",
    },
  ] satisfies ResumeRow[],
  ctas: {
    primary: {
      light: "Learn more →",
      dark: "Want to know? →",
      href: "/about",
    },
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
