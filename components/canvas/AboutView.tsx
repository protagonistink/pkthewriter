"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PortableText } from "@portabletext/react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage } from "@/lib/sanity/types";
import { StreamingText } from "./StreamingText";
import { ScrollProgress } from "./ScrollProgress";
import { AboutStatBar } from "./AboutStatBar";
import { AboutFloatingNav } from "./AboutFloatingNav";
import { AboutFab } from "./AboutFab";

// ---------- Terminal query marker ----------

function QueryMarker({ query }: { query: string }) {
  return (
    <div
      aria-hidden="true"
      className="
        absolute top-[28px] right-[32px] z-20
        font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.08em]
        text-[var(--color-dark-ink-soft)]
        max-[640px]:top-[18px] max-[640px]:right-[18px]
      "
    >
      <span className="text-[var(--color-accent)]">[</span>
      <span className="px-[0.5ch]">
        <span className="text-[var(--color-accent)]">/</span>
        {query}
      </span>
      <span className="text-[var(--color-accent)]">]</span>
    </div>
  );
}

// ---------- Chapter I — Identity (hero + character reveal) ----------

function ChapterIdentity({ photoUrl }: { photoUrl?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 0.98]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Beat 2 (identity list) — chain line-by-line
  const [lineStep, setLineStep] = useState(0);

  const allLines: { text: string; italic?: boolean; rye?: boolean }[] = [
    { text: "curiosity-driven." },
    { text: "believes where there's a will, there's a way.", italic: true },
    { text: "husband. dad. coffee lover." },
    { text: "old fashioned drinker, *preferably rye.", rye: true },
    { text: "writer. teacher. adventurer.", italic: true },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full"
      aria-labelledby="chapter-identity"
    >
      <QueryMarker query="query: identity" />

      {/* Beat 1 — Hero, 100vh */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <h1 id="chapter-identity" className="sr-only">
          Identity
        </h1>

        {/* Portrait (Layer 2, ~0.7x) */}
        {photoUrl && (
          <motion.div
            style={reduce ? undefined : { y: portraitY, scale: portraitScale }}
            className="
              relative z-10
              w-[min(88vw,320px)] h-[min(110vw,420px)]
              sm:w-[380px] sm:h-[500px]
              md:w-[440px] md:h-[580px]
              mt-[40px]
            "
          >
            <img
              src={photoUrl}
              alt="Patrick Kirkland"
              className="
                w-full h-full object-cover
                [filter:grayscale(0.25)_contrast(1.08)_brightness(0.92)]
              "
              draggable={false}
            />
            <div className="absolute inset-0 bg-[var(--color-dark-bg)]/15 mix-blend-multiply pointer-events-none" />
          </motion.div>
        )}

        {/* Headline — carved via mix-blend-difference */}
        <motion.h2
          style={reduce ? undefined : { y: headlineY }}
          className="
            absolute inset-x-0 top-[14%]
            px-4 text-center
            font-[family-name:var(--font-serif)]
            font-[450] leading-[0.88] tracking-[-0.02em]
            text-white mix-blend-difference
            pointer-events-none select-none
            z-20
            text-[clamp(48px,9vw,120px)]
          "
        >
          <span className="block">
            <StreamingText text="It starts with" immediate speed={55} />
          </span>
          <span className="block italic font-light">
            <StreamingText text="character." immediate speed={55} startDelay={14 * 55} />
          </span>
        </motion.h2>

        {/* Scroll cue */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 2.9, duration: 0.6 }}
          className="
            absolute bottom-[36px] left-1/2 -translate-x-1/2 z-20
            font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.32em]
            text-[var(--color-dark-ink-soft)]
          "
        >
          scroll ↓
        </motion.div>
      </div>

      {/* Beat 2 — Character list */}
      <div className="relative py-[22vh] flex flex-col items-center px-4">
        <IdentityList
          lines={allLines}
          step={lineStep}
          onLineDone={(i) => setLineStep((prev) => Math.max(prev, i + 1))}
        />
      </div>
    </section>
  );
}

