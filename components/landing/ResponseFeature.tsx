"use client";

import Link from "next/link";
import type { FeatureCard, FeatureKey } from "@/lib/feature-resolver";

type Props = {
  feature: FeatureCard;
  onAltSelect?: (key: FeatureKey) => void;
};

export function ResponseFeature({ feature, onAltSelect }: Props) {
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
            "linear-gradient(180deg, var(--color-paper-panel) 0%, #fcf8ee 100%)",
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
              className="
                font-[family-name:var(--font-serif)] font-normal
                text-[44px] leading-[1] tracking-[-0.01em] m-0
                max-[820px]:text-[36px]
              "
            >
              {feature.title}
            </h2>
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-soft)]">
              {feature.kicker}
            </span>
          </header>

          <p
            className="
              font-[family-name:var(--font-serif)]
              text-[19px] leading-[1.6] text-[var(--color-ink-mid)]
              max-w-[62ch] m-0 mb-[28px]
            "
            dangerouslySetInnerHTML={{ __html: feature.copy }}
          />

          <div className="flex flex-wrap gap-[12px]">
            {feature.ctas.map((cta) => (
              <CtaButton key={cta.label} {...cta} />
            ))}
          </div>
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px] mt-[22px] pt-[20px]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-soft)]">
          Or if you meant something else —
        </span>
        {feature.alts.map((alt, i) => (
          <span key={`${alt.key}-${i}`} className="contents">
            {i > 0 && <span className="text-[var(--color-ink-faint)]">·</span>}
            <AltLink alt={alt} onAltSelect={onAltSelect} />
          </span>
        ))}
      </div>
    </section>
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
        <span className="absolute left-[16px] bottom-[14px] font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase text-[var(--color-paper-panel)]">
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
      <span className="absolute left-[16px] bottom-[14px] font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)]">
        {feature.heroTag ?? feature.kicker}
      </span>
    </div>
  );
}

function FeatureThumbs({ feature }: { feature: FeatureCard }) {
  const thumbs = feature.thumbs ?? [];
  return (
    <div className="flex flex-col gap-[4px] max-[820px]:flex-row">
      {thumbs.map((label, i) => (
        <div
          key={`${label}-${i}`}
          className="flex-1 relative min-h-[58px] rounded-[10px] border border-[rgba(27,26,22,0.06)]"
          style={{
            background:
              i === 1
                ? "linear-gradient(135deg, #e4d7be 0%, #cebb99 100%)"
                : i === 2
                  ? "linear-gradient(135deg, #efe5d2 0%, #d0bd9b 100%)"
                  : "radial-gradient(circle at 70% 30%, rgba(27,26,22,0.04), transparent 60%), linear-gradient(135deg, #ece1cc 0%, #dccba8 100%)",
          }}
        >
          <span className="absolute left-[12px] bottom-[10px] font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] uppercase text-[var(--color-ink-soft)]">
            {label}
          </span>
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
  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} className={`${base} ${style}`} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
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
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-faint)]">
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
