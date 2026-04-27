import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery, featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage, Project } from "@/lib/sanity/types";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { WorkList, type WorkTile } from "@/components/work/WorkList";

export const revalidate = 60;

export const metadata = {
  title: "Selected work",
  description:
    "Case studies from Patrick Kirkland — TV, digital, and editorial work for Verizon, AT&T, Chevron, BP, Warner Bros, and more.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Selected work — Patrick Kirkland",
    description:
      "Case studies from Patrick Kirkland — TV, digital, and editorial work for Verizon, AT&T, Chevron, BP, Warner Bros, and more.",
    type: "website" as const,
  },
};

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
    role: p.role,
    imageUrl: p.mainImage ? urlForImage(p.mainImage).width(900).url() : undefined,
  }));

  const preloadUrls = tiles
    .map((t) => t.imageUrl)
    .filter((u): u is string => Boolean(u));

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <main id="main" className="flex-1 mx-auto w-full max-w-[1280px] px-[48px] pt-[36px] pb-[160px] max-[820px]:px-[20px] max-[820px]:pt-[24px] max-[820px]:pb-[140px]">
          <h1 className="sr-only">Selected work</h1>
          <p
            className="
              font-[family-name:var(--font-mono)] text-[12px]
              tracking-[0.32em] uppercase
              text-[var(--color-accent)]
              mb-[28px] max-[820px]:mb-[20px]
            "
          >
            — All work
          </p>

          {tiles.length > 0 ? (
            <>
              {preloadUrls.map((url) => (
                <link key={url} rel="preload" as="image" href={url} />
              ))}
              <WorkList tiles={tiles} />
            </>
          ) : (
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-mid)]">
              No featured case studies yet.
            </p>
          )}
        </main>
      </div>
      <CaseStudyAsk />
    </div>
  );
}
