/**
 * Pure scheduler for the ChatBar's rotating placeholder.
 *
 * Produces an ordered list of sample strings to display in the input
 * placeholder. The last entry is always LANDING_PLACEHOLDER (the resting
 * state). Intermediate entries are drawn from a pool, with the constraint
 * that no two adjacent entries are equal.
 */

export const LANDING_PLACEHOLDER = "/ surprise me";

export const DEFAULT_POOL = [
  "/ best ad",
  "/ work",
  "/ resume",
  "/ contact",
  "/ about",
  "/ say hi",
  "/ what's your favorite",
] as const;

export type RotationPlanOptions = {
  rand?: () => number;
  /** Number of intermediate picks before the landing placeholder (default 4). */
  steps?: number;
  pool?: readonly string[];
};

export function buildRotationPlan(opts: RotationPlanOptions = {}): string[] {
  const rand = opts.rand ?? Math.random;
  const steps = opts.steps ?? 4;
  const pool = opts.pool ?? DEFAULT_POOL;

  const plan: string[] = [];
  let prev: string | null = null;
  for (let i = 0; i < steps; i++) {
    const choice = pickDifferent(pool, prev, rand);
    plan.push(choice);
    prev = choice;
  }
  plan.push(LANDING_PLACEHOLDER);
  return plan;
}

function pickDifferent(pool: readonly string[], exclude: string | null, rand: () => number): string {
  if (pool.length === 1) return pool[0];
  let i = Math.floor(rand() * pool.length);
  if (pool[i] === exclude) i = (i + 1) % pool.length;
  return pool[i];
}
