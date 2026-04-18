import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery, featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage, Project } from "@/lib/sanity/types";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Watermark } from "@/components/landing/Watermark";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { WorkGallery, type WorkTile } from "@/components/work/WorkGallery";

export const revalidate = 60;

export const metadata = { title: "Selected work — Patrick Kirkland" };

export default async function WorkIndex() {
  const [projects, about] = await Promise.all([
    sanityClient.fetch<Project[]>(featuredCaseStudiesQuery).catch(() => [] as Project[]),
    sanityClient.fetch<AboutPage | null>(aboutPageQuery).catch(() => null),
  ]);

  const tiles: WorkTile[] = projects.map((p) => ({
    id: p._id,
    slug: p.slug.current,
    brand: p.brand ?? p.title,
    title: p.title,
    year: p.year,
    type: p.type,
    imageUrl: p.mainImage ? urlForImage(p.mainImage).width(1200).url() : undefined,
  }));

  return (
    <div data-theme="dark" className="grid grid-cols-[auto_1fr] min-h-screen">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <main className="flex-1 mx-auto w-full max-w-[1280px] px-[48px] pt-[36px] pb-[160px] max-[820px]:px-[20px] max-[820px]:pt-[24px] max-[820px]:pb-[140px]">
          <p
            className="
              font-[family-name:var(--font-mono)] text-[11px]
              tracking-[0.32em] uppercase
              text-[var(--color-accent)]
              mb-[28px] max-[820px]:mb-[20px]
            "
          >
            — All work
          </p>

          {tiles.length > 0 ? (
            <WorkGallery tiles={tiles} />
          ) : (
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-soft)]">
              No featured case studies yet.
            </p>
          )}
        </main>
      </div>
      <Watermark />
      <CaseStudyAsk />
    </div>
  );
}
