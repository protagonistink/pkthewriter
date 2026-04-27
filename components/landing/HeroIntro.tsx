type HeroIntroProps = { mode?: "full" | "receded" };

export function HeroIntro({ mode = "full" }: HeroIntroProps) {
  return (
    <div data-hero-mode={mode}>
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
    </div>
  );
}
