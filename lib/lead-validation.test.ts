import { describe, it, expect } from "vitest";
import { validateLeadPayload } from "./lead-validation";

describe("validateLeadPayload", () => {
  it("accepts a well-formed message", () => {
    expect(validateLeadPayload({ message: "hello there friend", context: "free-text" }).ok).toBe(true);
  });

  it("rejects missing message", () => {
    expect(validateLeadPayload({ context: "free-text" }).ok).toBe(false);
  });

  it("rejects messages longer than 4000 chars", () => {
    expect(validateLeadPayload({ message: "x".repeat(4001) }).ok).toBe(false);
  });

  it("rejects honeypot-tripped requests", () => {
    expect(validateLeadPayload({ message: "hi", website: "spam" }).ok).toBe(false);
  });

  it("accepts unknown context as undefined", () => {
    expect(validateLeadPayload({ message: "please hire me", context: "bogus" }).ok).toBe(true);
  });

  it("rejects short messages with fewer than 3 words and no question mark", () => {
    const r = validateLeadPayload({ message: "hi" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("message-too-short");
  });

  it("rejects two-word messages with no question mark", () => {
    expect(validateLeadPayload({ message: "sup dude" }).ok).toBe(false);
  });

  it("accepts two-word messages that are questions", () => {
    expect(validateLeadPayload({ message: "hire me?" }).ok).toBe(true);
  });

  it("accepts messages with 3+ words", () => {
    expect(validateLeadPayload({ message: "let us talk" }).ok).toBe(true);
  });
});
