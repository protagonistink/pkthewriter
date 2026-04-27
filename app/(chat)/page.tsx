import { sanityClient } from "@/lib/sanity/client";
import { featureCardsQuery, type FeatureCardsResult } from "@/lib/sanity/queries";
import { LandingClient } from "@/app/landing-client";
import type { FeatureMap } from "@/lib/feature-resolver";
import { JsonLd, personSchema, webSiteSchema } from "@/components/seo/JsonLd";

export const revalidate = 60;

export const metadata = {
  title: "Patrick Kirkland | Writer & Creative Director",
  description: "Freelance creative director and copywriter. 20+ years. Verizon, AT&T, Chevron, Warner Bros., Airtable. Ask me something.",
  alternates: {
    canonical: "/",
  },
};

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

  return (
    <>
      <JsonLd data={[personSchema, webSiteSchema]} />
      <LandingClient featureMap={featureMap} />
    </>
  );
}