function IdentityList({
  lines,
  step,
  onLineDone,
}: {
  lines: { text: string; italic?: boolean; rye?: boolean }[];
  step: number;
  onLineDone: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const [triggered, setTriggered] = useState(false);

  return (
    <InViewGate
      onEnter={() => setTriggered(true)}
      className="w-full max-w-[720px] text-center"
    >
      <ul
        className="
          flex flex-col gap-[1em]
          font-[family-name:var(--font-serif)]
          text-[clamp(22px,3.4vw,40px)] leading-[1.25]
          text-[var(--color-dark-ink)]
        "
      >
        {lines.map((l, i) => {
          const active = triggered && step === i;
          const shouldRender = triggered && step >= i;
          return (
            <li
              key={i}
              className={l.italic ? "italic text-[var(--color-dark-ink-mid)]" : ""}
            >
              {shouldRender ? (
                l.rye ? (
                  <RyeLine
                    before="old fashioned drinker, "
                    rye="*preferably rye"
                    after="."
                    speed={reduce ? 0 : 40}
                    startDelay={i === 0 ? 0 : 250}
                    showCaret={active}
                    onComplete={() => onLineDone(i)}
                  />
                ) : (
                  <StreamingText
                    text={l.text}
                    immediate
                    speed={reduce ? 0 : 40}
                    startDelay={i === 0 ? 0 : 250}
                    showCaret={active}
                    onComplete={() => onLineDone(i)}
                  />
                )
              ) : (
                <span className="opacity-0">{l.text}</span>
              )}
            </li>
          );
        })}
      </ul>
    </InViewGate>
  );
}

function RyeLine({
  before,
  rye,
  after,
  speed,
  startDelay,
  showCaret,
  onComplete,
}: {
  before: string;
  rye: string;
  after: string;
  speed: number;
  startDelay: number;
  showCaret: boolean;
  onComplete: () => void;
}) {
  const [beforeDone, setBeforeDone] = useState(false);
  const [ryeDone, setRyeDone] = useState(false);

  return (
    <span>
      <StreamingText
        text={before}
        immediate
        speed={speed}
        startDelay={startDelay}
        showCaret={showCaret && !beforeDone}
        onComplete={() => setBeforeDone(true)}
      />
      {beforeDone && (
        <span
          className="
            inline-block font-[family-name:var(--font-scrawl)]
            text-[var(--color-accent)] text-[0.92em]
            -rotate-[4deg] translate-y-[-0.18em] ml-[0.15em] mr-[0.15em]
            leading-[1]
          "
        >
          <StreamingText
            text={rye}
            immediate
            speed={speed}
            showCaret={showCaret && !ryeDone}
            onComplete={() => setRyeDone(true)}
          />
        </span>
      )}
      {ryeDone && (
        <StreamingText
          text={after}
          immediate
          speed={speed}
          showCaret={false}
          onComplete={onComplete}
        />
      )}
    </span>
  );
}

// Lightweight in-view gate that fires a callback once the element intersects the viewport.
function InViewGate({
  children,
  onEnter,
  className,
}: {
  children: ReactNode;
  onEnter: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node || firedRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            onEnterRef.current();
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ---------- Chapter II — The Work (parallax 20) ----------

function ChapterWork() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const copyY: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      aria-labelledby="chapter-work"
      className="relative w-full min-h-screen overflow-hidden py-[18vh] px-6 md:px-16"
    >
      <QueryMarker query="query: the_work" />

      {/* Layer 1 — "20" watermark */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: watermarkY }}
        className="
          pointer-events-none select-none
          absolute inset-0 flex items-center justify-center
          z-0
        "
      >
        <span
          className="
            font-[family-name:var(--font-serif)]
            text-[min(44vw,520px)] leading-none
            font-[450] tracking-[-0.04em]
            text-[var(--color-dark-ink)]
            opacity-[0.04]
          "
        >
          20
        </span>
      </motion.div>

      {/* Layer 3 — copy */}
      <motion.div
        style={reduce ? undefined : { y: copyY }}
        className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start"
      >
        <div className="md:col-span-5">
          <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-dark-ink-soft)] mb-6">
            / who am I
          </div>
          <h2
            id="chapter-work"
            className="
              font-[family-name:var(--font-serif)]
              font-[450] leading-[1.04] tracking-[-0.015em]
              text-[clamp(32px,4.2vw,60px)]
              text-[var(--color-dark-ink)]
            "
          >
            <StreamingText
              text="I've spent "
              speed={40}
              showCaret={false}
            />
            <em>
              <StreamingText
                text="20 years"
                speed={40}
                startDelay={11 * 40}
                showCaret={false}
              />
            </em>
            <StreamingText
              text=" working both brand and agency side."
              speed={40}
              startDelay={19 * 40}
            />
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:mt-[14px]">
          <p className="font-[family-name:var(--font-serif)] text-[clamp(17px,1.5vw,22px)] leading-[1.5] text-[var(--color-dark-ink-mid)]">
            On both the East and West Coasts, helping create work for brands like
            Apple, HBO, Verizon, AT&amp;T, Beats, and Chevron. I <em>lead campaigns</em>,
            punch up decks, <em>write scripts</em>, and <em>partner</em> with design
            and marketing teams to shape brand voices, sharpen strategy, and get
            ideas over the finish line.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

