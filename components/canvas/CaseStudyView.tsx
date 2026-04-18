import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";
import { CaseStudyHandoff } from "./CaseStudyHandoff";

export function CaseStudyView({ project: p }: { project: Project }) {
  const kicker = [p.brand, p.year, p.type].filter(Boolean).join(" · ");
  const hero = p.heroImage ?? p.mainImage;
  const moments = p.editorialSections ?? [];

  return (
    <article className="min-h-screen">
      {/* Hero — full-bleed image with bottom-left title overlay */}
      <section className="relative w-full h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">
        {hero ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={urlForImage(hero).width(2400).url()}
            alt={p.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-paper-panel)]" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,14,12,0.35) 0%, rgba(15,14,12,0) 40%, rgba(15,14,12,0.72) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-[60px] pb-[56px] max-[820px]:px-[24px] max-[820px]:pb-[36px]">
          <div className="max-w-[1200px] mx-auto">
            {kicker && (
              <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-mid)] mb-[14px]">
                {kicker}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(44px,6vw,86px)] leading-[0.98] tracking-[-0.015em] m-0 max-w-[22ch] text-[var(--color-ink)]">
              {p.title}
            </h1>
            {p.role && (
              <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)] mt-[18px]">
                {p.role}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Overture — the context paragraph as a single display pull */}
      {p.context && (
        <section className="px-[60px] py-[100px] max-[820px]:px-[24px] max-[820px]:py-[64px]">
          <div className="max-w-[880px] mx-auto">
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[22px]">
              § Overture
            </div>
            <p className="font-[family-name:var(--font-serif)] font-normal text-[clamp(22px,2.4vw,30px)] leading-[1.4] tracking-[-0.005em] m-0 text-[var(--color-ink)]">
              {p.context}
            </p>
          </div>
        </section>
      )}

      {/* Moments — numbered editorial sections, intercut with gallery stills */}
      {moments.length > 0 && (
        <div className="pb-[80px]">
          {moments.map((section, i) => (
            <Moment key={`moment-${i}`} section={section} index={i} />
          ))}
        </div>
      )}

      {/* Gallery — if no editorial sections, show gallery as full-bleed stills */}
      {moments.length === 0 && p.gallery?.length ? (
        <section className="pb-[80px]">
          {p.gallery.map((img, i) => (
            <figure key={`gal-${i}`} className="w-full mb-[2px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlForImage(img).width(2000).url()}
                alt=""
                className="w-full object-cover"
              />
            </figure>
          ))}
        </section>
      ) : null}

      {/* Credits strip */}
      {(p.disciplines?.length || p.deliverables?.length || p.impact?.length) && (
        <section className="px-[60px] py-[80px] border-t border-[var(--color-paper-line)] max-[820px]:px-[24px] max-[820px]:py-[56px]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-[48px] max-[820px]:grid-cols-1 max-[820px]:gap-[32px]">
            {p.disciplines?.length ? <CreditCol title="Disciplines" items={p.disciplines} /> : null}
            {p.deliverables?.length ? <CreditCol title="Deliverables" items={p.deliverables} /> : null}
            {p.impact?.length ? <CreditCol title="Impact" items={p.impact} /> : null}
          </div>
        </section>
      )}

      {/* Portable Text fallback — conflict/resolution if no editorial sections */}
      {moments.length === 0 && (p.conflict || p.resolution) && (
        <section className="px-[60px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[56px]">
          <div className="max-w-[740px] mx-auto space-y-[48px]">
            {p.conflict && (
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[18px]">
                  § 01 &nbsp; Conflict
                </div>
                <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink)] [&_p]:mb-[18px]">
                  <PortableText value={p.conflict} />
                </div>
              </div>
            )}
            {p.resolution && (
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[18px]">
                  § 02 &nbsp; Resolution
                </div>
                <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink)] [&_p]:mb-[18px]">
                  <PortableText value={p.resolution} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <CaseStudyHandoff currentSlug={p.slug.current} />
    </article>
  );
}

type EditorialSection = NonNullable<Project["editorialSections"]>[number];

function Moment({ section, index }: { section: EditorialSection; index: number }) {
  const counter = `§ ${String(index + 1).padStart(2, "0")}`;
  const firstImage = section.images?.[0];
  const rest = section.images?.slice(1) ?? [];

  return (
    <section className="px-[60px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[56px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-[160px_1fr] gap-[60px] max-[820px]:grid-cols-1 max-[820px]:gap-[28px]">
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-accent)] sticky top-[120px]">
              {counter}
            </div>
          </div>
          <div>
            {section.sectionTitle && (
              <h2 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(28px,3.6vw,44px)] leading-[1.08] tracking-[-0.01em] m-0 mb-[24px] text-[var(--color-ink)]">
                {section.sectionTitle}
              </h2>
            )}
            {section.copyBlock && (
              <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink-mid)] max-w-[62ch] [&_p]:mb-[18px]">
                <PortableText value={section.copyBlock} />
              </div>
            )}
          </div>
        </div>

        {firstImage && (
          <figure className="mt-[48px] -mx-[60px] max-[820px]:-mx-[24px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urlForImage(firstImage.image).width(2000).url()}
              alt={firstImage.caption ?? ""}
              className="w-full object-cover"
            />
            {firstImage.caption && (
              <figcaption className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink-soft)] mt-[12px] px-[60px] max-[820px]:px-[24px]">
                {firstImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        {rest.length > 0 && (
          <div className="mt-[48px] grid grid-cols-2 gap-[2px] max-[820px]:grid-cols-1">
            {rest.map((img, i) => (
              <figure key={`m-img-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlForImage(img.image).width(1400).url()}
                  alt={img.caption ?? ""}
                  className="w-full object-cover"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CreditCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)] mb-[14px]">
        {title}
      </div>
      <ul className="font-[family-name:var(--font-serif)] text-[16px] leading-[1.7] text-[var(--color-ink)] list-none p-0 m-0 space-y-[4px]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
