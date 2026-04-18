import { describe, it, expect } from "vitest";
import { nextCaseStudy } from "./case-study-next";
import { STATIC_FEATURES } from "./feature-static";

describe("nextCaseStudy", () => {
  it("airtable → bp (first peer in brandAlts)", () => {
    expect(nextCaseStudy("airtable")).toEqual({
      slug: "bp",
      title: STATIC_FEATURES.bp.title,
      kicker: STATIC_FEATURES.bp.kicker,
    });
  });

  it("bp → airtable", () => {
    expect(nextCaseStudy("bp")).toEqual({
      slug: "airtable",
      title: STATIC_FEATURES.airtable.title,
      kicker: STATIC_FEATURES.airtable.kicker,
    });
  });

  it("mpa → airtable", () => {
    expect(nextCaseStudy("mpa")).toEqual({
      slug: "airtable",
      title: STATIC_FEATURES.airtable.title,
      kicker: STATIC_FEATURES.airtable.kicker,
    });
  });

  it("returns null for non-case-study keys (writing)", () => {
    expect(nextCaseStudy("writing")).toBeNull();
  });

  it("returns null for unknown slugs", () => {
    expect(nextCaseStudy("something-else")).toBeNull();
  });
});
