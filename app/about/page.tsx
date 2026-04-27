import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery, featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import type { AboutPage, Project } from "@/lib/sanity/types";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { EditorialAboutPage } from "@/components/about/EditorialAboutPage";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const revalidate = 60;

export const metadata = {
  title: "About",
  description: "Writer, creative director, and narrative strategist.",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const [about, projects] = await Promise.all([
    sanityClient.fetch<AboutPage | null>(aboutPageQuery).catch(() => null),
    sanityClient.fetch<Project[]>(featuredCaseStudiesQuery).catch(() => [] as Project[]),
  ]);

  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr]">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <EditorialAboutPage about={about} projects={projects} />
        <SiteFooter dark />
      </div>
      <CaseStudyAsk />
    </div>
  );
}
