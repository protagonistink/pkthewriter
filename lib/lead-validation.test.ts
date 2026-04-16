import { describe, it, expect } from "vitest";
import { validateLeadPayload } from "./lead-validation";

describe("validateLeadPayload", () => {
  it("accepts a well-formed message", () => {
    expect(validateLeadPayload({ message: "hello there", context: "free-text" }).ok).toBe(true);
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
    expect(validateLeadPayload({ message: "hi" }).ok).toBe(true);
  });
});
