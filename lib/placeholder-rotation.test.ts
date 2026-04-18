import { describe, it, expect } from "vitest";
import { buildRotationPlan, DEFAULT_POOL, LANDING_PLACEHOLDER } from "./placeholder-rotation";

describe("buildRotationPlan", () => {
  it("always ends with the landing placeholder", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    expect(plan[plan.length - 1]).toBe(LANDING_PLACEHOLDER);
  });

  it("produces 5 entries by default (4 picks + landing)", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    expect(plan).toHaveLength(5);
  });

  it("never picks the landing placeholder for intermediate slots", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    const intermediates = plan.slice(0, -1);
    expect(intermediates).not.toContain(LANDING_PLACEHOLDER);
  });

  it("never repeats the same example back-to-back", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    for (let i = 1; i < plan.length; i++) {
      expect(plan[i]).not.toBe(plan[i - 1]);
    }
  });

  it("draws from DEFAULT_POOL", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    for (const entry of plan) {
      expect([...DEFAULT_POOL, LANDING_PLACEHOLDER]).toContain(entry);
    }
  });
});
