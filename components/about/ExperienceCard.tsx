"use client";

import { useEffect, useState } from "react";

type Props = {
  company: string;
  role: string;
  years: string;
  detail: string;
};

const MOBILE_MAX = 820;

const getIsMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= MOBILE_MAX;

export function ExperienceCard({ company, role, years, detail }: Props) {
  const [state, setState] = useState(() => {
    const isMobile = getIsMobile();
    return { isMobile, open: !isMobile };
  });
  const { isMobile, open } = state;

  useEffect(() => {
    const onResize = () => {
      const next = getIsMobile();
      setState((prev) => ({
        isMobile: next,
        open: next === prev.isMobile ? prev.open : !next,
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const headingClasses =
    "font-[family-name:var(--font-serif)] text-[clamp(46px,7.2vw,108px)] font-normal leading-[0.92] tracking-[-0.045em] text-[var(--color-ink)]";

  if (isMobile) {
    return (
      <article className="border-b border-[var(--color-ink)] py-[26px]">
        <div className="flex items-center justify-between gap-[14px]">
          <h3 className={headingClasses}>{company}</h3>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Collapse details" : "Expand details"}
            onClick={() => setState((prev) => ({ ...prev, open: !prev.open }))}
            className="shrink-0 w-[36px] h-[36px] grid place-items-center text-[var(--color-ink-soft)]"
          >
            <span
              aria-hidden="true"
              className={`block font-[family-name:var(--font-mono)] text-[28px] leading-none transition-transform duration-200 ${open ? "rotate-45" : ""}`}
            >
              +
            </span>
          </button>
        </div>

        {/* Role always visible */}
        <p className="mt-[8px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
          {role}
        </p>

        {/* Collapsible: tenure + detail only */}
        {open && (
          <div className="mt-[18px] flex flex-col gap-[14px]">
            <dl className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] leading-[1.4]">
              <dt className="text-[var(--color-accent)]">Tenure</dt>
              <dd className="mt-[4px] text-[var(--color-ink)]">{years}</dd>
            </dl>
            <p className="m-0 font-[family-name:var(--font-serif)] text-[clamp(20px,5vw,28px)] leading-[1.32] tracking-[-0.018em] text-[var(--color-ink)]">
              {detail}
            </p>
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="border-b border-[var(--color-ink)] py-[44px]">
      <h3 className={headingClasses}>{company}</h3>
      <div className="mt-[28px] grid grid-cols-[200px_minmax(0,1fr)] gap-[36px]">
        <dl className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] leading-[1.4]">
          <dt className="text-[var(--color-accent)]">Role</dt>
          <dd className="mt-[4px] mb-[14px] text-[var(--color-ink)]">{role}</dd>
          <dt className="text-[var(--color-accent)]">Tenure</dt>
          <dd className="mt-[4px] text-[var(--color-ink)]">{years}</dd>
        </dl>
        <p className="m-0 max-w-[58ch] font-[family-name:var(--font-serif)] text-[clamp(22px,2.4vw,30px)] leading-[1.32] tracking-[-0.018em] text-[var(--color-ink)]">
          {detail}
        </p>
      </div>
    </article>
  );
}
