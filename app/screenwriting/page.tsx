import { sanityClient } from "@/lib/sanity/client";
import { screenplaysQuery } from "@/lib/sanity/queries";
import type { Screenplay } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { ScreenplayGallery } from "@/components/canvas/ScreenplayGallery";

export const revalidate = 60;
export const metadata = { title: "Screenplays — Patrick" };

export default async function Page() {
  const screenplays = await sanityClient.fetch<Screenplay[]>(screenplaysQuery);
  return (
    <CanvasTakeover>
      <ScreenplayGallery screenplays={screenplays} />
    </CanvasTakeover>
  );
}
