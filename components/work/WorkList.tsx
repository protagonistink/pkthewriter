"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCaseStudyTransition } from "@/lib/use-case-study-transition";

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

type Slot = {
  side: "left" | "right";
  inset: string;
  width: string;
  rotate: string;
};

const SLOTS: readonly Slot[] = [
  { side: "right", inset: "6%",  width: "clamp(260px,26vw,420px)", rotate: "-1.25deg" },
  { side: "right", inset: "14%", width: "clamp(280px,28vw,440px)", rotate: "0.5deg"   },
  { side: "left",  inset: "8%",  width: "clamp(240px,24vw,380px)", rotate: "1deg"     },
] as const;

function derivePillText(tile: WorkTile): string {
  const yearMatch = (tile.year ?? "").match(/\d{4}(?:[–-]\d{2,4})?/)?.[0];
  return yearMatch ?? tile.type ?? "";
}

export function WorkList({ tiles }: Props) {
  const router = useRouter();
  const { navigate: transitionNavigate } = useCaseStudyTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.dataset.route = "work-index";
    return () => {
      if (document.body.dataset.route === "work-index") {
        delete document.body.dataset.route;
      }
    };
  }, []);

  useEffect(() => {
    tiles.forEach((t) => {
      if (!t.slug) return;
      router.prefetch(`/work/${t.slug}`);
    });
  }, [tiles, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Persist /work scroll position so CaseStudyTransitions' back-nav fallback
  // can detect a mismatch and run the short crossfade instead of the switch.
  useEffect(() => {
    const writeScroll = () => {
      try {
        window.sessionStorage.setItem("workScrollY", String(window.scrollY));
      } catch {
        // ignore
      }
    };
    window.addEventListener("beforeunload", writeScroll);
    return () => window.removeEventListener("beforeunload", writeScroll);
  }, []);

  const markInteracted = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  const navigate = (e: ReactMouseEvent, slug: string, id: string) => {
    markInteracted();
    setActiveId(id);
    const anchorEl = e.currentTarget as HTMLElement;
    const titleEl = anchorEl.querySelector<HTMLElement>(".work-list__title");
    transitionNavigate(e, `/work/${slug}`, { titleEl, anchorEl });
  };

  return (
    <section className="work-list relative min-h-[72vh] max-[820px]:min-h-0">
      <ol
        className="work-list__items relative z-10 m-0 list-none p-0"
        data-any-active={activeId ? "true" : "false"}
      >
        {tiles.map((t, i) => {
          const slot = SLOTS[i % SLOTS.length];
          const pillText = derivePillText(t);
          return (
            <li key={t.id} className="m-0 relative">
              <Link
                href={`/work/${t.slug}`}
                data-active={activeId === t.id ? "true" : "false"}
                onClick={(e) => navigate(e, t.slug, t.id)}
                onMouseEnter={() => { markInteracted(); setActiveId(t.id); }}
                onMouseLeave={() => setActiveId((cur) => (cur === t.id ? null : cur))}
                onFocus={() => { markInteracted(); setActiveId(t.id); }}
                onBlur={() => setActiveId((cur) => (cur === t.id ? null : cur))}
                className="
                  work-list__link
                  group relative block no-underline
                  py-0 max-[820px]:py-[10px]
                  flex items-baseline max-[820px]:items-center gap-[18px] max-[820px]:gap-[14px]
                  cursor-pointer
                  min-[821px]:w-fit
                "
              >
                <MobileThumb tile={t} />

                <span
                  className="
                    work-list__index
                    font-[family-name:var(--font-mono)]
                    text-[11px] tracking-[0.22em] uppercase
                    text-[var(--color-ink-soft)]
                    self-center mr-[6px]
                    max-[820px]:hidden
                    tabular-nums
                  "
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="
                    work-list__title
                    font-[family-name:var(--font-serif)]
                    font-[500]
                    text-[clamp(64px,9vw,160px)]
                    max-[820px]:text-[clamp(40px,8vw,64px)]
                    max-[430px]:text-[clamp(28px,7vw,40px)]
                    leading-[0.88]
                    tracking-[-0.02em]
                    [text-wrap:balance]
                    min-w-0 max-w-full [overflow-wrap:break-word]
                  "
                >
                  {t.brand}
                </span>
              </Link>

              {t.type && (
                <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-ink-soft)] mt-[4px] mb-0 tracking-[0.06em] max-[820px]:hidden">
                  {t.type}
                </p>
              )}

              {pillText && (
                <span
                  className="
                    work-list__pill
                    font-[family-name:var(--font-mono)]
                    text-[11px] tracking-[0.18em] uppercase
                    inline-flex items-center
                    px-[10px] py-[2px] rounded-full
                    border border-[var(--color-paper-line)]
                    text-[var(--color-ink-soft)]
                    whitespace-nowrap
                    absolute top-[18px] right-0
                    max-[820px]:hidden
                  "
                  aria-hidden="true"
                >
                  {pillText}
                </span>
              )}

              <CoverFigure
                tile={t}
                slot={slot}
                isActive={activeId === t.id}
                isPrimer={i === 0 && !hasInteracted && activeId === null}
              />
            </li>
          );
        })}
      </ol>

      <div
        aria-hidden="true"
        data-visible={!scrolled && tiles.length > 4 ? "true" : "false"}
        className="
          work-list__scroll-cue
          fixed bottom-[22px] right-[28px] z-10
          pointer-events-none
          font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase
          text-[var(--color-ink-soft)]
          flex items-center gap-[8px]
          max-[820px]:hidden
        "
      >
        <span>Scroll</span>
        <span aria-hidden="true" className="work-list__scroll-cue-arrow">↓</span>
      </div>
    </section>
  );
}

function CoverFigure({
  tile,
  slot,
  isActive,
  isPrimer,
}: {
  tile: WorkTile;
  slot: Slot;
  isActive: boolean;
  isPrimer: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.style.viewTransitionName = isActive ? `work-cover-${tile.slug}` : "";
  }, [isActive, tile.slug]);

  if (!tile.imageUrl) return null;

  const horizontal = slot.side === "right" ? { right: slot.inset } : { left: slot.inset };
  const style: CSSProperties & Record<"--rot", string> = {
    ...horizontal,
    width: slot.width,
    "--rot": slot.rotate,
  };

  return (
    <figure
      className="work-list__cover absolute m-0 hidden md:block"
      data-active={isActive ? "true" : "false"}
      data-primer={isPrimer ? "true" : "false"}
      aria-hidden="true"
      style={style}
    >
      <div
        ref={frameRef}
        className="w-full aspect-[4/3] overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tile.imageUrl}
          alt={`${tile.brand} — ${tile.title} cover`}
          loading="eager"
          decoding="async"
          className="block w-full h-full object-cover pointer-events-none select-none shadow-[0_18px_40px_-18px_rgba(20,14,6,0.18)]"
        />
      </div>
    </figure>
  );
}

function MobileThumb({ tile }: { tile: WorkTile }) {
  if (!tile.imageUrl) return null;
  return (
    <span
      className="
        hidden max-[820px]:inline-block shrink-0
        w-[64px] aspect-[4/3] overflow-hidden rounded-[6px]
        bg-[var(--color-paper-panel,rgba(0,0,0,0.04))]
      "
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.imageUrl}
        alt={`${tile.brand} — ${tile.title} cover`}
        loading="lazy"
        decoding="async"
        className="block w-full h-full object-cover"
      />
    </span>
  );
}
