"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const PROJECT_TYPES = [
  "Campaign",
  "Brand Voice",
  "Copywriting",
  "Creative Direction",
  "Naming",
  "Deck / Presentation",
  "Other",
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number] | "";

// PRE-LAUNCH: Patrick to update Calendly URL.
const CALENDLY_URL = "https://calendly.com/patrickirkland";

type Props = { open: boolean; onClose: () => void };

export function ContactModal({ open, onClose }: Props) {
  const [form, setForm] = useState<{
    name: string;
    company: string;
    role: string;
    projectType: ProjectType;
    timeline: string;
    budget: string;
  }>({
    name: "",
    company: "",
    role: "",
    projectType: "",
    timeline: "",
    budget: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const message = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Role: ${form.role}`,
      `Project type: ${form.projectType}`,
      `Timeline: ${form.timeline}`,
      form.budget ? `Budget: ${form.budget}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context: "contact" }),
      });
      if (!r.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = `
    w-full font-[family-name:var(--font-mono)] text-[14px]
    border border-[var(--color-paper-line)] bg-[var(--color-paper-panel)]
    px-[14px] py-[10px] rounded-[6px]
    outline-none focus:border-[var(--color-ink-soft)]
    placeholder:text-[var(--color-ink-faint)]
    text-[var(--color-ink)]
  `;
  const labelClass = `font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)] block mb-[6px]`;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.32)] backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hire Patrick — contact form"
        className="
          fixed z-[70] inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2
          w-full sm:max-w-[520px] sm:rounded-[16px]
          bg-[var(--color-paper)] border border-[var(--color-paper-line)]
          shadow-[0_24px_64px_rgba(0,0,0,0.28)]
          max-h-[90vh] overflow-y-auto
        "
      >
        <div className="flex items-center justify-between px-[28px] pt-[24px] pb-[6px]">
          <h2 className="font-[family-name:var(--font-serif)] text-[22px] tracking-[-0.01em]">
            Let&apos;s work together.
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-[32px] h-[32px] grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        {status === "sent" ? (
          <div className="px-[28px] py-[32px] text-center">
            <p className="font-[family-name:var(--font-serif)] text-[20px] mb-[10px]">
              Got it. I&apos;ll be in touch.
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-soft)]">
              Typical reply time: within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="px-[28px] pt-[12px] pb-[28px] space-y-[16px]">
            <div className="grid grid-cols-2 gap-[12px] max-[430px]:grid-cols-1">
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Pat Smith"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company</label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Your Role</label>
              <input
                type="text"
                placeholder="VP Marketing"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Project Type *</label>
              <select
                required
                value={form.projectType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, projectType: e.target.value as ProjectType }))
                }
                className={inputClass + " appearance-none cursor-pointer"}
              >
                <option value="" disabled>
                  Select one
                </option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Timeline *</label>
              <input
                required
                type="text"
                placeholder="e.g. Start in June, 3-week sprint"
                value={form.timeline}
                onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Budget Range <span className="opacity-60">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. $5k–10k, TBD"
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                className={inputClass}
              />
            </div>
            {status === "error" && (
              <p className="font-[family-name:var(--font-mono)] text-[12px] text-red-700">
                Something broke on my end. Email patrick@pkthewriter.com directly.
              </p>
            )}
            <div className="flex flex-col gap-[10px] pt-[6px]">
              <button
                type="submit"
                disabled={status === "sending"}
                className="
                  w-full font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-[0.14em]
                  bg-[var(--color-ink)] text-[var(--color-paper)]
                  py-[13px] rounded-[6px]
                  hover:bg-[var(--color-accent)] transition-colors
                  disabled:opacity-50
                "
              >
                {status === "sending" ? "Sending…" : "Send →"}
              </button>
              <div className="flex flex-col items-center gap-[12px] pt-[4px] text-center">
                <a
                  href="mailto:patrick@pkthewriter.com"
                  className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                >
                  Or email me
                </a>
                <div>
                  <p className="font-[family-name:var(--font-serif)] text-[13px] text-[var(--color-ink-mid)] mb-[4px]">
                    Want to Zoom instead?
                  </p>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    Book 15 min →
                  </a>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
