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

const RATIOS = ["aspect-[4/5]", "aspect-[16/10]", "aspect-[3/4]", "aspect-[5/4]"] as const;

export function WorkGallery({ tiles }: Props) {
  return (
    <ol
      className="
        work-gallery
        list-none m-0 p-0
        columns-1 sm:columns-2 lg:columns-3
        gap-x-[28px] max-[820px]:gap-x-[18px]
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

  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => setVisible(true);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
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
        break-inside-avoid mb-[28px] max-[820px]:mb-[18px]
        transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[28px]"}
      `}
    >
      <Link
        href={`/work/${tile.slug}`}
        className="group relative block overflow-hidden"
      >
        {tile.imageUrl ? (
          <figure className={`relative m-0 ${ratio}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tile.imageUrl}
              alt={`${tile.brand} — ${tile.title}`}
              loading="lazy"
              className="
                absolute inset-0 w-full h-full object-cover
                transition-transform duration-[600ms] ease-out
                group-hover:scale-[1.015]
              "
            />
            <Overlay tile={tile} />
          </figure>
        ) : (
          <div
            className={`relative ${ratio} border border-[var(--color-paper-line)]`}
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(192,84,46,0.08), transparent 60%), linear-gradient(135deg, #efe4d0 0%, #d9c9ae 100%)",
            }}
          >
            <Overlay tile={tile} dark />
          </div>
        )}
      </Link>
    </li>
  );
}

function Overlay({ tile, dark = false }: { tile: WorkTile; dark?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`
          absolute inset-x-0 bottom-0 h-[55%] pointer-events-none
          ${dark ? "bg-gradient-to-t from-[rgba(27,26,22,0.35)] via-[rgba(27,26,22,0.08)] to-transparent" : "bg-gradient-to-t from-black/60 via-black/15 to-transparent"}
        `}
      />
      <div
        className={`
          absolute left-[18px] right-[18px] bottom-[16px]
          max-[820px]:left-[14px] max-[820px]:right-[14px] max-[820px]:bottom-[13px]
          flex flex-col gap-[6px]
          ${dark ? "text-[var(--color-ink)]" : "text-[var(--color-paper)]"}
        `}
      >
        <span
          className="
            font-[family-name:var(--font-mono)]
            text-[10px] tracking-[0.24em] uppercase
            opacity-90
          "
        >
          {tile.brand}
        </span>
        {tile.type && (
          <span
            className="
              font-[family-name:var(--font-mono)]
              text-[9px] tracking-[0.22em] uppercase
              opacity-70
            "
          >
            {tile.type}
          </span>
        )}
        <span
          className="
            font-[family-name:var(--font-serif)] font-normal
            text-[18px] leading-[1.2] tracking-[-0.005em]
            mt-[2px] max-[820px]:text-[16px]
          "
        >
          {tile.title}
        </span>
      </div>
    </>
  );
}
