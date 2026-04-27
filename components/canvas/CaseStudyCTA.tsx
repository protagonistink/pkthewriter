"use client";

export function CaseStudyCTA() {
  return (
    <section className="mt-[60px] pt-[40px] border-t border-[var(--color-paper-line)]">
      <p className="font-[family-name:var(--font-serif)] text-[clamp(20px,2.4vw,28px)] leading-[1.3] tracking-[-0.01em] mb-[22px]">
        Need work like this?
      </p>
      <button
        type="button"
        onClick={() =>
          document.dispatchEvent(new CustomEvent("open-contact-modal"))
        }
        className="
          font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.22em]
          border border-[var(--color-paper-line)] px-[20px] py-[12px]
          text-[var(--color-ink)]
          hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]
          transition-colors
        "
      >
        Let&apos;s talk →
      </button>
    </section>
  );
}
