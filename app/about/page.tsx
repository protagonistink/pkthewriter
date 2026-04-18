import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { AboutView } from "@/components/canvas/AboutView";

export const revalidate = 60;
export const metadata = { title: "About — Patrick" };

const FALLBACK: AboutPage = {
  _id: "about-fallback",
  _type: "aboutPage",
  headline: "Patrick.",
  email: "patrick@pkthewriter.com",
};

export default async function Page() {
  const about = await sanityClient
    .fetch<AboutPage | null>(aboutPageQuery)
    .catch(() => null);
  return (
    <CanvasTakeover>
      <AboutView about={about ?? FALLBACK} />
    </CanvasTakeover>
  );
}
