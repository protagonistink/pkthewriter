/**
 * Feature resolver — merges a Sanity-backed card map with the static
 * intros in feature-static.ts. Pure, synchronous.
 */

import { ALTS, INTROS, STATIC_FEATURES, type FeatureKey } from "./feature-static";
import { urlForImage } from "./sanity/image";

export type FeatureCta = { label: string; href: string; variant: "primary" | "ghost" };

type SanityImageRef = { asset: { _ref: string; _type: "reference" } };

export type FeatureCard = {
  key: FeatureKey;
  intro: string;
  title: string;
  kicker: string;
  copy: string;
  ctas: FeatureCta[];
  heroTag?: string;
  thumbs?: string[];
  thumbImageUrls?: string[];
  coverImageUrl?: string;
  alts: Array<{ key: FeatureKey | "work"; label: string; note?: string }>;
};

export type SanityFeatureProject = {
  slug: string;
  title: string;
  brand?: string;
  year?: string;
  type?: string;
  excerpt?: string;
  coverImage?: SanityImageRef;
  thumbImages?: SanityImageRef[];
};

export type FeatureMap = {
  airtable?: SanityFeatureProject | null;
  bp?: SanityFeatureProject | null;
  techsure?: SanityFeatureProject | null;
  "verizon-up"?: SanityFeatureProject | null;
  chevron?: SanityFeatureProject | null;
  warnerbros?: SanityFeatureProject | null;
  att?: SanityFeatureProject | null;
  mpa?: SanityFeatureProject | null;
};

type BrandKey = keyof FeatureMap;

const BRAND_KEYS = new Set<string>([
  "airtable", "bp", "techsure", "verizon-up", "chevron", "warnerbros", "att", "mpa",
]);

function isBrandKey(k: FeatureKey): k is BrandKey {
  return BRAND_KEYS.has(k);
}

function projectCard(key: BrandKey, project: SanityFeatureProject | null | undefined): FeatureCard {
  const base = STATIC_FEATURES[key];
  if (!project) return { ...base, alts: ALTS[key] };
  const kickerParts = [project.brand, project.year, project.type].filter(Boolean);
  const coverImageUrl = project.coverImage ? urlForImage(project.coverImage).width(1600).url() : undefined;
  const thumbImageUrls = (project.thumbImages ?? [])
    .filter((img): img is SanityImageRef => !!img?.asset?._ref)
    .slice(0, 3)
    .map((img) => urlForImage(img).width(480).height(320).fit("crop").url());
  return {
    key,
    intro: INTROS[key],
    title: project.title,
    kicker: kickerParts.join(" · ") || base.kicker,
    copy: project.excerpt ?? base.copy,
    coverImageUrl,
    ctas: [
      { label: "Read the story →", href: `/work/${project.slug}`, variant: "primary" },
      { label: "View the artifacts", href: `/work/${project.slug}#artifacts`, variant: "ghost" },
    ],
    heroTag: base.heroTag,
    thumbs: base.thumbs,
    thumbImageUrls: thumbImageUrls.length ? thumbImageUrls : undefined,
    alts: ALTS[key],
  };
}

export function resolveFeature(key: FeatureKey, map?: FeatureMap): FeatureCard {
  if (isBrandKey(key)) return projectCard(key, map?.[key]);
  return { ...STATIC_FEATURES[key], alts: ALTS[key] };
}

export { type FeatureKey } from "./feature-static";
