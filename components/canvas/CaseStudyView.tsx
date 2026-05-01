import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";
import { CaseStudyHandoff } from "./CaseStudyHandoff";
import { CaseStudyTransitions } from "./CaseStudyTransitions";

export function CaseStudyView({ project: p }: { project: Project }) {
  const kicker = [p.brand, p.year, p.type].filter(Boolean).join(" · ");
  const hero = p.heroImage ?? p.mainImage;
  const layout = p.layout ?? "editorial";
  const moments = layout !== "gallery" ? (p.editorialSections ?? []) : [];
  const slug = p.slug.current;

  return (
    <article className="min-h-screen">
      <CaseStudyTransitions />
      {/* Hero — full-bleed image with bottom-left title overlay */}
      <section className="relative w-full h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">
        {hero ? (
          <Image
            src={urlForImage(hero).width(2400).url()}
            alt={p.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ viewTransitionName: `work-cover-${slug}` }}
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
            <h1 className="case-study-h1 font-[family-name:var(--font-serif)] font-normal text-[clamp(44px,6vw,86px)] leading-[0.98] tracking-[-0.015em] m-0 max-w-[22ch] text-[var(--color-ink)]">
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

      {/* Film layout — video leads before everything else */}
      {layout === "film" && p.videoLinks && p.videoLinks.length > 0 && (
        <VideoArtifacts videos={p.videoLinks} />
      )}

      {/* Numbered moments — editorial sections */}
      {moments.length > 0 && (
        <div className="pb-[80px]">
          {moments.map((section, i) => (
            <Moment key={`moment-${i}`} section={section} index={i} />
          ))}
        </div>
      )}

      {/* Gallery — shown when layout is 'gallery', or as fallback when no editorial sections */}
      {(layout === "gallery" || moments.length === 0) && p.gallery?.length ? (
        <section className="pb-[80px]">
          {p.gallery.map((img, i) => (
            <figure key={`gal-${i}`} className="w-full mb-[2px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlForImage(img).width(2000).url()}
                alt={`${p.title} image ${i + 1}`}
                className="w-full object-cover"
              />
            </figure>
          ))}
        </section>
      ) : null}

      {/* Conflict / Resolution — always render when content exists */}
      {(p.conflict || p.resolution) && (
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

      {/* Video artifacts — editorial and gallery layouts show video at the end */}
      {layout !== "film" && p.videoLinks && p.videoLinks.length > 0 && (
        <VideoArtifacts videos={p.videoLinks} />
      )}

      <CaseStudyHandoff currentSlug={p.slug.current} />
    </article>
  );
}

function toEmbedUrl(url: string, platform?: string): string | null {
  try {
    const u = new URL(url);
    if (platform === "vimeo" || u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (platform === "youtube" || u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.replace(/^\//, "")
        : u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

type VideoLink = NonNullable<Project["videoLinks"]>[number];

function VideoArtifacts({ videos }: { videos: VideoLink[] }) {
  return (
    <section
      id="artifacts"
      className="px-[60px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[56px]"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[48px]">
          Artifacts
        </div>
        <div className="space-y-[72px]">
          {videos.map((v, i) => {
            const embedUrl = toEmbedUrl(v.url, v.platform);
            return (
              <div key={i}>
                {embedUrl ? (
                  <div className="relative w-full aspect-video bg-[var(--color-paper-panel)] mb-[20px]">
                    <iframe
                      src={embedUrl}
                      title={v.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative w-full aspect-video bg-[var(--color-paper-panel)] mb-[20px] hover:opacity-80 transition-opacity"
                  >
                    <span className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-mono)] text-[12px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)]">
                      Watch →
                    </span>
                  </a>
                )}
                <div className="flex items-baseline gap-[16px]">
                  <p className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.35] text-[var(--color-ink)] m-0">
                    {v.title}
                  </p>
                  {v.duration && (
                    <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)] shrink-0">
                      {v.duration}
                    </span>
                  )}
                </div>
                {v.description && (
                  <p className="font-[family-name:var(--font-serif)] text-[15px] leading-[1.55] text-[var(--color-ink-mid)] mt-[8px] max-w-[60ch]">
                    {v.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type EditorialSection = NonNullable<Project["editorialSections"]>[number];
type EditorialImage = NonNullable<EditorialSection["images"]>[number];

const IMAGE_LAYOUT_RHYTHM = { full: 0, asymmetric: 1, grid: 2 } as const;

function Moment({ section, index }: { section: EditorialSection; index: number }) {
  const counter = `§ ${String(index + 1).padStart(2, "0")}`;
  const images = section.images ?? [];
  const pullQuote = extractPullQuote(section.copyBlock);
  const rhythm = IMAGE_LAYOUT_RHYTHM[section.imageLayout ?? "full"] ?? 0;

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
              <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink-mid)] max-w-[66ch] [&_p]:mb-[18px]">
                <PortableText value={section.copyBlock} />
              </div>
            )}
            {pullQuote && (
              <blockquote className="my-[44px] max-w-[12ch] font-[family-name:var(--font-serif)] text-[clamp(48px,8vw,116px)] leading-[0.9] tracking-[-0.045em] text-[var(--color-ink)]">
                "{pullQuote}"
              </blockquote>
            )}
          </div>
        </div>

        <EditorialImages images={images} rhythm={rhythm} />
      </div>
    </section>
  );
}

function EditorialImages({
  images,
  rhythm,
}: {
  images: EditorialImage[];
  rhythm: number;
}) {
  if (images.length === 0) return null;

  if (rhythm === 1) {
    return (
      <div className="mt-[54px] grid grid-cols-[minmax(0,1.15fr)_minmax(220px,0.85fr)] items-end gap-[18px] max-[820px]:grid-cols-1">
        {images.slice(0, 3).map((img, i) => (
          <CaseStudyFigure
            key={`editorial-img-${i}`}
            image={img}
            className={i === 0 ? "max-[820px]:translate-y-0" : "md:-translate-y-[34px]"}
            width={i === 0 ? 1600 : 1000}
          />
        ))}
      </div>
    );
  }

  if (rhythm === 2) {
    return (
      <div className="mt-[54px] grid grid-cols-2 gap-[2px] max-[820px]:grid-cols-1">
        {images.slice(0, 4).map((img, i) => (
          <CaseStudyFigure
            key={`editorial-img-${i}`}
            image={img}
            className={i === 0 ? "md:col-span-2" : ""}
            width={i === 0 ? 1800 : 1100}
          />
        ))}
      </div>
    );
  }

  const [first, ...rest] = images;
  return (
    <>
      <CaseStudyFigure
        image={first}
        className="mt-[54px] -mx-[60px] max-[820px]:-mx-[24px]"
        width={2000}
      />
      {rest.length > 0 && (
        <div className="mt-[2px] grid grid-cols-2 gap-[2px] max-[820px]:grid-cols-1">
          {rest.slice(0, 4).map((img, i) => (
            <CaseStudyFigure key={`editorial-img-${i}`} image={img} width={1200} />
          ))}
        </div>
      )}
    </>
  );
}

function CaseStudyFigure({
  image,
  className = "",
  width,
}: {
  image: EditorialImage;
  className?: string;
  width: number;
}) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urlForImage(image.image).width(width).url()}
        alt={image.caption ?? ""}
        className="w-full object-cover"
      />
      {image.caption && (
        <figcaption className="mt-[12px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] leading-[1.55] text-[var(--color-accent)]">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function extractPullQuote(blocks?: EditorialSection["copyBlock"]): string | null {
  const text = blocks
    ?.flatMap((block) => ("children" in block ? block.children ?? [] : []))
    .map((child) => ("text" in child ? child.text : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  const sentence = text.split(/(?<=[.!?])\s+/)[0]?.replace(/[.!?]$/, "");
  if (!sentence || sentence.length < 42 || sentence.length > 140) return null;
  return sentence;
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
