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
  light: string;
  dark: string;
  closer?: string;
};

export const RESUME_OVERLAY_CONTENT = {
  eyebrow: "System Profile",
  headerMeta: "Abridged CV · Recruiter-Safe",
  summary: {
    light: "20+ years building campaigns, launches, decks, scripts, and the language around them.",
    dark: "20+ years building campaigns, launches, decks, scripts, and the language around them.",
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
      label: "Uptime",
      light: "Ogilvy → Time Warner Cable → Verizon → Integer → Elephant SF → independent.",
      dark: "Ogilvy. Time Warner Cable. Verizon. Integer. Elephant SF. Independent.",
    },
    {
      label: "Core Executables",
      light: "Campaign platforms. Launch copy. Narrative strategy. Scripts. Decks. Founder and brand messaging.",
      dark: "Campaign platforms. Launch copy. Narrative strategy. Scripts. Decks. Founder and brand messaging.",
    },
    {
      label: "Diagnostics",
      light: "ADDYs · Austin Film · CES · #1 iBooks nonfiction · NYT × RACies Silver",
      dark: "ADDYs · Austin Film · CES · #1 iBooks nonfiction · NYT × RACies Silver",
    },
  ] satisfies ResumeRow[],
  ctas: {
    primary: {
      light: "Get the one-page PDF →",
      dark: "Get the one-page PDF →",
      href: "/resume",
    },
    secondary: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/patrickkirkland/",
    },
    tertiary: {
      light: "Read the longer version →",
      dark: "Read the longer version →",
      href: "/about",
    },
  },
  audio: {
    off: "[ AUDIO: OFF ]",
    on: "[ AUDIO: ON ]",
  },
} as const;
