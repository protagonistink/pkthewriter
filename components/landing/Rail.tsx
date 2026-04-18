"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FALLBACK_EMAIL = "patrick@pkthewriter.com";

type Item = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
  external?: boolean;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    href: "/",
    label: "Home",
    match: (p) => p === "/",
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>
    ),
  },
  {
    href: "/work",
    label: "Work",
    match: (p) => p.startsWith("/work"),
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    ),
  },
  {
    href: "/writing",
    label: "Writing",
    match: (p) => p.startsWith("/writing"),
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    match: (p) => p.startsWith("/about"),
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    ),
  },
];

const CONTACT_ITEM: Item = {
  href: `mailto:${FALLBACK_EMAIL}`,
  label: "Contact",
  match: () => false,
  external: true,
  icon: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>
  ),
};

export function Rail({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const pathname = usePathname() ?? "/";

  const items = [...ITEMS, CONTACT_ITEM];

  return (
    <aside
      aria-label="Site navigation"
      data-expanded={expanded}
      className="
        relative flex flex-col self-stretch
        bg-[var(--color-paper)]
        border-r border-[var(--color-paper-line)]
        pt-[22px]
        transition-[width] duration-[260ms] ease
        w-[68px] data-[expanded=true]:w-[210px]
      "
    >
      <div className="px-[18px] pb-[34px] flex justify-start">
        <button
          type="button"
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="w-[30px] h-[30px] grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-[260ms] ease ${expanded ? "rotate-180" : ""}`}
          >
            <polyline points="8 6 14 12 8 18" />
            <polyline points="14 6 20 12 14 18" />
          </svg>
        </button>
      </div>

      <nav aria-label="Primary" className="flex flex-col gap-[2px] px-[10px]">
        {items.map((item) => {
          const current = item.match(pathname);
          const className = `
            relative flex items-center gap-[14px] px-[10px] py-[10px]
            rounded-[8px] whitespace-nowrap overflow-hidden
            text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]
            hover:bg-[rgba(27,26,22,0.03)]
            transition-colors duration-150
            ${current ? "!text-[var(--color-ink)]" : ""}
          `;
          const content = (
            <>
              {current && (
                <span
                  aria-hidden="true"
                  className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[2px] bg-[var(--color-accent)]"
                />
              )}
              <span className="shrink-0 w-[20px] flex justify-center">{item.icon}</span>
              <span
                className={`
                  font-[family-name:var(--font-serif)] text-[15px]
                  transition-[opacity,transform] duration-[220ms] ease delay-[60ms]
                  ${expanded ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-[6px] pointer-events-none"}
                `}
              >
                {item.label}
              </span>
            </>
          );
          if (item.external) {
            return (
              <a key={item.label} href={item.href} title={item.label} className={className}>
                {content}
              </a>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              aria-current={current ? "page" : undefined}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div
        className={`
          mt-auto px-[20px] pt-[18px] pb-[22px] whitespace-nowrap
          font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] uppercase
          text-[var(--color-ink-soft)]
          transition-opacity duration-[220ms] ease delay-[100ms]
          ${expanded ? "opacity-100" : "opacity-0"}
        `}
      >
        The old way
      </div>
    </aside>
  );
}
