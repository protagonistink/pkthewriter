import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { AboutView } from "@/components/canvas/AboutView";

export const revalidate = 60;
export const metadata = { title: "About — Patrick" };

export default async function Page() {
  const about = await sanityClient.fetch<AboutPage | null>(aboutPageQuery);
  if (!about) notFound();
  return (
    <CanvasTakeover>
      <AboutView about={about} />
    </CanvasTakeover>
  );
}
