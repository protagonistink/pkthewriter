import { describe, it, expect } from "vitest";
import { routeIntent } from "./intent-router";

describe("routeIntent — navigation (grid fallback)", () => {
  it("routes 'show me the work' → /work", () => {
    const r = routeIntent("show me the work");
    expect(r.kind).toBe("navigate");
    if (r.kind === "navigate") expect(r.to).toBe("/work");
  });

  it("routes 'case studies' → /work", () => {
    expect(routeIntent("case studies")).toMatchObject({ kind: "navigate", to: "/work" });
  });

  it("routes 'case study' (singular) → /work", () => {
    expect(routeIntent("show me a case study")).toMatchObject({ kind: "navigate", to: "/work" });
  });

  it("routes 'portfolio' → /work", () => {
    expect(routeIntent("portfolio please")).toMatchObject({ kind: "navigate", to: "/work" });
  });

  it("routes 'about you' → /about", () => {
    expect(routeIntent("about you")).toMatchObject({ kind: "navigate", to: "/about" });
  });

  it("solo 'work' routes to /work", () => {
    expect(routeIntent("work")).toMatchObject({ kind: "navigate", to: "/work" });
  });

  it("is case-insensitive for nav keywords", () => {
    expect(routeIntent("Work")).toMatchObject({ kind: "navigate", to: "/work" });
  });
});

describe("routeIntent — feature cards (in-place response)", () => {
  it("routes 'best ad' → feature:verizon", () => {
    expect(routeIntent("best ad")).toMatchObject({ kind: "feature", key: "verizon" });
  });

  it("routes 'show me your best ad' → feature:verizon", () => {
    expect(routeIntent("show me your best ad")).toMatchObject({ kind: "feature", key: "verizon" });
  });

  it("routes 'verizon' → feature:verizon", () => {
    expect(routeIntent("verizon")).toMatchObject({ kind: "feature", key: "verizon" });
  });

  it("routes 'apple' → feature:apple", () => {
    expect(routeIntent("apple")).toMatchObject({ kind: "feature", key: "apple" });
  });

  it("routes 'mercedes' → feature:mercedes", () => {
    expect(routeIntent("mercedes stuff")).toMatchObject({ kind: "feature", key: "mercedes" });
  });

  it("routes 'benz' → feature:mercedes", () => {
    expect(routeIntent("benz")).toMatchObject({ kind: "feature", key: "mercedes" });
  });

  it("routes 'resume' → feature:resume", () => {
    expect(routeIntent("resume")).toMatchObject({ kind: "feature", key: "resume" });
  });

  it("routes 'cv' → feature:resume", () => {
    expect(routeIntent("cv please")).toMatchObject({ kind: "feature", key: "resume" });
  });

  it("routes 'do you write screenplays?' → feature:screenwriting", () => {
    expect(routeIntent("do you write screenplays?")).toMatchObject({ kind: "feature", key: "screenwriting" });
  });

  it("routes 'need a script' → feature:screenwriting", () => {
    expect(routeIntent("need a script")).toMatchObject({ kind: "feature", key: "screenwriting" });
  });

  it("routes 'read your writing' → feature:writing", () => {
    expect(routeIntent("read your writing")).toMatchObject({ kind: "feature", key: "writing" });
  });

  it("routes 'got any essays' → feature:writing", () => {
    expect(routeIntent("got any essays")).toMatchObject({ kind: "feature", key: "writing" });
  });

  it("is case-insensitive for feature keywords", () => {
    expect(routeIntent("SCREENPLAY")).toMatchObject({ kind: "feature", key: "screenwriting" });
    expect(routeIntent("APPLE")).toMatchObject({ kind: "feature", key: "apple" });
  });
});

describe("routeIntent — PI card", () => {
  it("routes 'protagonist ink' → card:pi", () => {
    expect(routeIntent("tell me about protagonist ink")).toMatchObject({ kind: "card", id: "pi" });
  });

  it("routes bare 'pi' → card:pi", () => {
    expect(routeIntent("pi?")).toMatchObject({ kind: "card", id: "pi" });
  });
});

describe("routeIntent — lead (prose without navigation keywords)", () => {
  it("treats long prose as a lead", () => {
    expect(routeIntent("we need a brand voice for a fintech launch")).toMatchObject({ kind: "lead" });
  });

  it("treats a question as a lead", () => {
    expect(routeIntent("can you help?")).toMatchObject({ kind: "lead" });
  });

  it("treats 20+ char messages as leads", () => {
    expect(routeIntent("thinking about hiring someone")).toMatchObject({ kind: "lead" });
  });
});

describe("routeIntent — clarify (ambiguous short input)", () => {
  it("treats 'hi' as clarify", () => {
    expect(routeIntent("hi")).toMatchObject({ kind: "clarify" });
  });

  it("treats 'hello' as clarify", () => {
    expect(routeIntent("hello")).toMatchObject({ kind: "clarify" });
  });

  it("treats single unmatched word as clarify", () => {
    expect(routeIntent("sup")).toMatchObject({ kind: "clarify" });
  });

  it("treats empty string as clarify", () => {
    expect(routeIntent("")).toMatchObject({ kind: "clarify" });
  });

  it("treats whitespace-only as clarify", () => {
    expect(routeIntent("   ")).toMatchObject({ kind: "clarify" });
  });

  it("treats '????' as clarify (punctuation alone isn't enough)", () => {
    expect(routeIntent("????")).toMatchObject({ kind: "clarify" });
  });
});
