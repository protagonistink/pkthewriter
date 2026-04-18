"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type WorkTile = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  year?: string;
  type?: string;
  imageUrl?: string;
};

type Props = { tiles: WorkTile[] };

// Curated aspect-ratio rotation. Each project claims one deterministically
// from its index — no random() chaos, so the column always composes.
const RATIOS = ["aspect-[4/5]", "aspect-[16/10]", "aspect-[3/4]", "aspect-[5/4]"] as const;

export function WorkGallery({ tiles }: Props) {
  return (
    <ol
      className="
        list-none m-0 p-0
        columns-1 sm:columns-2 lg:columns-3
        gap-x-[40px]
        max-[820px]:gap-x-[22px]
      "
    >
      {tiles.map((tile, i) => (
        <Tile key={tile.id} tile={tile} index={i} />
      ))}
    </ol>
  );
}

function Tile({ tile, index }: { tile: WorkTile; index: number }) {
  const ratio = RATIOS[index % RATIOS.length];
  const counter = String(index + 1).padStart(2, "0");
  const kickerParts = [tile.year, tile.type].filter(Boolean).join(" · ");

  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${(index % 3) * 70}ms` }}
      className={`
        break-inside-avoid mb-[56px] max-[820px]:mb-[38px]
        transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[28px]"}
      `}
    >
      <Link href={`/work/${tile.slug}`} className="group block">
        <header className="flex items-baseline gap-[14px] mb-[14px]">
          <span
            className="
              font-[family-name:var(--font-mono)]
              text-[10px] tracking-[0.28em] uppercase
              text-[var(--color-accent)]
              transition-colors duration-200
            "
          >
            N° {counter}
          </span>
          <span className="flex-1 h-px bg-[var(--color-paper-line)]" aria-hidden />
        </header>

        <h2
          className="
            font-[family-name:var(--font-serif)] font-normal
            text-[30px] leading-[1.05] tracking-[-0.012em]
            text-[var(--color-ink)] m-0 mb-[6px]
            transition-transform duration-[260ms] ease-out
            group-hover:translate-x-[4px]
            max-[820px]:text-[26px]
          "
        >
          {tile.brand}
        </h2>

        <p
          className="
            font-[family-name:var(--font-mono)]
            text-[11px] tracking-[0.2em] uppercase
            text-[var(--color-ink-soft)] m-0 mb-[18px]
            transition-colors duration-200
            group-hover:text-[var(--color-accent)]
          "
        >
          {kickerParts || tile.title}
        </p>

        {tile.imageUrl ? (
          <figure className={`relative m-0 overflow-hidden ${ratio}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tile.imageUrl}
              alt={`${tile.brand} — ${tile.title}`}
              loading="lazy"
              className="
                absolute inset-0 w-full h-full object-cover
                transition-[opacity,transform] duration-[500ms] ease-out
                opacity-[0.92] group-hover:opacity-100
                group-hover:scale-[1.01]
              "
            />
          </figure>
        ) : (
          <div
            className={`relative ${ratio} border border-[var(--color-paper-line)]`}
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(192,84,46,0.08), transparent 60%), linear-gradient(135deg, #efe4d0 0%, #d9c9ae 100%)",
            }}
          />
        )}

        {tile.title && tile.title !== tile.brand && (
          <figcaption
            className="
              font-[family-name:var(--font-serif)] italic
              text-[15px] leading-[1.4] tracking-[-0.003em]
              text-[var(--color-ink-mid)] m-0 mt-[14px]
              max-w-[40ch]
              transition-colors duration-200
              group-hover:text-[var(--color-ink)]
            "
          >
            {tile.title}
          </figcaption>
        )}
      </Link>
    </li>
  );
}
