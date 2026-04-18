import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { caseStudyBySlugQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";
import { CaseStudyView } from "@/components/canvas/CaseStudyView";
import { staticCaseStudy } from "@/lib/static-case-studies";

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project =
    (await sanityClient
      .fetch<Project | null>(caseStudyBySlugQuery, { slug })
      .catch(() => null)) ?? staticCaseStudy(slug);
  if (!project) notFound();
  return <CaseStudyView project={project} />;
}
