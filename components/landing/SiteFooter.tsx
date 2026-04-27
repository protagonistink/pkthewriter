"use client";

import Link from "next/link";
import Image from "next/image";

const CALENDLY_URL = "https://calendar.superhuman.com/book/11VL7tJ5Cd1dIChMDX/2T1Pl";
const PI_URL = "https://protagonist.ink";

const SITE_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/screenwriting", label: "Screenwriting" },
];

type Props = { dark?: boolean };

export function SiteFooter({ dark = false }: Props) {
  const t = dark
    ? {
        footer: "border-t border-[var(--color-dark-line)] bg-[var(--color-dark-panel)]",
        label: "text-[var(--color-dark-ink-soft)]",
        faint: "text-[var(--color-dark-ink-soft)]",
        link: "text-[var(--color-dark-ink-mid)] hover:text-[var(--color-dark-ink)]",
        icon: "text-[var(--color-dark-ink-soft)] hover:text-[var(--color-dark-ink)]",
        piName: "text-[var(--color-dark-ink)] group-hover:text-[var(--color-accent)]",
        piTag: "text-[var(--color-dark-ink-soft)]",
        divider: "border-[var(--color-dark-line)]",
        copy: "text-[var(--color-dark-ink-soft)]",
        logo: "/logo_white_trans.png",
      }
    : {
        footer: "border-t border-[var(--color-paper-line)] bg-[var(--color-paper)]",
        label: "text-[var(--color-ink-soft)]",
        faint: "text-[var(--color-ink-faint)]",
        link: "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
        icon: "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
        piName: "text-[var(--color-ink)] group-hover:text-[var(--color-accent)]",
        piTag: "text-[var(--color-ink-faint)]",
        divider: "border-[var(--color-paper-line-soft)]",
        copy: "text-[var(--color-ink-faint)]",
        logo: "/logo-signature.png",
      };

  return (
    <footer className={`${t.footer} px-[44px] py-[56px] max-[820px]:px-[22px] max-[820px]:py-[40px]`}>
      <div className="mx-auto max-w-[1320px]">

        {/* Main row */}
        <div className="flex items-start justify-between gap-[48px] max-[640px]:flex-col max-[640px]:gap-[36px]">

          {/* Left — identity */}
          <div className="shrink-0 min-w-0">
            <Link href="/" aria-label="Patrick Kirkland — Home" className="inline-block">
              <Image
                src={t.logo}
                alt="Patrick Kirkland"
                width={148}
                height={42}
                className="h-auto w-[148px] opacity-80"
              />
            </Link>
            <p className={`mt-[14px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.26em] ${t.label}`}>
              Writer and Creative Director
            </p>

            {/* Social icons */}
            <div className="mt-[18px] flex items-center gap-[16px]">
              <a
                href="https://www.linkedin.com/in/patrickkirkland/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className={`transition-colors ${t.icon}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:patrick@pkthewriter.com"
                aria-label="Email Patrick"
                title="Email"
                className={`transition-colors ${t.icon}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16v12H4z"/>
                  <path d="M4 7l8 6 8-6"/>
                </svg>
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a meeting"
                title="Book 15 min"
                className={`transition-colors ${t.icon}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right — nav columns */}
          <div className="flex gap-[56px] max-[480px]:gap-[36px]">

            {/* Site links */}
            <div>
              <p className={`mb-[16px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${t.faint}`}>
                Site
              </p>
              <ul className="m-0 p-0 list-none flex flex-col gap-[11px]">
                {SITE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] transition-colors ${t.link}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => document.dispatchEvent(new CustomEvent("open-contact-modal"))}
                    className={`font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] transition-colors cursor-pointer ${t.link}`}
                  >
                    Hire Patrick
                  </button>
                </li>
              </ul>
            </div>

            {/* Protagonist Ink */}
            <div>
              <p className={`mb-[16px] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] ${t.faint}`}>
                Studio
              </p>
              <a
                href={PI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className={`font-[family-name:var(--font-serif)] text-[15px] tracking-[-0.01em] transition-colors ${t.piName}`}>
                  Protagonist Ink
                  <span className="ml-[4px] opacity-40 group-hover:opacity-100 transition-opacity">↗</span>
                </span>
                <span className={`mt-[5px] block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.08em] leading-[1.5] ${t.piTag}`}>
                  Narrative strategy<br/>& consulting
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright strip */}
        <div className={`mt-[44px] pt-[18px] border-t ${t.divider} flex items-center justify-between gap-[12px] max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-[4px]`}>
          <p className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] ${t.copy}`}>
            © 2026 Patrick Kirkland
          </p>
          <p className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] ${t.copy}`}>
            pkthewriter.com
          </p>
        </div>

      </div>
    </footer>
  );
}
