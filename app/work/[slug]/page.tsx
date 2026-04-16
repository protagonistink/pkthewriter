import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { caseStudyBySlugQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { CaseStudyView } from "@/components/canvas/CaseStudyView";

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityClient.fetch<Project | null>(caseStudyBySlugQuery, { slug });
  if (!project) notFound();
  return (
    <CanvasTakeover backHref="/work">
      <CaseStudyView project={project} />
    </CanvasTakeover>
  );
}
