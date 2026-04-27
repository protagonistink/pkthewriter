import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery, featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import type { AboutPage, Project } from "@/lib/sanity/types";
import { Rail } from "@/components/landing/Rail";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { CaseStudyAsk } from "@/components/canvas/CaseStudyAsk";
import { EditorialAboutPage } from "@/components/about/EditorialAboutPage";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { JsonLd, personSchema } from "@/components/seo/JsonLd";

export const revalidate = 60;

export const metadata = {
  title: "About",
  description: "Patrick Kirkland is a freelance writer and creative director with 20+ years. TV spots, brand platforms, and editorial for Verizon, AT&T, Warner Bros., Chevron, and more.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Patrick Kirkland | Writer & Creative Director",
    description: "Patrick Kirkland is a freelance writer and creative director with 20+ years. TV spots, brand platforms, and editorial for Verizon, AT&T, Warner Bros., Chevron, and more.",
    type: "profile" as const,
    images: [{ url: "/about-patrick.jpg", width: 1200, height: 630, alt: "Patrick Kirkland" }],
  },
};

export default async function AboutPage() {
  const [about, projects] = await Promise.all([
    sanityClient.fetch<AboutPage | null>(aboutPageQuery).catch(() => null),
    sanityClient.fetch<Project[]>(featuredCaseStudiesQuery).catch(() => [] as Project[]),
  ]);

  return (
    <>
    <JsonLd data={personSchema} />
    <div className="grid min-h-screen grid-cols-[auto_1fr]">
      <Rail />
      <div className="flex flex-col min-w-0">
        <SiteHeader email={about?.email} />
        <EditorialAboutPage about={about} projects={projects} />
        <SiteFooter dark />
      </div>
      <CaseStudyAsk />
    </div>
    </>
  );
}
