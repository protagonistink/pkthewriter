import { describe, it, expect } from "vitest";
import { routeIntent } from "./intent-router";

/** Deterministic random: always returns 0 → first element of any pool. */
const RAND_ZERO = () => 0;
/** Deterministic random: always returns 0.99 → last element of any pool. */
const RAND_LAST = () => 0.99;

describe("routeIntent — navigation (grid fallback)", () => {
  it("routes 'show me the work' → /work", () => {
    const r = routeIntent("show me the work");
    expect(r.kind).toBe("navigate");
    if (r.kind === "navigate") expect(r.to).toBe("/work");
  });
  it("routes 'case studies' → /work", () => {
    expect(routeIntent("case studies")).toMatchObject({ kind: "navigate", to: "/work" });
  });
  it("routes 'portfolio' → /work", () => {
    expect(routeIntent("portfolio please")).toMatchObject({ kind: "navigate", to: "/work" });
  });
  it("routes 'about you' → feature:about", () => {
    expect(routeIntent("about you")).toMatchObject({ kind: "feature", key: "about" });
  });
  it("routes 'tell me about you' → feature:about", () => {
    expect(routeIntent("tell me about you")).toMatchObject({ kind: "feature", key: "about" });
  });
  it("routes 'who are you' → feature:about", () => {
    expect(routeIntent("who are you")).toMatchObject({ kind: "feature", key: "about" });
  });
  it("solo 'work' routes to /work", () => {
    expect(routeIntent("work")).toMatchObject({ kind: "navigate", to: "/work" });
  });
  it("is case-insensitive for nav keywords", () => {
    expect(routeIntent("Work")).toMatchObject({ kind: "navigate", to: "/work" });
  });
});

describe("routeIntent — brand feature cards", () => {
  it("routes 'airtable' → feature:airtable", () => {
    expect(routeIntent("airtable")).toMatchObject({ kind: "feature", key: "airtable" });
  });
  it("routes 'bp' → feature:bp", () => {
    expect(routeIntent("bp")).toMatchObject({ kind: "feature", key: "bp" });
  });
  it("routes 'chevron' → feature:chevron", () => {
    expect(routeIntent("chevron")).toMatchObject({ kind: "feature", key: "chevron" });
  });
  it("routes 'warner' → feature:warnerbros", () => {
    expect(routeIntent("warner")).toMatchObject({ kind: "feature", key: "warnerbros" });
  });
  it("routes 'warner brothers' → feature:warnerbros", () => {
    expect(routeIntent("warner brothers")).toMatchObject({ kind: "feature", key: "warnerbros" });
  });
  it("routes 'mpa' → feature:mpa", () => {
    expect(routeIntent("mpa")).toMatchObject({ kind: "feature", key: "mpa" });
  });
  it("routes 'at&t' → feature:att", () => {
    expect(routeIntent("at&t")).toMatchObject({ kind: "feature", key: "att" });
  });
  it("routes 'att' → feature:att", () => {
    expect(routeIntent("att")).toMatchObject({ kind: "feature", key: "att" });
  });
  it("routes 'techsure' → feature:techsure", () => {
    expect(routeIntent("techsure")).toMatchObject({ kind: "feature", key: "techsure" });
  });
  it("routes 'tech campaigns' → feature:techsure", () => {
    expect(routeIntent("tech campaigns")).toMatchObject({ kind: "feature", key: "techsure" });
  });
  it("routes 'show me b2b' → feature:airtable", () => {
    expect(routeIntent("show me b2b")).toMatchObject({ kind: "feature", key: "airtable" });
  });
  it("routes 'brand voice' → feature:chevron", () => {
    expect(routeIntent("brand voice")).toMatchObject({ kind: "feature", key: "chevron" });
  });
  it("routes solo 'verizon' → feature:verizon-up (the canonical Verizon)", () => {
    expect(routeIntent("verizon")).toMatchObject({ kind: "feature", key: "verizon-up" });
  });
});

