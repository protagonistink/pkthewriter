"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { ABOUT_FOLLOWUPS, type AboutFollowup } from "@/lib/about-response";
import { ResumeOverlay } from "@/components/landing/ResumeOverlay";
import type { FeatureCard, FeatureKey } from "@/lib/feature-resolver";
import { useCaseStudyTransition } from "@/lib/use-case-study-transition";

const ABOUT_ANSWER_LIMIT = 5;
const CASE_STUDY_KEYS = new Set<FeatureKey>([
  "airtable",
  "bp",
  "techsure",
  "verizon-up",
  "chevron",
  "warnerbros",
  "att",
  "mpa",
]);

type Props = {
  feature: FeatureCard;
  rawQuery?: string;
  aboutTurns?: AboutFollowup[];
  onAboutFollowup?: (followup: AboutFollowup) => void;
  onAltSelect?: (key: FeatureKey) => void;
  onClose?: () => void;
};

export function ResponseFeature({
  feature,
  rawQuery,
  aboutTurns = [],
  onAboutFollowup,
  onAltSelect,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isCaseStudy = CASE_STUDY_KEYS.has(feature.key);

  if (feature.key === "about") {
    return (
      <AboutResponse
        feature={feature}
        rawQuery={rawQuery}
        aboutTurns={aboutTurns}
        onAboutFollowup={onAboutFollowup}
        onAltSelect={onAltSelect}
      />
    );
  }

  if (feature.key === "resume") {
    return (
      <section className="response-slot mt-[34px]" aria-live="polite">
        <p
          className="
            font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]
            text-[var(--color-ink-mid)] mb-[22px]
          "
        >
          <span className="text-[var(--color-accent)] mr-1">→</span>
          <span dangerouslySetInnerHTML={{ __html: feature.intro }} />
        </p>
        <ResumeOverlay onClose={onClose} />
      </section>
    );
  }

  if (feature.key === "writing") {
    return <WritingResponse feature={feature} onClose={onClose} />;
  }

  return (
    <section className="response-slot mt-[34px]" aria-live="polite">
      <p
        className="
          font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]
          text-[var(--color-ink-mid)] mb-[22px]
        "
      >
        <span className="text-[var(--color-accent)] mr-1">→</span>
        <span dangerouslySetInnerHTML={{ __html: feature.intro }} />
      </p>

      <article
        ref={panelRef}
        className="
          overflow-hidden rounded-[22px]
          border border-[var(--color-paper-line)]
          shadow-[var(--shadow-soft)]
        "
        style={{
          background:
            "linear-gradient(180deg, var(--color-paper-panel) 0%, var(--color-paper) 100%)",
        }}
      >
        <div
          className="
            grid grid-cols-[2fr_1fr] gap-[4px] p-[18px]
            max-[820px]:grid-cols-[1fr]
            bg-[rgba(27,26,22,0.06)]
          "
        >
          <FeatureHero feature={feature} />
          <FeatureThumbs feature={feature} />
        </div>

        <div className="px-[42px] py-[38px] pb-[40px] max-[820px]:px-[26px] max-[820px]:py-[28px] max-[820px]:pb-[32px]">
          <header className="flex flex-wrap items-baseline gap-x-[18px] gap-y-2 mb-[22px]">
            <h2
              ref={titleRef}
              className="
                font-[family-name:var(--font-serif)] font-normal
                text-[44px] leading-[1] tracking-[-0.01em] m-0
                max-[820px]:text-[36px]
              "
            >
              {feature.title}
            </h2>
            <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.2em] uppercase text-[var(--color-ink-soft)]">
              {feature.kicker}
            </span>
          </header>

          {feature.highlights && feature.highlights.length > 0 ? (
            <ul
              className="
                m-0 mb-[28px] p-0 list-none
                font-[family-name:var(--font-mono)] text-[14px] leading-[1.65]
                text-[var(--color-ink-mid)]
                border-l border-[var(--color-paper-line)]
                pl-[18px] space-y-[10px]
              "
            >
              {feature.highlights.map((item) => (
                <li key={item} className="flex gap-[10px]">
                  <span className="text-[var(--color-accent)] shrink-0" aria-hidden="true">/</span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          ) : feature.copy ? (
            <p
              className="
                font-[family-name:var(--font-serif)]
                text-[19px] leading-[1.6] text-[var(--color-ink-mid)]
                max-w-[62ch] m-0 mb-[28px]
              "
              dangerouslySetInnerHTML={{ __html: feature.copy }}
            />
          ) : null}

          <div className="flex flex-wrap gap-[12px]">
            {feature.ctas
              .filter((cta) => !isCaseStudy || cta.variant === "primary")
              .map((cta) =>
                isCaseStudy && cta.variant === "primary" ? (
                  <ReadTheStoryButton
                    key={cta.label}
                    {...cta}
                    panelRef={panelRef}
                    titleRef={titleRef}
                  />
                ) : (
                  <CtaButton key={cta.label} {...cta} />
                ),
              )}
            {isCaseStudy && (
              <RandomSampleButton feature={feature} onAltSelect={onAltSelect} />
            )}
          </div>
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[10px] mt-[22px] pt-[20px]">
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-soft)]">
          Or
        </span>
        <Link
          href="/work"
          className="work-inline-link font-[family-name:var(--font-serif)] text-[15px] text-[var(--color-ink-mid)] underline decoration-[var(--color-paper-line)] underline-offset-4 transition-colors"
        >
          see all work.
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Writing feature card
// ---------------------------------------------------------------------------

const WRITING_TILES: Array<{
  category: string;
  title: string;
  reveal: string;
  meta: string;
  coverImage: string;
}> = [
  {
    category: "Essay",
    title: "Lorem ipsum dolor sit amet",
    reveal:
      "Most brands treat Gen Z like a science project. That's why they're getting ghosted.",
    meta: "Adweek · 2024",
    coverImage: "https://picsum.photos/seed/writing-essay/800/500",
  },
  {
    category: "Column",
    title: "Consectetur adipiscing elit",
    reveal:
      "The brief was perfect. The campaign was fine. Let's talk about what happened in between.",
    meta: "Substack · 2023",
    coverImage: "https://picsum.photos/seed/writing-column/800/500",
  },
  {
    category: "Short Story",
    title: "Sed do eiusmod tempor",
    reveal:
      "She opened the deck, read slide one, and knew the agency had never used their own product.",
    meta: "Fiction · 2022",
    coverImage: "https://picsum.photos/seed/writing-story/800/500",
  },
];

function WritingResponse({
  feature,
  onClose: _onClose,
}: {
  feature: FeatureCard;
  onClose?: () => void;
}) {
  const [spotlight, setSpotlight] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => setSpotlight(null), []);

  return (
    <section className="response-slot mt-[34px]" aria-live="polite">
      <p
        className="
          font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]
          text-[var(--color-ink-mid)] mb-[22px]
        "
      >
        <span className="text-[var(--color-accent)] mr-1">→</span>
        <span dangerouslySetInnerHTML={{ __html: feature.intro }} />
      </p>

      <article
        className="
          overflow-hidden rounded-[22px]
          border border-[var(--color-paper-line)]
          shadow-[var(--shadow-soft)]
        "
        style={{
          background:
            "linear-gradient(180deg, var(--color-paper-panel) 0%, var(--color-paper) 100%)",
        }}
      >
        {/* Dark editorial tile grid */}
        <div
          className="relative grid grid-cols-3 max-[820px]:grid-cols-1 gap-[8px]"
          style={{ background: "var(--color-paper-panel)" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Spotlight overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-[1]"
            style={{
              opacity: spotlight ? 1 : 0,
              background: spotlight
                ? `radial-gradient(500px circle at ${spotlight.x}px ${spotlight.y}px, rgba(192,84,46,0.13), transparent 50%)`
                : "none",
            }}
          />
          {WRITING_TILES.map((tile) => (
            <Link
              key={tile.category}
              href="/writing"
              className="group flex flex-col transition-opacity border border-[rgba(239,228,208,0.1)]"
              style={{ background: "rgba(27,26,22,0.94)" }}
            >
              {/* Cover image — full-bleed, no padding */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.coverImage}
                alt=""
                className="w-full aspect-[16/10] object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Text content */}
              <div className="flex flex-col flex-1 justify-between p-[20px] min-h-[130px] max-[820px]:min-h-[80px]">
                <div>
                  <div
                    className="
                      font-[family-name:var(--font-mono)] text-[9px]
                      tracking-[0.4em] uppercase
                      text-[var(--color-accent)] mb-[10px]
                    "
                  >
                    {tile.category}
                  </div>
                  {/* Crossfade container — fixed height prevents layout shift */}
                  <div className="relative min-h-[60px]">
                    {/* Default title — fades out on hover */}
                    <p
                      className="
                        absolute inset-0
                        font-[family-name:var(--font-serif)] text-[16px]
                        leading-[1.3] m-0
                        transition-opacity duration-300
                        opacity-100 group-hover:opacity-0
                      "
                      style={{ color: "#ece3d1" }}
                    >
                      {tile.title}
                    </p>
                    {/* Reveal line — fades in on hover */}
                    <p
                      className="
                        absolute inset-0
                        font-[family-name:var(--font-serif)] text-[14px]
                        leading-[1.4] m-0
                        transition-opacity duration-300
                        opacity-0 group-hover:opacity-100
                      "
                      style={{ color: "rgba(236,227,209,0.85)" }}
                    >
                      {tile.reveal}
                    </p>
                  </div>
                </div>
                <div
                  className="
                    font-[family-name:var(--font-mono)] text-[9px]
                    tracking-[0.2em] uppercase mt-[14px]
                  "
                  style={{ color: "rgba(236,227,209,0.38)" }}
                >
                  {tile.meta}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom section — same hierarchy as standard ResponseFeature */}
        <div className="px-[42px] py-[38px] pb-[40px] max-[820px]:px-[26px] max-[820px]:py-[28px] max-[820px]:pb-[32px]">
          <header className="flex flex-wrap items-baseline gap-x-[18px] gap-y-2 mb-[22px]">
            <h2
              className="
                font-[family-name:var(--font-serif)] font-normal
                text-[44px] leading-[1] tracking-[-0.01em] m-0
                max-[820px]:text-[36px]
              "
            >
              {feature.title}
            </h2>
            <span
              className="
                font-[family-name:var(--font-mono)] text-[12px]
                tracking-[0.2em] uppercase text-[var(--color-ink-soft)]
              "
            >
              {feature.kicker}
            </span>
          </header>

          {feature.copy ? (
            <p
              className="
                font-[family-name:var(--font-serif)]
                text-[19px] leading-[1.6] text-[var(--color-ink-mid)]
                max-w-[62ch] m-0 mb-[28px]
              "
              dangerouslySetInnerHTML={{ __html: feature.copy }}
            />
          ) : null}

          <div className="flex flex-wrap gap-[12px]">
            {feature.ctas.map((cta) => (
              <CtaButton key={cta.label} {...cta} />
            ))}
          </div>
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-x-[6px] gap-y-[10px] mt-[22px] pt-[20px]">
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-soft)]">
          Or
        </span>
        <Link
          href="/work"
          className="work-inline-link font-[family-name:var(--font-serif)] text-[15px] text-[var(--color-ink-mid)] underline decoration-[var(--color-paper-line)] underline-offset-4 transition-colors"
        >
          see all work.
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About feature card
// ---------------------------------------------------------------------------

function AboutResponse({
  feature,
  rawQuery,
  aboutTurns = [],
  onAboutFollowup,
  onAltSelect,
}: Props) {
  const initialPrompt = rawQuery?.trim() || "/ about you";
  const remainingFollowups = ABOUT_FOLLOWUPS.filter(
    (item) => !aboutTurns.some((turn) => turn.id === item.id)
  );
  const shouldHandOff =
    aboutTurns.length >= ABOUT_ANSWER_LIMIT - 1 ||
    aboutTurns.some((turn) => turn.id === "full-about");
  const canAskMore = !shouldHandOff && remainingFollowups.length > 0;
  const typingTurnId = aboutTurns.at(-1)?.id;

  return (
    <section className="response-slot mt-[34px]" aria-live="polite">
      <div className="max-w-[760px]">
        <p
          className="
            font-[family-name:var(--font-mono)] text-[13px] leading-[1.6]
            text-[var(--color-ink-mid)] mb-[22px]
          "
        >
          <span className="text-[var(--color-accent)] mr-1">→</span>
          <span dangerouslySetInnerHTML={{ __html: feature.intro }} />
        </p>

        <div className="border-l border-[var(--color-paper-line)] pl-[22px]">
          <AboutExchange
            prompt={initialPrompt}
            answer={feature.copy}
            typing={aboutTurns.length === 0}
          />

          {aboutTurns.map((followup) => (
            <AboutExchange
              key={followup.id}
              prompt={followup.prompt}
              answer={followup.answer}
              typing={followup.id === typingTurnId}
            />
          ))}

          {canAskMore ? (
            <div className="mt-[26px]">
              <div className="flex flex-wrap gap-[10px]" aria-label="Suggested follow-ups">
                {remainingFollowups.slice(0, 3).map((followup) => (
                  <button
                    key={followup.id}
                    type="button"
                    onClick={() => onAboutFollowup?.(followup)}
                    className="
                      px-[14px] py-[8px] rounded-full
                      border border-[var(--color-paper-line)]
                      font-[family-name:var(--font-mono)] text-[13px]
                      text-[var(--color-ink-mid)]
                      hover:text-[var(--color-ink)]
                      hover:border-[var(--color-ink-soft)]
                      hover:bg-[rgba(27,26,22,0.025)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(192,84,46,0.35)]
                      transition-colors
                    "
                  >
                    {followup.prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-[28px]">
              <p className="m-0 mb-[14px] font-[family-name:var(--font-mono)] text-[13px] leading-[1.6] text-[var(--color-ink-soft)]">
                That is enough doorway conversation. The full version has more room.
              </p>
              <div className="flex flex-wrap gap-[12px]">
                {feature.ctas.map((cta) => (
                  <CtaButton key={cta.label} {...cta} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px] mt-[24px] pt-[20px]">
          <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-soft)]">
            Or if you meant something else:
          </span>
          {feature.alts.map((alt, i) => (
            <span key={`${alt.key}-${i}`} className="contents">
              {i > 0 && <span className="text-[var(--color-ink-faint)]">·</span>}
              <AltLink alt={alt} onAltSelect={onAltSelect} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutExchange({
  prompt,
  answer,
  typing,
}: {
  prompt: string;
  answer: string;
  typing?: boolean;
}) {
  return (
    <div className="mb-[28px] last:mb-0">
      <p className="m-0 mb-[10px] font-[family-name:var(--font-mono)] text-[15px] leading-[1.6] text-[var(--color-ink-mid)]">
        <span className="text-[var(--color-ink-faint)]">/ </span>
        {prompt.replace(/^\/\s*/, "")}
      </p>
      <p className="m-0 max-w-[66ch] font-[family-name:var(--font-serif)] text-[22px] leading-[1.55] text-[var(--color-ink)] max-[820px]:text-[19px]">
        {typing ? <TypedAnswer text={answer} /> : answer}
      </p>
    </div>
  );
}

function TypedAnswer({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setVisibleText(text), 0);
      return () => window.clearTimeout(timer);
    }

    if (!text) {
      return;
    }

    let i = 0;
    const timer = window.setInterval(() => {
      i += 2;
      setVisibleText(text.slice(0, i));
      if (i >= text.length) window.clearInterval(timer);
    }, 14);

    return () => window.clearInterval(timer);
  }, [text]);

  return (
    <>
      {visibleText}
      {visibleText.length < text.length && (
        <span className="text-[var(--color-ink-faint)]">|</span>
      )}
    </>
  );
}


function FeatureHero({ feature }: { feature: FeatureCard }) {
  if (feature.coverImageUrl) {
    return (
      <div className="relative aspect-[16/9] rounded-[10px] overflow-hidden border border-[rgba(27,26,22,0.06)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={feature.coverImageUrl}
          alt={feature.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute left-[16px] bottom-[14px] font-[family-name:var(--font-mono)] text-[12px] tracking-[0.16em] uppercase text-[var(--color-paper-panel)]">
          {feature.heroTag ?? feature.kicker}
        </span>
      </div>
    );
  }
  return (
    <div
      className="
        relative aspect-[16/9] rounded-[10px] overflow-hidden
        border border-[rgba(27,26,22,0.06)]
      "
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(192,84,46,0.08), transparent 60%), linear-gradient(135deg, #efe4d0 0%, #d9c9ae 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(135deg, transparent 0 26px, rgba(27,26,22,0.025) 26px 27px)",
          mixBlendMode: "multiply",
        }}
      />
      <span className="absolute left-[16px] bottom-[14px] font-[family-name:var(--font-mono)] text-[12px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)]">
        {feature.heroTag ?? feature.kicker}
      </span>
    </div>
  );
}

function FeatureThumbs({ feature }: { feature: FeatureCard }) {
  const labels = feature.thumbs ?? [];
  const images = feature.thumbImageUrls ?? [];
  const count = Math.max(labels.length, images.length, 3);
  const slots = Array.from({ length: count }, (_, i) => ({
    label: labels[i],
    image: images[i],
  }));
  return (
    <div className="flex flex-col gap-[4px] max-[820px]:flex-row">
      {slots.map((slot, i) => (
        <div
          key={`thumb-${i}`}
          className="flex-1 relative min-h-[58px] rounded-[10px] overflow-hidden border border-[rgba(27,26,22,0.06)]"
          style={
            slot.image
              ? undefined
              : {
                  background:
                    i === 1
                      ? "linear-gradient(135deg, #e4d7be 0%, #cebb99 100%)"
                      : i === 2
                        ? "linear-gradient(135deg, #efe5d2 0%, #d0bd9b 100%)"
                        : "radial-gradient(circle at 70% 30%, rgba(27,26,22,0.04), transparent 60%), linear-gradient(135deg, #ece1cc 0%, #dccba8 100%)",
                }
          }
        >
          {slot.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slot.image}
              alt={slot.label ?? ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {slot.label && (
            <span
              className={`absolute left-[12px] bottom-[10px] font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] uppercase ${
                slot.image ? "text-[var(--color-paper-panel)]" : "text-[var(--color-ink-soft)]"
              }`}
            >
              {slot.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function CtaButton({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: "primary" | "ghost";
}) {
  const base =
    "inline-flex items-center gap-2 px-[22px] py-[12px] rounded-[10px] font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase transition-colors duration-200";
  const style =
    variant === "primary"
      ? "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-black"
      : "bg-transparent border border-[var(--color-paper-line)] text-[var(--color-ink-mid)] hover:border-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[rgba(27,26,22,0.02)]";
  const isResume = href === "/resume" || href.startsWith("/resume?") || href.startsWith("/resume#");
  const external = href.startsWith("http") || href.startsWith("mailto:") || isResume;
  if (external) {
    const openInTab = href.startsWith("http") || isResume;
    return (
      <a
        href={href}
        className={`${base} ${style}`}
        target={openInTab ? "_blank" : undefined}
        rel={openInTab ? "noopener noreferrer" : undefined}
        onClick={isResume ? () => track("resume_click") : undefined}
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${style}`}>
      {label}
    </Link>
  );
}

function ReadTheStoryButton({
  label,
  href,
  panelRef,
  titleRef,
}: {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  panelRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
}) {
  const { navigate } = useCaseStudyTransition();
  const base =
    "inline-flex items-center gap-2 px-[22px] py-[12px] rounded-[10px] font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase transition-colors duration-200";
  const style = "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-black";
  return (
    <Link
      href={href}
      className={`${base} ${style}`}
      onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
        navigate(e, href, {
          titleEl: titleRef.current,
          anchorEl: panelRef.current,
        });
      }}
    >
      {label}
    </Link>
  );
}

function RandomSampleButton({
  feature,
  onAltSelect,
}: {
  feature: FeatureCard;
  onAltSelect?: (key: FeatureKey) => void;
}) {
  const options = feature.alts.filter((alt): alt is { key: FeatureKey; label: string; note?: string } =>
    alt.key !== "work"
  );
  if (!onAltSelect || options.length === 0) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const next = options[Math.floor(Math.random() * options.length)];
        onAltSelect(next.key);
      }}
      className="
        inline-flex items-center gap-2 px-[22px] py-[12px] rounded-[10px]
        font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase
        bg-transparent border border-[var(--color-paper-line)]
        text-[var(--color-ink-mid)]
        hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
        hover:bg-[rgba(192,84,46,0.04)]
        transition-colors duration-200
      "
    >
      Nah, Something Else
    </button>
  );
}

function AltLink({
  alt,
  onAltSelect,
}: {
  alt: { key: FeatureKey | "work"; label: string; note?: string };
  onAltSelect?: (key: FeatureKey) => void;
}) {
  const className =
    "inline-flex items-center gap-2 font-[family-name:var(--font-serif)] text-[15px] text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] hover:translate-x-[2px] transition-[color,transform] duration-150";
  const inner = (
    <>
      <span className="underline decoration-[var(--color-paper-line)] underline-offset-4">
        {alt.label}
      </span>
      {alt.note && (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-faint)]">
          {alt.note}
        </span>
      )}
    </>
  );
  if (alt.key === "work") {
    return (
      <Link href="/work" className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onAltSelect?.(alt.key as FeatureKey)}
      className={className}
    >
      {inner}
    </button>
  );
}
