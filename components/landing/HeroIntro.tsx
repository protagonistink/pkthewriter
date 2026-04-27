type HeroIntroProps = { mode?: "full" | "receded" };

export function HeroIntro({ mode = "full" }: HeroIntroProps) {
  const receded = mode === "receded";

  return (
    <div data-hero-mode={mode}>
      {/* Task 9: Positioning + availability — hidden when receded */}
      <div
        className={`transition-[opacity,max-height] duration-200 overflow-hidden ${receded ? "opacity-0 pointer-events-none max-h-0" : "opacity-100 max-h-[120px]"}`}
      >
        <p className="font-[family-name:var(--font-serif)] text-[18px] text-[var(--color-ink-mid)] leading-[1.3] mb-[6px] max-w-[52ch]">
          Freelance creative director and copywriter for brands that need their
          story to land fast.
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.24em] uppercase text-[var(--color-ink-soft)] mb-[10px]">
          Booking Q3 2026 · Reply within 24 hours
        </p>
      </div>

      <h1
        className="
          hero-h1
          font-[family-name:var(--font-serif)] font-normal
          text-[clamp(30px,4.6vw,60px)] leading-[1.08] tracking-[-0.01em]
          mt-[22px] mb-[18px] max-w-[22ch]
          max-[820px]:text-[clamp(28px,7vw,40px)] max-[820px]:mt-[14px] max-[820px]:mb-[14px]
        "
        style={{ viewTransitionName: "hero-title" }}
      >
        Hey, I&apos;m Patrick, writer and creative director.
      </h1>
      <p
        className="
          hero-sub
          font-[family-name:var(--font-serif)] text-[18px]
          text-[var(--color-ink-mid)] m-0 mb-[28px]
          max-[820px]:text-[15px] max-[820px]:mb-[20px]
        "
      >
        Ask me something. Writing, brands, or why most of it doesn&apos;t work.
      </p>

      {/* Task 8: Above-fold CTA cluster — hidden when receded */}
      <div
        className={`flex flex-wrap gap-[10px] mt-[8px] mb-[4px] transition-opacity duration-200 ${receded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <a
          href="/work"
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
        >
          See selected work →
        </a>
        <span className="text-[var(--color-paper-line)] select-none">·</span>
        <a
          href="/resume"
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
        >
          Download resume →
        </a>
        <span className="text-[var(--color-paper-line)] select-none">·</span>
        <a
          href="https://calendly.com/patrickirkland"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.14em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
        >
          Book 15 min →
        </a>
      </div>
    </div>
  );
}
