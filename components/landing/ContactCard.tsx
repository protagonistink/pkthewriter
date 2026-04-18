"use client";

import { useState } from "react";

type Variant = "hi" | "contact";

type Props = {
  variant: Variant;
  onLead: (message: string) => Promise<void>;
  onFallback: () => void;
};

const COPY: Record<Variant, { eyebrow: string; title: string; body: string }> = {
  hi: {
    eyebrow: "→ Hey back.",
    title: "What should I tell you about?",
    body: "Drop a line — a project, a question, an intro you want me to make. I read everything.",
  },
  contact: {
    eyebrow: "→ Sure.",
    title: "Patrick Kirkland",
    body: "Email, LinkedIn, or just tell me what you're working on below. I get back to every note, usually same day.",
  },
};

export function ContactCard({ variant, onLead, onFallback }: Props) {
  const copy = COPY[variant];
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || status === "sending") return;
    setStatus("sending");
    try {
      await onLead(trimmed);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="response-slot mt-[34px]" aria-live="polite">
      <p className="font-[family-name:var(--font-mono)] text-[13px] leading-[1.6] text-[var(--color-ink-mid)] mb-[22px]">
        <span className="text-[var(--color-accent)] mr-1">→</span>
        {copy.eyebrow.replace(/^→\s*/, "")}
      </p>

      <article
        className="overflow-hidden rounded-[22px] border border-[var(--color-paper-line)] shadow-[var(--shadow-soft)]"
        style={{ background: "linear-gradient(180deg, var(--color-paper-panel) 0%, #fcf8ee 100%)" }}
      >
        <div className="px-[42px] py-[38px] max-[820px]:px-[26px] max-[820px]:py-[28px]">
          <h2 className="font-[family-name:var(--font-serif)] font-normal text-[44px] leading-[1] tracking-[-0.01em] m-0 mb-[14px] max-[820px]:text-[36px]">
            {copy.title}
          </h2>
          <p className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.6] text-[var(--color-ink-mid)] max-w-[62ch] m-0 mb-[22px]">
            {copy.body}
          </p>

          {status !== "sent" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[12px]" autoComplete="off">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="A sentence is enough."
                rows={3}
                className="
                  w-full px-[20px] py-[16px]
                  font-[family-name:var(--font-mono)] text-[14px]
                  text-[var(--color-ink)]
                  bg-[var(--color-paper)]
                  border border-[var(--color-paper-line)]
                  rounded-[14px]
                  outline-none resize-none
                  placeholder:text-[var(--color-ink-faint)]
                  focus:border-[var(--color-ink-soft)]
                "
              />
              <div className="flex flex-wrap items-center gap-[14px]">
                <button
                  type="submit"
                  disabled={!value.trim() || status === "sending"}
                  className="inline-flex items-center gap-2 px-[22px] py-[12px] rounded-[10px] font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === "sending" ? "Sending…" : "Send →"}
                </button>
                <a
                  href="mailto:patrick@pkthewriter.com"
                  className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase text-[var(--color-ink-mid)] hover:text-[var(--color-ink)]"
                >
                  Email
                </a>
                {variant === "contact" && (
                  <a
                    href="https://www.linkedin.com/in/patrickkirkland/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase text-[var(--color-ink-mid)] hover:text-[var(--color-ink)]"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
              {status === "error" && (
                <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-accent)]">
                  That didn&apos;t send — try email instead.
                </p>
              )}
            </form>
          ) : (
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-mid)]">
              <span className="text-[var(--color-accent)] mr-1">•</span>
              Got it. I&apos;ll reply directly.
            </p>
          )}
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px] mt-[22px] pt-[20px]">
        <button
          type="button"
          onClick={onFallback}
          className="font-[family-name:var(--font-serif)] text-[15px] text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] underline decoration-[var(--color-paper-line)] underline-offset-4"
        >
          Or did you want to talk about something else?
        </button>
      </div>
    </section>
  );
}
