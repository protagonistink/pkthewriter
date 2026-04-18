import { ALTS, STATIC_FEATURES, type FeatureKey } from "./feature-static";

export type NextCaseStudy = {
  slug: string;
  /** Client brand — the label the handoff should lead with. */
  brand: string;
  /** Project title — kept as a fallback when brand is missing. */
  title: string;
  kicker: string;
};

const CASE_STUDY_KEYS = [
  "airtable", "bp", "techsure", "verizon-up", "chevron", "warnerbros", "att", "mpa",
] as const satisfies readonly FeatureKey[];
type CaseStudyKey = (typeof CASE_STUDY_KEYS)[number];

function isCaseStudyKey(x: string): x is CaseStudyKey {
  return (CASE_STUDY_KEYS as readonly string[]).includes(x);
}

export function nextCaseStudy(currentSlug: string): NextCaseStudy | null {
  if (!isCaseStudyKey(currentSlug)) return null;
  const alts = ALTS[currentSlug];
  const nextAlt = alts.find((a) => a.key !== "work" && isCaseStudyKey(a.key as string));
  if (!nextAlt) return null;
  const feature = STATIC_FEATURES[nextAlt.key as FeatureKey];
  return {
    slug: nextAlt.key as string,
    brand: feature.brand ?? feature.title,
    title: feature.title,
    kicker: feature.kicker,
  };
}
