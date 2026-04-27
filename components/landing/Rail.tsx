"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>
    ),
  },
  {
    href: "/work",
    label: "Work",
    match: (p) => p.startsWith("/work"),
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    match: (p) => p.startsWith("/about"),
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    ),
  },
];

// Mobile drawer adds a Contact entry that opens the Hire Me modal. Desktop
// keeps the lean rail (Home / Work / Writing / About only) since the
// header CTA is always visible there.
const DRAWER_CONTACT_ITEM: Item = {
  href: "#contact",
  label: "Contact",
  match: () => false,
  external: true,
  icon: (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>
  ),
};

export function Rail({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  const items = ITEMS;
  const drawerItems = [...ITEMS, DRAWER_CONTACT_ITEM];

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setExpanded(true);
    document.addEventListener("toggle-rail", handler);
    return () => document.removeEventListener("toggle-rail", handler);
  }, []);

  return (
    <>
      {/* Mobile hamburger trigger — fixed, visible under 769px */}
      <button
        type="button"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav-drawer"
        onClick={() => setMobileOpen((v) => !v)}
        className="
          fixed top-[14px] left-[14px] z-50
          w-[44px] h-[44px] grid place-items-center
          bg-[var(--color-paper-panel)] border border-[var(--color-paper-line)]
          rounded-[8px] text-[var(--color-ink-soft)]
          hover:text-[var(--color-ink)] transition-colors
          min-[769px]:hidden
        "
      >
        {mobileOpen ? (
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Desktop static rail — hidden on mobile */}
      <aside
        aria-label="Site navigation"
        data-expanded={expanded}
        className="
          sticky top-0 h-screen overflow-y-auto
          flex flex-col
          bg-[var(--color-paper)]
          border-r border-[var(--color-paper-line)]
          pt-[22px]
          transition-[width] duration-[260ms] ease
          w-[68px] data-[expanded=true]:w-[210px]
          max-[768px]:hidden
        "
      >
        <div className="px-[18px] pb-[34px] flex justify-start">
          <button
            type="button"
            aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
            title={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="w-[30px] h-[30px] grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
              group relative flex items-center gap-[14px] px-[10px] py-[10px]
              rounded-[8px] whitespace-nowrap overflow-hidden
              text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]
              hover:bg-[rgba(27,26,22,0.05)]
              transition duration-[260ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]
              ${current ? "!text-[var(--color-ink)]" : ""}
            `;
            const content = (
              <>
                {current ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-[2px] bg-[var(--color-accent)]"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[1px] h-[14px] rounded-[1px] bg-[var(--color-ink)] opacity-0 group-hover:opacity-50 transition-opacity duration-[260ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                  />
                )}
                <span className="shrink-0 w-[20px] flex justify-center">{item.icon}</span>
                <span
                  className={`
                    font-[family-name:var(--font-serif)] text-[17px]
                    transition-[opacity,transform] duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] delay-[40ms]
                    ${expanded ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-[8px] pointer-events-none"}
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
      </aside>

      {/* Mobile drawer — full-height overlay, visible when mobileOpen */}
      {mobileOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.32)] min-[769px]:hidden"
          />
          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="
              fixed inset-0 z-50
              bg-[var(--color-paper)]
              flex flex-col pt-[14px]
              min-[769px]:hidden
            "
          >
            <div className="px-[14px] pb-[24px] flex justify-end">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="w-[44px] h-[44px] grid place-items-center text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
              >
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Primary" className="flex flex-col px-[28px] gap-[8px]">
              {drawerItems.map((item) => {
                const current = item.match(pathname);
                const isContact = item.href === "#contact";
                const className = `
                  group relative flex items-baseline gap-[18px] py-[10px]
                  text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]
                  transition-colors text-left
                  ${current ? "!text-[var(--color-ink)]" : ""}
                `;
                const content = (
                  <>
                    {current && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-[4px] h-[28px] rounded-[2px] bg-[var(--color-accent)]"
                      />
                    )}
                    <span className="font-[family-name:var(--font-serif)] text-[clamp(40px,11vw,56px)] leading-[1.05] tracking-[-0.02em]">
                      {item.label}
                    </span>
                  </>
                );
                if (isContact) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        document.dispatchEvent(new CustomEvent("open-contact-modal"));
                      }}
                      className={className}
                    >
                      {content}
                    </button>
                  );
                }
                if (item.external) {
                  return (
                    <a key={item.label} href={item.href} className={className}>
                      {content}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
