/**
 * Feature resolver — merges a Sanity-backed card map with the static intros
 * and static fallbacks in `feature-static.ts`.
 *
 * Pure, synchronous. Given a keyword map of Sanity items, produces the
 * FeatureCard for a given FeatureKey.
 */

import { ALTS, INTROS, STATIC_FEATURES, type FeatureKey } from "./feature-static";

export type FeatureCta = { label: string; href: string; variant: "primary" | "ghost" };

export type FeatureCard = {
  key: FeatureKey;
  intro: string;
  title: string;
  kicker: string;
  copy: string;
  ctas: FeatureCta[];
  heroTag?: string;
  thumbs?: string[];
  /** Full-URL of the cover image, if Sanity supplied one. */
  coverImageUrl?: string;
  /** The three alternates shown underneath. */
  alts: Array<{ key: FeatureKey | "work"; label: string; note?: string }>;
};

export type SanityFeatureProject = {
  slug: string;
  title: string;
  brand?: string;
  year?: string;
  type?: string;
  excerpt?: string;
  coverImageUrl?: string;
};

export type SanityFeatureWriting = {
  title: string;
  outlet?: string;
  clipType?: string;
  year?: string;
  url: string;
  excerpt?: string;
};

export type FeatureMap = {
  verizon?: SanityFeatureProject | null;
  apple?: SanityFeatureProject | null;
  mercedes?: SanityFeatureProject | null;
  writing?: SanityFeatureWriting | null;
};

function projectCard(
  key: "verizon" | "apple" | "mercedes",
  project: SanityFeatureProject | null | undefined,
): FeatureCard {
  const base = STATIC_FEATURES[key];
  if (!project) return { ...base, alts: ALTS[key] };
  const kickerParts = [project.brand, project.year, project.type].filter(Boolean);
  return {
    key,
    intro: INTROS[key],
    title: project.title,
    kicker: kickerParts.join(" · ") || base.kicker,
    copy: project.excerpt ?? base.copy,
    coverImageUrl: project.coverImageUrl,
    ctas: [
      { label: "Read the story →", href: `/work/${project.slug}`, variant: "primary" },
      { label: "View the artifacts", href: `/work/${project.slug}#artifacts`, variant: "ghost" },
    ],
    heroTag: base.heroTag,
    thumbs: base.thumbs,
    alts: ALTS[key],
  };
}

function writingCard(writing: SanityFeatureWriting | null | undefined): FeatureCard {
  const base = STATIC_FEATURES.writing;
  if (!writing) return { ...base, alts: ALTS.writing };
  const kickerParts = [
    writing.clipType ? writing.clipType.charAt(0).toUpperCase() + writing.clipType.slice(1) : "Essay",
    writing.outlet,
    writing.year,
  ].filter(Boolean);
  return {
    key: "writing",
    intro: INTROS.writing,
    title: writing.title,
    kicker: kickerParts.join(" · ") || base.kicker,
    copy: writing.excerpt ?? base.copy,
    ctas: [
      { label: "Read the essay →", href: writing.url, variant: "primary" },
      { label: "See all writing", href: "/writing", variant: "ghost" },
    ],
    heroTag: base.heroTag,
    thumbs: base.thumbs,
    alts: ALTS.writing,
  };
}

/** Resolve a keyword (already routed) to a fully-populated feature card. */
export function resolveFeature(key: FeatureKey, map?: FeatureMap): FeatureCard {
  switch (key) {
    case "verizon":
      return projectCard("verizon", map?.verizon);
    case "apple":
      return projectCard("apple", map?.apple);
    case "mercedes":
      return projectCard("mercedes", map?.mercedes);
    case "writing":
      return writingCard(map?.writing);
    case "screenwriting":
      return { ...STATIC_FEATURES.screenwriting, alts: ALTS.screenwriting };
    case "resume":
      return { ...STATIC_FEATURES.resume, alts: ALTS.resume };
  }
}

export { type FeatureKey } from "./feature-static";
