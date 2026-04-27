import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery, writingClipsQuery } from "@/lib/sanity/queries";
import type { AboutPage, WritingClip } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";

export const revalidate = 60;
export const metadata = {
  title: "Writing",
  description:
    "Selected clips and bylines from Patrick Kirkland — a thinly stocked shelf of essays, columns, and interviews.",
  alternates: {
    canonical: "/writing",
  },
};

export default async function WritingIndex() {
  const [clips, about] = await Promise.all([
    sanityClient.fetch<WritingClip[]>(writingClipsQuery),
    sanityClient.fetch<AboutPage | null>(aboutPageQuery).catch(() => null),
  ]);
  const email = about?.email ?? "patrick@pkthewriter.com";

  return (
    <CanvasTakeover>
      <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.32em] uppercase text-[var(--color-accent)] mb-[14px]">
        — Writing
      </div>
      <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(48px,7vw,96px)] leading-[0.96] tracking-[-0.02em] mb-[56px]">
        A shelf, thinly stocked.
      </h1>
      <ul className="divide-y divide-[var(--color-paper-line)]">
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
                  <span className="text-[var(--color-ink-soft)]">↗</span>
                </div>
                {meta && (
                  <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-ink-soft)] mt-1 uppercase tracking-[0.2em]">
                    {meta}
                  </div>
                )}
                {clip.excerpt && (
                  <p className="mt-2 text-[var(--color-ink-soft)]">
                    {clip.excerpt}
                  </p>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      {clips.length === 0 && (
        <p className="font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)]">
          The published shelf is selectively light. Ask me for a sample and I&apos;ll send the right one.
        </p>
      )}

      <section className="mt-[72px] pt-[40px] border-t border-[var(--color-paper-line)]">
        <p className="font-[family-name:var(--font-serif)] text-[clamp(22px,2.6vw,30px)] leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)] m-0 max-w-[54ch]">
          Want a specific sample — a column, a manifesto, an essay I haven&apos;t published? Ask and I&apos;ll send the right one.
        </p>
        <a
          href={`mailto:${email}?subject=Writing%20sample%20request`}
          className="
            mt-[22px] inline-flex items-center gap-[10px]
            border border-[var(--color-paper-line)]
            px-[20px] py-[12px]
            font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em]
            text-[var(--color-ink)]
            transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]
          "
        >
          Ask Patrick
          <span aria-hidden="true">→</span>
        </a>
      </section>
    </CanvasTakeover>
  );
}
