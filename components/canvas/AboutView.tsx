import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage } from "@/lib/sanity/types";

export function AboutView({ about }: { about: AboutPage }) {
  const resumeUrl = about.resumePdf?.asset?.url;
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="not-prose grid sm:grid-cols-[1fr_auto] gap-8 items-start mb-10">
        <div>
          <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-ink-soft)] uppercase tracking-[0.2em]">
            about
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mt-2 mb-6">Patrick.</h1>
          {resumeUrl && (
            <a
              id="resume"
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-[family-name:var(--font-mono)] text-sm border border-[var(--color-ink)] text-[var(--color-ink)] px-4 py-2 rounded-full hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors scroll-mt-24"
            >
              download resume ↓
            </a>
          )}
        </div>
        {about.photo && (
          <img
            src={urlForImage(about.photo).width(320).url()}
            alt="Patrick"
            className="w-40 h-40 object-cover rounded-full border border-[var(--color-paper-line)]"
          />
        )}
      </div>
      {about.bio && <PortableText value={about.bio} />}
      <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-ink-soft)] mt-8">
        I consult independently and through my studio,{" "}
        <a
          href="https://protagonistink.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-ink)] underline decoration-[var(--color-paper-line)] underline-offset-4 hover:decoration-[var(--color-ink)] transition-colors"
        >
          Protagonist Ink
        </a>
        .
      </p>
      {about.socialLinks?.length ? (
        <section className="not-prose mt-10 pt-8 border-t border-[var(--color-paper-line)]">
          <div className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-ink-soft)] uppercase tracking-[0.2em] mb-3">
            elsewhere
          </div>
          <ul className="flex flex-wrap gap-4">
            {about.socialLinks.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-ink)] hover:opacity-70"
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
