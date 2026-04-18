import { sanityClient } from "@/lib/sanity/client";
import { featureCardsQuery, aboutPageQuery, type FeatureCardsResult } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Watermark } from "@/components/landing/Watermark";
import { LandingClient } from "./landing-client";
import type { FeatureMap } from "@/lib/feature-resolver";

export const revalidate = 60;

export default async function Page() {
  const [featureCards, about] = await Promise.all([
    sanityClient.fetch<FeatureCardsResult | null>(featureCardsQuery).catch(() => null),
    sanityClient.fetch<AboutPage | null>(aboutPageQuery).catch(() => null),
  ]);

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
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <main id="main" className="flex-1 flex flex-col mx-auto w-full max-w-[1040px] px-[60px] pt-[40px] pb-[140px] max-[820px]:px-[28px] max-[820px]:pt-[30px] max-[820px]:pb-[160px]">
          <LandingClient featureMap={featureMap} />
        </main>
      </div>
      <Watermark />
    </div>
  );
}
