import { sanityClient } from "@/lib/sanity/client";
import { featureCardsQuery, type FeatureCardsResult } from "@/lib/sanity/queries";
import { LandingClient } from "@/app/landing-client";
import type { FeatureMap } from "@/lib/feature-resolver";

export const revalidate = 60;

export default async function Page() {
  const featureCards = await sanityClient
    .fetch<FeatureCardsResult | null>(featureCardsQuery)
    .catch(() => null);

  const featureMap: FeatureMap = {
    airtable: featureCards?.airtable ?? null,
    bp: featureCards?.bp ?? null,
    techsure: featureCards?.techsure ?? null,
    "verizon-up": featureCards?.["verizon-up"] ?? null,
    chevron: featureCards?.chevron ?? null,
    warnerbros: featureCards?.warnerbros ?? null,
    att: featureCards?.att ?? null,
    mpa: featureCards?.mpa ?? null,
  };

  return <LandingClient featureMap={featureMap} />;
}
