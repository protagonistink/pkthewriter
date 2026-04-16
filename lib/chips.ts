export type ChipId = "case-study" | "writing" | "resume" | "pi" | "screenwriter";

export type Chip = {
  id: ChipId;
  label: string;
  href?: string;
  kind: "internal" | "external" | "card";
};

export const CHIPS: Chip[] = [
  { id: "case-study", label: "Show me a case study", kind: "internal", href: "/work" },
  { id: "writing", label: "Read my writing", kind: "internal", href: "/writing" },
  { id: "resume", label: "Get my resume", kind: "internal", href: "/about" },
  { id: "pi", label: "Looking for Protagonist Ink?", kind: "card" },
  { id: "screenwriter", label: "Aren't you a screenwriter?", kind: "internal", href: "/screenwriting" },
];
