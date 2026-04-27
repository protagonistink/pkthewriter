"use client";

import { useEffect, useState } from "react";

type Props = {
  company: string;
  role: string;
  years: string;
  detail: string;
};

const MOBILE_MAX = 820;

/**
 * Experience card with a mobile-only collapse behavior.
 * Desktop (> 820px): role, tenure, detail are always visible — same layout as
 * the original always-on grid. Mobile (<= 820px): collapsed by default; the
 * company name acts as a tap target that toggles the body open.
 */
export function ExperienceCard({ company, role, years, detail }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mobile = window.innerWidth <= MOBILE_MAX;
    setIsMobile(mobile);
    setOpen(!mobile);
    const onResize = () => {
      const next = window.innerWidth <= MOBILE_MAX;
      setIsMobile(next);
      // Don't fight the user — only flip auto-open on a viewport crossing.
      setOpen((prev) => (next === mobile ? prev : !next));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const headingClasses =
    "font-[family-name:var(--font-serif)] text-[clamp(46px,7.2vw,108px)] font-normal leading-[0.92] tracking-[-0.045em] text-[var(--color-ink)]";
  const body = (
    <div className="mt-[28px] grid grid-cols-[200px_minmax(0,1fr)] gap-[36px] max-[820px]:mt-[18px] max-[820px]:grid-cols-1 max-[820px]:gap-[16px]">
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
  );

  return (
    <article className="border-b border-[var(--color-ink)] py-[44px] max-[820px]:py-[26px]">
      {isMobile ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="w-full text-left flex items-center justify-between gap-[14px]"
        >
          <h3 className={headingClasses}>{company}</h3>
          <span
            aria-hidden="true"
            className={`shrink-0 font-[family-name:var(--font-mono)] text-[28px] text-[var(--color-ink-soft)] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      ) : (
        <h3 className={headingClasses}>{company}</h3>
      )}
      {open && body}
    </article>
  );
}
