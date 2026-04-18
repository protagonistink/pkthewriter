import { sanityClient } from "@/lib/sanity/client";
import { featureCardsQuery, aboutPageQuery, type FeatureCardsResult } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
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
    verizon: featureCards?.verizon
      ? {
          slug: featureCards.verizon.slug,
          title: featureCards.verizon.title,
          brand: featureCards.verizon.brand,
          year: featureCards.verizon.year,
          type: featureCards.verizon.type,
          excerpt: featureCards.verizon.excerpt,
          coverImageUrl: featureCards.verizon.coverImage
            ? urlForImage(featureCards.verizon.coverImage).width(1200).url()
            : undefined,
        }
      : null,
    apple: featureCards?.apple
      ? {
          slug: featureCards.apple.slug,
          title: featureCards.apple.title,
          brand: featureCards.apple.brand,
          year: featureCards.apple.year,
          type: featureCards.apple.type,
          excerpt: featureCards.apple.excerpt,
          coverImageUrl: featureCards.apple.coverImage
            ? urlForImage(featureCards.apple.coverImage).width(1200).url()
            : undefined,
        }
      : null,
    mercedes: featureCards?.mercedes
      ? {
          slug: featureCards.mercedes.slug,
          title: featureCards.mercedes.title,
          brand: featureCards.mercedes.brand,
          year: featureCards.mercedes.year,
          type: featureCards.mercedes.type,
          excerpt: featureCards.mercedes.excerpt,
          coverImageUrl: featureCards.mercedes.coverImage
            ? urlForImage(featureCards.mercedes.coverImage).width(1200).url()
            : undefined,
        }
      : null,
    writing: featureCards?.writing ?? null,
  };

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <section className="flex-1 flex flex-col mx-auto w-full max-w-[1040px] px-[60px] pt-[40px] pb-[140px] max-[820px]:px-[28px] max-[820px]:pt-[30px] max-[820px]:pb-[160px]">
          <LandingClient featureMap={featureMap} />
        </section>
      </div>
      <Watermark />
    </div>
  );
}
