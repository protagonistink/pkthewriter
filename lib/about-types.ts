export type Category = "essentials" | "character" | "oddball" | "escape";
export type Mood = "default" | "playful" | "formal";

export type Reply = { text: string; mood?: Mood };

export type Intent = {
  id: string;
  category: Category;
  triggers: string[];
  replies: Reply[];
  followups: string[];
};

export type VisitorTurn = {
  role: "visitor";
  text: string;
  /** Pre-filled in the input (opening thread line 1). */
  prefilled?: boolean;
  /** Auto-typed by the page (subsequent opening visitor lines). */
  auto?: boolean;
};

export type PatrickTurn = {
  role: "patrick";
  text: string;
  /** Intent id if this was resolved from the bank (for read-mode grouping). */
  intentId?: string;
};

export type Exchange = VisitorTurn | PatrickTurn;

export type SessionState = {
  seenIntentIds: Set<string>;
  servedReplyKeys: Set<string>;      // key = `${intentId}:${variantIndex}`
  servedFallbackIndices: Set<number>;
  moodHistory: Mood[];                // last 5
};

export type ReadMode = "chat" | "page";

export type FallbackFile = { fallbacks: { text: string }[] };
export type OpeningFile = { exchanges: Exchange[] };
export type IntentsFile = {
  intents: Intent[];
  links: { email: string; resume: string; work: string };
};
