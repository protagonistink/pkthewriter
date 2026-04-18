import Link from "next/link";
import { nextCaseStudy } from "@/lib/case-study-next";

export function CaseStudyHandoff({ currentSlug }: { currentSlug: string }) {
  const next = nextCaseStudy(currentSlug);

  return (
    <section className="px-[60px] pt-[140px] pb-[120px] max-[820px]:px-[24px] max-[820px]:pt-[100px] max-[820px]:pb-[80px]">
      <div className="max-w-[1200px] mx-auto">
        {next && (
          <Link
            href={`/work/${next.slug}`}
            className="block group mb-[70px] max-[820px]:mb-[52px]"
          >
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[22px]">
              NEXT —
            </div>
            <h2 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(42px,5vw,72px)] leading-[1] tracking-[-0.015em] m-0 mb-[18px] text-[var(--color-ink)] transition-transform duration-200 group-hover:translate-x-[6px]">
              {next.title}
              <span className="inline-block ml-[14px] text-[var(--color-ink-soft)] transition-colors duration-200 group-hover:text-[var(--color-accent)]">
                →
              </span>
            </h2>
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)]">
              {next.kicker}
            </div>
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[12px] font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-soft)] max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-y-[10px]">
          <Link
            href="/?ask=1"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            Or ask for something specific →
          </Link>
          <span className="text-[var(--color-ink-faint)] max-[820px]:hidden">·</span>
          <Link
            href="/work"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            See all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
