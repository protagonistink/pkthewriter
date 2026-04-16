import { PortableText } from "@portabletext/react";
import type { Story } from "@/lib/sanity/types";

export function StoryView({ story }: { story: Story }) {
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="font-voice text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em] not-prose">
        {story.year ? `STORY • ${story.year}` : "STORY"}
      </div>
      <h1 className="text-3xl sm:text-4xl font-medium mt-2">{story.title}</h1>
      {story.excerpt && (
        <p className="text-lg text-[var(--color-paper-text-muted)] not-prose mt-4 mb-8">{story.excerpt}</p>
      )}
      {story.body && <PortableText value={story.body} />}
    </article>
  );
}