describe("routeIntent — random pool picks", () => {
  it("'best ad' with rand=0 picks the first BEST_AD_POOL entry (warnerbros)", () => {
    expect(routeIntent("best ad", RAND_ZERO)).toMatchObject({ kind: "feature", key: "warnerbros" });
  });
  it("'best ad' with rand=last picks the last BEST_AD_POOL entry (att)", () => {
    expect(routeIntent("best ad", RAND_LAST)).toMatchObject({ kind: "feature", key: "att" });
  });
  it("'surprise me' with rand=0 picks the first ALL_BRANDS entry (airtable)", () => {
    expect(routeIntent("surprise me", RAND_ZERO)).toMatchObject({ kind: "feature", key: "airtable" });
  });
  it("'surprise me' with rand=last picks the last ALL_BRANDS entry (mpa)", () => {
    expect(routeIntent("surprise me", RAND_LAST)).toMatchObject({ kind: "feature", key: "mpa" });
  });
  it("'what's your favorite' picks from FAVORITE_POOL", () => {
    expect(routeIntent("what's your favorite", RAND_ZERO)).toMatchObject({ kind: "feature", key: "att" });
    expect(routeIntent("what's your favorite", RAND_LAST)).toMatchObject({ kind: "feature", key: "mpa" });
  });
  it("'favorite' (solo) also matches", () => {
    expect(routeIntent("favorite", RAND_ZERO)).toMatchObject({ kind: "feature", key: "att" });
  });
});

describe("routeIntent — contact-card intents", () => {
  it("routes 'say hi' → contact-card:hi", () => {
    expect(routeIntent("say hi")).toMatchObject({ kind: "contact-card", variant: "hi" });
  });
  it("routes bare 'hi' → contact-card:hi", () => {
    expect(routeIntent("hi")).toMatchObject({ kind: "contact-card", variant: "hi" });
  });
  it("routes bare 'hello' → contact-card:hi", () => {
    expect(routeIntent("hello")).toMatchObject({ kind: "contact-card", variant: "hi" });
  });
  it("routes 'contact' → contact-card:contact", () => {
    expect(routeIntent("contact")).toMatchObject({ kind: "contact-card", variant: "contact" });
  });
  it("routes 'contact me' → contact-card:contact", () => {
    expect(routeIntent("contact me")).toMatchObject({ kind: "contact-card", variant: "contact" });
  });
});

describe("routeIntent — other features", () => {
  it("routes 'resume' → feature:resume", () => {
    expect(routeIntent("resume")).toMatchObject({ kind: "feature", key: "resume" });
  });
  it("routes 'cv' → feature:resume", () => {
    expect(routeIntent("cv please")).toMatchObject({ kind: "feature", key: "resume" });
  });
  it("routes 'screenplays' → feature:screenwriting", () => {
    expect(routeIntent("do you write screenplays?")).toMatchObject({ kind: "feature", key: "screenwriting" });
  });
  it("routes 'essay' → feature:writing", () => {
    expect(routeIntent("got any essays")).toMatchObject({ kind: "feature", key: "writing" });
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
    expect(routeIntent("we need help with a fintech launch next quarter")).toMatchObject({ kind: "lead" });
  });
  it("treats a long question as a lead", () => {
    expect(routeIntent("can you help with a launch next quarter")).toMatchObject({ kind: "lead" });
  });
});

describe("routeIntent — clarify (ambiguous short input)", () => {
  it("treats single unmatched word as clarify", () => {
    expect(routeIntent("sup")).toMatchObject({ kind: "clarify" });
  });
  it("treats empty string as clarify", () => {
    expect(routeIntent("")).toMatchObject({ kind: "clarify" });
  });
  it("treats '????' as clarify", () => {
    expect(routeIntent("????")).toMatchObject({ kind: "clarify" });
  });
});
