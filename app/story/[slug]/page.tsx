import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { storyBySlugQuery } from "@/lib/sanity/queries";
import type { Story } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { StoryView } from "@/components/canvas/StoryView";

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await sanityClient.fetch<Story | null>(storyBySlugQuery, { slug });
  if (!story) notFound();
  return (
    <CanvasTakeover backHref="/writing">
      <StoryView story={story} />
    </CanvasTakeover>
  );
}
