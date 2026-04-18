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
              <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-ink-mid)] mb-[14px]">
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

      {/* Overture — credits stack on the left, display-serif context on the right.
          Brand/role/year/type already live in the hero kicker, so we don't
          repeat them here — only the project-specific credits. */}
      {(p.context || p.disciplines?.length || p.deliverables?.length || p.impact?.length) && (
        <section className="px-[60px] pt-[88px] pb-[60px] max-[820px]:px-[24px] max-[820px]:pt-[60px] max-[820px]:pb-[40px]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-[minmax(200px,260px)_1fr] gap-[80px] max-[820px]:grid-cols-1 max-[820px]:gap-[40px]">
            <aside>
              {p.disciplines?.length ? <MetadataRow label="Disciplines" value={p.disciplines.join(", ")} /> : null}
              {p.deliverables?.length ? <MetadataRow label="Deliverables" value={p.deliverables.join(", ")} /> : null}
              {p.impact?.length ? <MetadataRow label="Impact" value={p.impact.join(" · ")} /> : null}
            </aside>

            {p.context && (
              <div className="relative">
                <p className="font-[family-name:var(--font-serif)] font-normal text-[clamp(26px,3.2vw,42px)] leading-[1.22] tracking-[-0.005em] m-0 text-[var(--color-ink)]">
                  {p.context}
                </p>
                <div
                  aria-hidden="true"
                  className="absolute left-0 right-0 bottom-0 h-[96px] pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(15,14,12,0) 0%, var(--color-paper) 92%)",
                  }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Numbered moments — editorial sections, intercut with gallery stills */}
      {moments.length > 0 && (
        <div className="pb-[80px]">
          {moments.map((section, i) => (
            <Moment key={`moment-${i}`} section={section} index={i} />
          ))}
        </div>
      )}

      {/* Gallery fallback — if no editorial sections, show gallery as full-bleed stills */}
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

      {/* Portable Text fallback — conflict/resolution if no editorial sections.
          Older docs sometimes stored `conflict` as a plain string rather than
          Portable Text blocks; handle both or PortableText silently drops it. */}
      {moments.length === 0 && (p.conflict || p.resolution) && (
        <section className="px-[60px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[56px]">
          <div className="max-w-[740px] mx-auto space-y-[48px]">
            {p.conflict && (
              <ConflictResolutionBlock counter="§ 01" value={p.conflict} />
            )}
            {p.resolution && (
              <ConflictResolutionBlock counter="§ 02" value={p.resolution} />
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
              <figcaption className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase text-[var(--color-ink-soft)] mt-[12px] px-[60px] max-[820px]:px-[24px]">
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

function ConflictResolutionBlock({
  counter,
  value,
}: {
  counter: string;
  value: string | NonNullable<Project["conflict"]>;
}) {
  return (
    <div>
      <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[18px]">
        {counter}
      </div>
      <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink)] [&_p]:mb-[18px]">
        {typeof value === "string" ? (
          value
            .split(/\n{2,}/)
            .map((para, i) => <p key={i}>{para.trim()}</p>)
        ) : (
          <PortableText value={value} />
        )}
      </div>
    </div>
  );
}

function MetadataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-[18px]">
      <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)] mb-[6px]">
        {label}
      </div>
      <div className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.35] text-[var(--color-ink)]">
        {value}
      </div>
    </div>
  );
}
