import { sanityClient } from "@/lib/sanity/client";
import { writingClipsQuery } from "@/lib/sanity/queries";
import type { WritingClip } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";

export const revalidate = 60;
export const metadata = { title: "Writing — Patrick" };

export default async function WritingIndex() {
  const clips = await sanityClient.fetch<WritingClip[]>(writingClipsQuery);

  return (
    <CanvasTakeover>
      <h1 className="font-voice text-3xl mb-8">Writing</h1>
      <ul className="divide-y divide-[var(--color-paper-border)]">
        {clips.map((clip) => {
          const meta = [
            clip.clipType?.toUpperCase(),
            clip.outlet,
            clip.year,
          ]
            .filter(Boolean)
            .join(" • ");
          return (
            <li key={clip._id} className="py-5">
              <a
                href={clip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="group-hover:opacity-70 transition-opacity text-lg">
                  {clip.title}{" "}
                  <span className="text-[var(--color-paper-text-muted)]">↗</span>
                </div>
                {meta && (
                  <div className="font-voice text-sm text-[var(--color-paper-text-muted)] mt-1 uppercase tracking-[0.2em]">
                    {meta}
                  </div>
                )}
                {clip.excerpt && (
                  <p className="mt-2 text-[var(--color-paper-text-muted)]">
                    {clip.excerpt}
                  </p>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      {clips.length === 0 && (
        <p className="font-voice text-[var(--color-paper-text-muted)]">
          No clips yet — add some in the studio and mark them featured.
        </p>
      )}
    </CanvasTakeover>
  );
}
