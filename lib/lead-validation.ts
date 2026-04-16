export type LeadPayload = {
  message?: unknown;
  context?: unknown;
  website?: unknown; // honeypot
};

export type ValidatedLead =
  | { ok: true; message: string; context?: "free-text" | "screenplay-request" | "contact" }
  | { ok: false; error: string };

const MAX = 4000;
const ALLOWED_CONTEXTS = new Set(["free-text", "screenplay-request", "contact"]);

export function validateLeadPayload(raw: LeadPayload): ValidatedLead {
  if (raw.website) return { ok: false, error: "honeypot" };
  if (typeof raw.message !== "string") return { ok: false, error: "message-required" };
  const msg = raw.message.trim();
  if (!msg) return { ok: false, error: "message-required" };
  if (msg.length > MAX) return { ok: false, error: "message-too-long" };
  const ctx =
    typeof raw.context === "string" && ALLOWED_CONTEXTS.has(raw.context)
      ? (raw.context as "free-text" | "screenplay-request" | "contact")
      : undefined;
  return { ok: true, message: msg, context: ctx };
}