// ---------- Chapter III — Credits (marquee) ----------

function ChapterCredits() {
  const brands = ["APPLE", "HBO", "VERIZON", "AT&T", "BEATS", "CHEVRON"];
  const loop = [...brands, ...brands];

  return (
    <section className="relative w-full py-[14vh] overflow-hidden">
      <QueryMarker query="query: credits" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-dark-ink-soft)] mb-8 text-center">
          / the work he&rsquo;s helped make
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-full h-px bg-[var(--color-accent)] opacity-60"
      />

      <div className="relative w-full py-[6vh] overflow-hidden">
        <div
          className="about-marquee-track flex whitespace-nowrap"
          style={{
            width: "max-content",
            animation: "marquee-scroll 40s linear infinite",
          }}
        >
          {loop.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="
                flex items-center
                font-[family-name:var(--font-serif)]
                font-[450] tracking-[-0.02em]
                text-[var(--color-dark-ink)]
                text-[clamp(48px,8vw,140px)]
                leading-[1]
                px-[0.4em]
              "
            >
              {b}
              <span
                aria-hidden="true"
                className="mx-[0.4em] text-[var(--color-dark-ink-soft)]"
              >
                —
              </span>
            </span>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-full h-px bg-[var(--color-accent)] opacity-60"
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 mt-8 text-center">
        <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-[var(--color-dark-ink-soft)]">
          twenty years · east coast + west coast · brand and agency
        </div>
      </div>
    </section>
  );
}

// ---------- Chapter IV — Screenwriter ----------

