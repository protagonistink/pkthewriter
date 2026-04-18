export function HeroIntro() {
  return (
    <div>
      <h1
        className="
          hero-h1
          font-[family-name:var(--font-serif)] font-normal
          text-[clamp(36px,4.6vw,60px)] leading-[1.08] tracking-[-0.01em]
          mt-[32px] mb-[22px] max-w-[22ch]
        "
      >
        Hey, I&apos;m Patrick, writer and creative director.
      </h1>
      <p
        className="
          hero-sub
          font-[family-name:var(--font-serif)] text-[18px]
          text-[var(--color-ink-mid)] m-0 mb-[34px]
        "
      >
        What do you wanna see first?
      </p>
    </div>
  );
}
