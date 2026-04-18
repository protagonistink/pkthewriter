export type LeadPayload = {
  message?: unknown;
  context?: unknown;
  website?: unknown; // honeypot
};

export type ValidatedLead =
  | { ok: true; message: string; context?: "free-text" | "screenplay-request" | "contact" }
  | { ok: false; error: string };

const MAX = 4000;
const MIN_WORDS = 3;
const ALLOWED_CONTEXTS = new Set(["free-text", "screenplay-request", "contact"]);

export function validateLeadPayload(raw: LeadPayload): ValidatedLead {
  if (raw.website) return { ok: false, error: "honeypot" };
  if (typeof raw.message !== "string") return { ok: false, error: "message-required" };
  const msg = raw.message.trim();
  if (!msg) return { ok: false, error: "message-required" };
  if (msg.length > MAX) return { ok: false, error: "message-too-long" };

  // Minimum-content guard — defense in depth against junk leads.
  // The client-side dispatcher already routes these to clarify mode, but if a
  // direct POST sneaks through we want the server to drop it too.
  const words = msg.split(/\s+/).filter(Boolean);
  const hasQuestion = msg.includes("?");
  if (words.length < MIN_WORDS && !hasQuestion) {
    return { ok: false, error: "message-too-short" };
  }

  const ctx =
    typeof raw.context === "string" && ALLOWED_CONTEXTS.has(raw.context)
      ? (raw.context as "free-text" | "screenplay-request" | "contact")
      : undefined;
  return { ok: true, message: msg, context: ctx };
}