function ChapterScreenwriter() {
  return (
    <section className="relative w-full py-[18vh] px-6 md:px-16">
      <QueryMarker query="query: screenwriter" />

      <div className="max-w-[860px] mx-auto">
        <h2
          className="
            font-[family-name:var(--font-serif)]
            font-[450] leading-[1.08] tracking-[-0.015em]
            text-[clamp(28px,3.6vw,52px)]
            text-[var(--color-dark-ink)]
            max-w-[14em]
          "
        >
          <StreamingText
            text="When I'm not writing for brands, I'm writing screenplays."
            speed={40}
          />
        </h2>
        <p className="font-[family-name:var(--font-serif)] italic text-[clamp(17px,1.4vw,20px)] leading-[1.5] text-[var(--color-dark-ink-mid)] mt-6">
          I&rsquo;ve written for TV, films, and online content.
        </p>

        {/* Placements */}
        <div className="mt-[12vh] mb-[10vh] flex flex-col items-center gap-[1.1em] text-center">
          <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-[var(--color-dark-ink-soft)]">
            placed
          </div>
          <div className="flex flex-col items-center gap-[0.6em]">
            <span className="font-[family-name:var(--font-mono)] uppercase tracking-[0.32em] text-[clamp(14px,1.3vw,18px)] text-[var(--color-dark-ink)]">
              Cinestory
            </span>
            <span className="font-[family-name:var(--font-mono)] uppercase tracking-[0.32em] text-[clamp(14px,1.3vw,18px)] text-[var(--color-dark-ink)]">
              Script Pipeline
            </span>
            <span className="font-[family-name:var(--font-serif)] italic text-[clamp(13px,1.1vw,16px)] text-[var(--color-dark-ink-soft)] mt-[0.4em]">
              — the prestigious —
            </span>
            <span
              className="
                font-[family-name:var(--font-mono)] uppercase
                tracking-[0.32em] text-[clamp(16px,1.5vw,22px)]
                text-[var(--color-dark-ink)]
                border-b-2 border-[var(--color-accent)]
                pb-[4px]
              "
            >
              Austin Film Festival
            </span>
          </div>
        </div>

        {/* Philosophy */}
        <blockquote className="font-[family-name:var(--font-serif)] text-[clamp(19px,1.9vw,28px)] leading-[1.42] text-[var(--color-dark-ink)] border-l-2 border-[var(--color-dark-line)] pl-6">
          For me, every story starts the same: there&rsquo;s our{" "}
          <em className="text-[var(--color-accent)]">protagonist</em>, their{" "}
          <em className="text-[var(--color-accent)]">goal</em>, and something that
          stands in the way. Whether it&rsquo;s a brand identity or a 100-page
          adventure, if we find those three things, the strategy pretty much
          writes itself.
        </blockquote>
      </div>
    </section>
  );
}

// ---------- Chapter V — The Studio ----------

