import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { caseStudyBySlugQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";
import { CaseStudyView } from "@/components/canvas/CaseStudyView";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await sanityClient
    .fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug }`
    )
    .catch(() => []);
  return projects.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityClient
    .fetch<Project | null>(caseStudyBySlugQuery, { slug })
    .catch(() => null);
  if (!project) return {};

  const titlePieces = [project.title, project.brand].filter(Boolean) as string[];
  const title = titlePieces.join(" — ");
  const description =
    project.context ??
    `${project.brand ?? project.title} case study by Patrick Kirkland — writer and creative director.`;
  const hero = project.heroImage ?? project.mainImage;
  const ogImage = hero
    ? urlForImage(hero).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityClient
    .fetch<Project | null>(caseStudyBySlugQuery, { slug })
    .catch(() => null);
  if (!project) notFound();
  return <CaseStudyView project={project} />;
}
