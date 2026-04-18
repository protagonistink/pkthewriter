import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery, featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage, Project } from "@/lib/sanity/types";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Watermark } from "@/components/landing/Watermark";
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

  const brands = Array.from(
    new Set(projects.map((p) => p.brand).filter((b): b is string => Boolean(b)))
  );

  const yearSpan = extractYearSpan(projects);

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <main className="flex-1 mx-auto w-full max-w-[1180px] px-[60px] pt-[40px] pb-[160px] max-[820px]:px-[28px] max-[820px]:pt-[30px] max-[820px]:pb-[140px]">
          <header className="mb-[88px] max-[820px]:mb-[56px]">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.3em] uppercase text-[var(--color-accent)] mb-[28px]">
              — Index
            </p>
            <h1
              className="
                font-[family-name:var(--font-serif)] font-normal italic
                text-[clamp(44px,6.4vw,88px)] leading-[1.02] tracking-[-0.018em]
                text-[var(--color-ink)] m-0 max-w-[14ch]
              "
            >
              Selected commissions,
              <br />
              <span className="not-italic">{yearSpan}.</span>
            </h1>
            {brands.length > 0 && (
              <p
                className="
                  font-[family-name:var(--font-mono)] text-[11px]
                  tracking-[0.18em] uppercase
                  text-[var(--color-ink-soft)]
                  mt-[34px] max-w-[70ch]
                "
              >
                {brands.join("  ·  ")}
              </p>
            )}
          </header>

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
    </div>
  );
}

function extractYearSpan(projects: Project[]): string {
  const years = projects
    .map((p) => Number.parseInt(p.year ?? "", 10))
    .filter((n) => Number.isFinite(n) && n > 1900) as number[];
  if (years.length === 0) return "recent";
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
