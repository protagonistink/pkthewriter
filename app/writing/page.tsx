import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { featuredWritingQuery } from "@/lib/sanity/queries";
import type { Story, BlogPost } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";

type Data = { stories: Story[]; blogPosts: BlogPost[] };

export const revalidate = 60;
export const metadata = { title: "Writing — Patrick" };

export default async function WritingIndex() {
  const data = await sanityClient.fetch<Data>(featuredWritingQuery);
  const items: Array<
    | ({ kind: "story" } & Story)
    | ({ kind: "blogPost" } & BlogPost)
  > = [
    ...data.stories.map((s) => ({ ...s, kind: "story" as const })),
    ...data.blogPosts.map((b) => ({ ...b, kind: "blogPost" as const })),
  ].sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));

  return (
    <CanvasTakeover>
      <h1 className="font-voice text-3xl mb-8">Writing</h1>
      <ul className="divide-y divide-[var(--color-paper-border)]">
        {items.map((it) => {
          const meta =
            it.kind === "blogPost"
              ? `BLOG${it.outlet ? ` • ${it.outlet}` : ""}${it.year ? ` • ${it.year}` : ""}`
              : `STORY${it.year ? ` • ${it.year}` : ""}`;
          if (it.kind === "blogPost") {
            return (
              <li key={it._id} className="py-5">
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="group-hover:opacity-70 transition-opacity text-lg">
                    {it.title} <span className="text-[var(--color-paper-text-muted)]">↗</span>
                  </div>
                  <div className="font-voice text-sm text-[var(--color-paper-text-muted)] mt-1 uppercase tracking-[0.2em]">
                    {meta}
                  </div>
                  {it.excerpt && <p className="mt-2 text-[var(--color-paper-text-muted)]">{it.excerpt}</p>}
                </a>
              </li>
            );
          }
          return (
            <li key={it._id} className="py-5">
              <Link href={`/story/${it.slug.current}`} className="block group">
                <div className="group-hover:opacity-70 transition-opacity text-lg">
                  {it.title}
                </div>
                <div className="font-voice text-sm text-[var(--color-paper-text-muted)] mt-1 uppercase tracking-[0.2em]">
                  {meta}
                </div>
                {it.excerpt && <p className="mt-2 text-[var(--color-paper-text-muted)]">{it.excerpt}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
      {items.length === 0 && (
        <p className="font-voice text-[var(--color-paper-text-muted)]">
          No featured writing yet. Mark <code>story</code> or <code>blogPost</code> docs as <code>featured: true</code> in Sanity.
        </p>
      )}
    </CanvasTakeover>
  );
}
