"use client";

import type { Exchange } from "@/lib/about-types";

type Links = { email: string; resume: string; work: string };

type Props = {
  exchanges: Exchange[];
  links: Links;
};

export function AboutPageView({ exchanges, links }: Props) {
  return (
    <div className="prose-view pt-[6vh] pb-[24vh] px-4 sm:px-6 lg:px-8">
      <div className="max-w-[720px] mx-auto">
        {exchanges.map((ex, i) => {
          if (ex.role === "visitor") {
            // Visitor lines become italic serif section headers
            const text = ex.text.replace(/^\/\s*/, "");
            return (
              <p
                key={i}
                className="
                  font-[family-name:var(--font-serif)] text-[18px] italic
                  text-[var(--color-ink-mid)] leading-[1.5]
                  mt-[40px] mb-[12px] first:mt-0
                "
              >
                {text}
              </p>
            );
          }
          return (
            <div key={i} className="mb-[20px]">
              <p
                className="
                  font-[family-name:var(--font-serif)] text-[17px] leading-[1.6]
                  text-[var(--color-ink)] mb-[12px]
                "
              >
                {ex.text}
              </p>
              {ex.artifact && (
                <div className="border-l border-[var(--color-paper-line)] pl-[14px] font-[family-name:var(--font-mono)]">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-soft)] mb-[8px]">
                    {ex.artifact.title}
                  </p>
                  <ul className="m-0 p-0 list-none space-y-[6px]">
                    {ex.artifact.items.map((item) => (
                      <li key={item} className="text-[13px] leading-[1.45] text-[var(--color-ink-mid)]">
                        / {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {/* Author block */}
        <div className="mt-[48px] pt-[24px] border-t border-[var(--color-paper-line)]">
          <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-soft)] tracking-[0.04em]">
            Written by Patrick Kirkland.{" "}
            <a
              href={`mailto:${links.email}`}
              className="underline hover:text-[var(--color-ink)] transition-colors"
            >
              email →
            </a>{" "}
            <a
              href={links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-ink)] transition-colors"
            >
              resume →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
