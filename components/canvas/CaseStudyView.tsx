import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";

export function CaseStudyView({ project: p }: { project: Project }) {
  return (
    <article>
      <header className="mb-10">
        <div className="font-voice text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
          {[p.brand, p.year, p.type].filter(Boolean).join(" • ")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-medium mt-3">{p.title}</h1>
        {p.context && <p className="text-lg mt-4 text-[var(--color-paper-text-muted)]">{p.context}</p>}
      </header>

      {p.heroImage && (
        <div className="mb-10">
          <img
            src={urlForImage(p.heroImage).width(1600).url()}
            alt={p.title}
            className="w-full rounded border border-[var(--color-paper-border)]"
          />
        </div>
      )}

      {p.conflict && (
        <section className="mb-10 prose prose-neutral max-w-none">
          <h2 className="font-voice text-sm uppercase tracking-[0.2em] text-[var(--color-paper-text-muted)]">
            Conflict
          </h2>
          <PortableText value={p.conflict} />
        </section>
      )}

      {p.resolution && (
        <section className="mb-10 prose prose-neutral max-w-none">
          <h2 className="font-voice text-sm uppercase tracking-[0.2em] text-[var(--color-paper-text-muted)]">
            Resolution
          </h2>
          <PortableText value={p.resolution} />
        </section>
      )}

      {(p.disciplines?.length || p.deliverables?.length || p.impact?.length) && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-[var(--color-paper-border)]">
          {p.disciplines?.length ? <MetaCol title="Disciplines" items={p.disciplines} /> : null}
          {p.deliverables?.length ? <MetaCol title="Deliverables" items={p.deliverables} /> : null}
          {p.impact?.length ? <MetaCol title="Impact" items={p.impact} /> : null}
        </section>
      )}

      {p.gallery?.length ? (
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {p.gallery.map((img, i) => (
            <img
              key={i}
              src={urlForImage(img).width(1200).url()}
              alt=""
              className="w-full rounded border border-[var(--color-paper-border)]"
            />
          ))}
        </section>
      ) : null}
    </article>
  );
}

function MetaCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-voice text-sm uppercase tracking-[0.2em] text-[var(--color-paper-text-muted)] mb-2">
        {title}
      </div>
      <ul className="text-sm space-y-1">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
