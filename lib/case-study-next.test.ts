import { describe, it, expect } from "vitest";
import { nextCaseStudy } from "./case-study-next";

describe("nextCaseStudy", () => {
  it("verizon → Apple", () => {
    expect(nextCaseStudy("verizon")).toEqual({
      slug: "apple",
      title: "Apple",
      kicker: "UX writing & product voice · 2021–2023",
    });
  });

  it("apple → Verizon", () => {
    expect(nextCaseStudy("apple")).toEqual({
      slug: "verizon",
      title: "Verizon",
      kicker: "Brand identity & campaign · 2017–2024",
    });
  });

  it("mercedes → Verizon", () => {
    expect(nextCaseStudy("mercedes")).toEqual({
      slug: "verizon",
      title: "Verizon",
      kicker: "Brand identity & campaign · 2017–2024",
    });
  });

  it("returns null for non-case-study keys (writing)", () => {
    expect(nextCaseStudy("writing")).toBeNull();
  });

  it("returns null for unknown slugs", () => {
    expect(nextCaseStudy("something-else")).toBeNull();
  });
});
