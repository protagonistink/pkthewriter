"use client";

import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { nextCaseStudy } from "@/lib/case-study-next";
import { useCaseStudyTransition } from "@/lib/use-case-study-transition";

export function CaseStudyHandoff({ currentSlug }: { currentSlug: string }) {
  const next = nextCaseStudy(currentSlug);
  const nextLabel = next?.brand ?? next?.title;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { navigate } = useCaseStudyTransition();

  return (
    <section className="px-[60px] pt-[140px] pb-[120px] max-[820px]:px-[24px] max-[820px]:pt-[100px] max-[820px]:pb-[80px]">
      <div className="max-w-[1200px] mx-auto">
        {next && (
          <Link
            ref={linkRef}
            href={`/work/${next.slug}`}
            className="block group mb-[70px] max-[820px]:mb-[52px]"
            onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
              navigate(e, `/work/${next.slug}`, {
                titleEl: titleRef.current,
                anchorEl: linkRef.current,
              });
            }}
          >
            <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[22px]">
              NEXT —
            </div>
            <h2 ref={titleRef} className="font-[family-name:var(--font-serif)] font-normal text-[clamp(42px,5vw,72px)] leading-[1] tracking-[-0.015em] m-0 mb-[18px] text-[var(--color-ink)] transition-transform duration-200 group-hover:translate-x-[6px]">
              {nextLabel}
              <span className="inline-block ml-[14px] text-[var(--color-ink-soft)] transition-colors duration-200 group-hover:text-[var(--color-accent)]">
                →
              </span>
            </h2>
            <div className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)]">
              {next.kicker}
            </div>
          </Link>
        )}

        <div className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-soft)]">
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