function ChapterStudio({ bio }: { bio?: AboutPage["bio"] }) {
  return (
    <section className="relative w-full py-[16vh] px-6 md:px-16">
      <QueryMarker query="query: studio" />

      <div className="max-w-[1280px] mx-auto">
        <h2
          className="
            font-[family-name:var(--font-serif)]
            font-[450] leading-[1.08] tracking-[-0.015em]
            text-[clamp(28px,3.6vw,52px)]
            text-[var(--color-dark-ink)]
            mb-[8vh]
            max-w-[14em]
          "
        >
          <StreamingText text="I also run " speed={40} showCaret={false} />
          <em>
            <StreamingText
              text="Protagonist Ink"
              speed={40}
              startDelay={11 * 40}
              showCaret={false}
            />
          </em>
          <StreamingText
            text="."
            speed={40}
            startDelay={(11 + 15) * 40}
          />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7">
            {bio && bio.length > 0 ? (
              <div className="font-[family-name:var(--font-serif)] text-[clamp(19px,1.8vw,26px)] leading-[1.5] text-[var(--color-dark-ink-mid)] [&_em]:italic [&_a]:text-[var(--color-accent)] [&_a]:underline [&_a]:decoration-[var(--color-accent)] [&_a]:underline-offset-4">
                <PortableText value={bio} />
              </div>
            ) : (
              <p className="font-[family-name:var(--font-serif)] text-[clamp(19px,1.8vw,26px)] leading-[1.5] text-[var(--color-dark-ink-mid)]">
                A consultancy and narrative studio that helps founders and small
                brands find the real story under the one they&rsquo;ve been telling.
                Learn more at{" "}
                <a
                  href="https://protagonistink.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic text-[var(--color-dark-ink)] underline decoration-[var(--color-accent)] underline-offset-[6px] decoration-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  protagonistink.com
                  <span aria-hidden="true"> ↗</span>
                </a>
                .
              </p>
            )}
          </div>
          <div className="md:col-span-5 flex items-center justify-center md:justify-end">
            <a
              href="https://protagonistink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-[family-name:var(--font-serif)]
                italic text-[clamp(28px,3vw,48px)] leading-[1]
                tracking-[-0.02em]
                text-[var(--color-dark-ink-soft)] hover:text-[var(--color-dark-ink)]
                transition-colors
              "
            >
              Protagonist Ink
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Chapter VI — /freelance_status ----------

function ChapterContact({ email }: { email: string }) {
  return (
    <section className="relative w-full py-[18vh] px-6 md:px-16">
      <QueryMarker query="freelance_status" />

      <div className="max-w-[1000px] mx-auto flex flex-col items-center gap-[3.5vh] text-center">
        <h2
          className="
            font-[family-name:var(--font-serif)]
            font-[450] leading-[1.02] tracking-[-0.02em]
            text-[clamp(36px,5.5vw,80px)]
            text-[var(--color-dark-ink)]
          "
        >
          <StreamingText text="Available for CD and copywriting." speed={45} />
        </h2>

        <div className="flex items-center gap-[10px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-[var(--color-dark-ink-soft)]">
          <span
            aria-hidden="true"
            className="about-pulse-dot inline-block w-[7px] h-[7px] rounded-full bg-[var(--color-accent)]"
            style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
          />
          accepting new projects · Q3 2026
        </div>

        {/* Terminal contact close */}
        <a
          href={`mailto:${email}`}
          className="
            group mt-[2vh]
            font-[family-name:var(--font-mono)] text-[clamp(14px,1.4vw,18px)]
            uppercase tracking-[0.18em]
            text-[var(--color-dark-ink)]
            hover:text-[var(--color-accent)]
            transition-colors
          "
        >
          <span className="text-[var(--color-accent)]">[</span>
          <span className="px-[0.75ch]">
            Contact Patrick
            <span
              aria-hidden="true"
              className="about-caret inline-block ml-[0.2ch] text-[var(--color-accent)]"
              style={{ animation: "caret-blink 1s step-start infinite" }}
            >
              _
            </span>
          </span>
          <span className="text-[var(--color-accent)]">]</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="
            font-[family-name:var(--font-serif)]
            text-[clamp(20px,2vw,32px)] leading-[1.2]
            text-[var(--color-dark-ink-mid)]
            border-b border-transparent hover:border-[var(--color-accent)]
            hover:text-[var(--color-accent)]
            transition-[color,border-color] duration-200
          "
        >
          {email} <span aria-hidden="true">↗</span>
        </a>

        <div className="mt-[4vh] self-end font-[family-name:var(--font-serif)] italic text-[clamp(15px,1.3vw,20px)] text-[var(--color-dark-ink-soft)]">
          — Patrick
        </div>
      </div>
    </section>
  );
}

// ---------- Root view ----------

export function AboutView({ about }: { about: AboutPage }) {
  const photoUrl = about.photo
    ? urlForImage(about.photo).width(1200).height(1600).url()
    : undefined;

  const email = about.email ?? "patrick@pkthewriter.com";
  const resumeUrl = about.resumePdf?.asset?.url;
  const linkedin =
    about.linkedinUrl ??
    about.socialLinks?.find((s) => /linkedin/i.test(s.url) || /linkedin/i.test(s.label))?.url;

  return (
    <div
      className="relative min-h-screen bg-[var(--color-dark-bg)] text-[var(--color-dark-ink)]"
      style={{ colorScheme: "dark" }}
    >
      <AboutFloatingNav />
      <ScrollProgress />

      <main id="main" className="relative">
        <AboutStatBar resumeUrl={resumeUrl} />

        <ChapterIdentity photoUrl={photoUrl} />
        <ChapterWork />
        <ChapterCredits />
        <ChapterScreenwriter />
        <ChapterStudio bio={about.bio} />
        <ChapterContact email={email} />

        {/* Page-close line */}
        <div className="border-t border-[var(--color-dark-line)] py-[24px] px-6 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-dark-ink-soft)]">
          pkthewriter · © 2026 · built with too much coffee
        </div>
      </main>

      <AboutFab email={email} resumeUrl={resumeUrl} linkedinUrl={linkedin} />
    </div>
  );
}
