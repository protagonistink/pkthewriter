import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage } from "@/lib/sanity/types";

export function AboutView({ about }: { about: AboutPage }) {
  const resumeUrl = about.resumePdf?.asset?.url;
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="not-prose grid sm:grid-cols-[1fr_auto] gap-8 items-start mb-10">
        <div>
          <div className="font-voice text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
            about
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mt-2 mb-6">Patrick.</h1>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-voice text-sm border border-[var(--color-paper-text)] text-[var(--color-paper-text)] px-4 py-2 rounded-full hover:bg-[var(--color-paper-text)] hover:text-[var(--color-paper)] transition-colors"
            >
              download resume ↓
            </a>
          )}
        </div>
        {about.photo && (
          <img
            src={urlForImage(about.photo).width(320).url()}
            alt="Patrick"
            className="w-40 h-40 object-cover rounded-full border border-[var(--color-paper-border)]"
          />
        )}
      </div>
      {about.bio && <PortableText value={about.bio} />}
      {about.socialLinks?.length ? (
        <section className="not-prose mt-10 pt-8 border-t border-[var(--color-paper-border)]">
          <div className="font-voice text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em] mb-3">
            elsewhere
          </div>
          <ul className="flex flex-wrap gap-4">
            {about.socialLinks.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-voice text-sm text-[var(--color-paper-text)] hover:opacity-70"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
