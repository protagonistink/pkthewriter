import { sanityClient } from "@/lib/sanity/client";
import { suggestionSetQuery, aboutPageQuery } from "@/lib/sanity/queries";
import type { SuggestionSet, AboutPage } from "@/lib/sanity/types";
import { Wordmark } from "@/components/landing/Wordmark";
import { ContactLink } from "@/components/landing/ContactLink";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { SuggestionsList } from "@/components/landing/SuggestionsList";
import { LandingClient } from "./landing-client";

export const revalidate = 60;

export default async function Page() {
  const [suggestionSet, about] = await Promise.all([
    sanityClient.fetch<SuggestionSet | null>(suggestionSetQuery),
    sanityClient.fetch<AboutPage | null>(aboutPageQuery),
  ]);

  return (
    <>
      <Wordmark />
      <ContactLink email={about?.email} />
      <main className="min-h-screen px-6 pt-28 pb-24">
        <div className="max-w-[640px] mx-auto">
          <HeroIntro />
          <LandingClient />
          <SuggestionsList items={suggestionSet?.items ?? []} />
        </div>
      </main>
    </>
  );
}
