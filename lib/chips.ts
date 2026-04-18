export type ChipId = "case-study" | "writing" | "resume" | "pi" | "screenwriter";

export type Chip = {
  id: ChipId;
  label: string;
  href?: string;
  kind: "internal" | "external" | "card";
};

export const CHIPS: Chip[] = [
  { id: "case-study", label: "Show me your best ad", kind: "internal", href: "/work" },
  { id: "writing", label: "Read something short", kind: "internal", href: "/writing" },
  { id: "screenwriter", label: "Are you really a screenwriter?", kind: "internal", href: "/screenwriting" },
  { id: "resume", label: "Get the resume", kind: "internal", href: "/about#resume" },
  { id: "pi", label: "Protagonist Ink?", kind: "card" },
];
