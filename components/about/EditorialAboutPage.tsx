/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { AboutPage, Project } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";
import { ClientCaseStudyLink } from "@/components/canvas/ClientCaseStudyLink";
import { ExperienceCard } from "@/components/about/ExperienceCard";
import { AboutHelperPrompt } from "@/components/about/AboutHelperPrompt";

const FALLBACK_EMAIL = "patrick@pkthewriter.com";

type Props = {
  about: AboutPage | null;
  projects: Project[];
};

type Experience = {
  company: string;
  role: string;
  years: string;
  detail: string;
};

const BIO_SECTIONS = [
  {
    label: "INT. AGENCY / BRAND - DAY",
    copy:
      "I have spent more than 20 years working both agency and brand side, building campaigns, launch language, scripts, manifestos, decks, and voices for clients people recognize and organizations that want to be understood, not just seen.",
  },
  {
    label: "EXT. WRITER'S ROOM - NIGHT",
    copy:
      "Screenwriting sharpened the part of the job advertising usually tries to rename: character, want, obstacle, consequence. A product has a protagonist. A founder has a premise. A campaign only works if someone in the room is still asking why it matters.",
  },
  {
    label: "INT. STRATEGY MEETING - LATE AFTERNOON",
    copy:
      "The work I like most starts messy. Too many claims, too many audiences, too much borrowed language. I find the argument underneath it, then write the version the client can actually use outside the building.",
  },
  {
    label: "EXT. PROTAGONIST INK - CONTINUOUS",
    copy:
      "I also run Protagonist Ink, a narrative strategy consultancy for founders, arts organizations, and mission-driven brands. Same work, different room: find the human stakes, then write toward them.",
  },
];

const EXPERIENCE: Experience[] = [
  {
    company: "Protagonist Ink",
    role: "Founder / Narrative Strategy",
    years: "Now",
    detail:
      "Narrative strategy, positioning, founder story, voice, and launch language for people and organizations who know what they do but not yet how to say it.",
  },
  {
    company: "Freelance",
    role: "Creative Director / Writer",
    years: "Booking Q3 2026",
    detail:
      "Senior campaign thinking, copy, scripts, naming, pitch language, and creative direction for agencies, founders, arts organizations, and mission-driven brands.",
  },
  {
    company: "Ogilvy NY",
    role: "Senior Copywriter",
    years: "2010",
    detail:
      "Fortune 500 campaigns. BP's Olympic Team.",
  },
  {
    company: "TWC / Verizon / AT&T",
    role: "Campaigns",
    years: "2020",
    detail:
      "Broadcast, digital, and brand work across telecom, entertainment, and tech.",
  },
];

type ClientEntry = { label: string; match?: string[] };

const CLIENTS: ClientEntry[] = [
  { label: "Verizon" },
  { label: "AT&T" },
  { label: "Chevron" },
  { label: "BP" },
  { label: "Airtable" },
  { label: "Warner Bros.", match: ["warner"] },
  { label: "MPA", match: ["motion picture"] },
  { label: "Protagonist Ink" },
];

const ACCOLADES = [
  "ADDYs",
  "Austin Film Festival",
  "CES Expo Winner",
  "#1 iBooks Nonfiction Bestseller",
  "New York Times · RACies Silver",
];

const TESTIMONIALS = [
  {
    quote: "[Testimonial quote — replace before launch.]",
    name: "[Name]",
    role: "[Role, Company]",
  },
  {
    quote: "[Second testimonial — replace before launch.]",
    name: "[Name]",
    role: "[Role, Company]",
  },
];

export function EditorialAboutPage({ about, projects }: Props) {
  const email = about?.email ?? FALLBACK_EMAIL;
  const resumeUrl = about?.resumePdf?.asset?.url ?? "/resume";
  const photoUrl = about?.photo
    ? urlForImage(about.photo).width(900).height(1200).fit("crop").url()
    : undefined;
  const featuredProjects = projects.map((project) => ({
    id: project._id,
    label: project.brand ?? project.title,
    title: project.title,
    year: project.year,
    slug: project.slug.current,
    imageUrl: project.mainImage
      ? urlForImage(project.mainImage).width(640).height(420).fit("crop").url()
      : undefined,
  }));

  return (
    <main id="main" className="overflow-hidden">
      {/* Hero — typographic display, photo crashes the grid */}
      <section className="relative overflow-hidden px-[44px] pt-[64px] pb-[24px] max-[820px]:px-[22px] max-[820px]:pt-[40px] max-[820px]:pb-[48px]">
        <p className="mb-[28px] max-[820px]:mb-[20px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.32em] text-[var(--color-accent)]">
          — About
        </p>

        {/* Type + photo layer */}
        <div className="relative">
          {/* Photo behind type on the right */}
          <div className="absolute right-0 top-[18%] z-10 w-[46%] overflow-hidden max-[820px]:hidden">
            <div className="aspect-[3/4]">
              <img
                src={photoUrl ?? "/about-patrick.jpg"}
                alt="Patrick Kirkland"
                className="h-full w-full object-cover object-[62%_12%] grayscale contrast-[1.08]"
              />
            </div>
          </div>

          <h1 className="relative z-20 font-[family-name:var(--font-serif)] text-[clamp(72px,14.5vw,220px)] font-normal leading-[0.88] tracking-[-0.045em] text-[var(--color-ink)]">
            <span className="block">It starts</span>
            <span className="block">with</span>
            <span className="block">character.</span>
          </h1>
        </div>

        {/* Mobile photo — inline below headline */}
        <div className="hidden max-[820px]:block mt-[24px] overflow-hidden aspect-[4/3]">
          <img
            src={photoUrl ?? "/about-patrick.jpg"}
            alt="Patrick Kirkland"
            className="h-full w-full object-cover object-[62%_12%] grayscale contrast-[1.08]"
          />
        </div>

        {/* Subtitle — left-anchored, clears the right-side photo */}
        <p className="mt-[48px] max-w-[560px] font-[family-name:var(--font-serif)] text-[clamp(22px,2.4vw,38px)] leading-[1.15] tracking-[-0.022em] text-[var(--color-ink)] max-[820px]:mt-[28px]">
          I write the line and the argument under the line, then make sure both leave the room intact.
        </p>

        {/* Mobile-only: condensed availability + entry points + truncated awards.
            Replaces the desktop aside (Vital Stats / Hit List) which is hidden
            below 820px. Sits directly under the header so visitors see the
            short version + the two primary actions before the long-form bio. */}
        <div className="hidden max-[820px]:block mt-[32px] pt-[26px] border-t border-[var(--color-paper-line)]">
          <p className="mb-[20px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Available for freelance
          </p>
          <div className="flex flex-wrap gap-[10px] mb-[26px]">
            <AboutButton href={resumeUrl} newTab>Download Resume</AboutButton>
            <a
              href="https://www.linkedin.com/in/patrickkirkland/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[8px] border border-[var(--color-ink)] px-[22px] py-[14px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
            <AboutButton href={`mailto:${email}`}>Say hello</AboutButton>
          </div>
          <p className="mb-[10px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-[var(--color-ink-mid)]">
            Recognition
          </p>
          <ul className="m-0 p-0 list-none flex flex-col gap-[6px] font-[family-name:var(--font-serif)] text-[16px] leading-[1.35] text-[var(--color-ink)]">
            {ACCOLADES.slice(0, 4).map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" className="bg-[var(--color-paper-panel)] px-[44px] py-[112px] max-[820px]:px-[22px] max-[820px]:py-[56px]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[320px_minmax(0,1fr)] gap-[96px] max-[980px]:grid-cols-1 max-[980px]:gap-[54px]">
          {/* Vital Stats / Hit List — desktop+tablet only. The hero block above
              already exposes the same info (in shorter form) on mobile. */}
          <aside className="relative max-[820px]:hidden">
            <div className="sticky top-[34px]">
              <div className="mb-[34px] h-[2px] w-[44px] bg-[var(--color-ink)]" />
              <FactBlock label="[ VITAL STATS ]">
                Available for freelance CD, copy, narrative strategy, and founder-story work.
              </FactBlock>
              <div className="mb-[44px]">
                <h2 className="mb-[12px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.26em] text-[var(--color-accent)]">
                  [ RECOGNITION ]
                </h2>
                <ul className="m-0 p-0 list-none flex flex-col gap-[5px]">
                  {ACCOLADES.map((award) => (
                    <li
                      key={award}
                      className="font-[family-name:var(--font-serif)] text-[20px] leading-[1.3] tracking-[-0.018em] text-[var(--color-ink)]"
                    >
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-start gap-[12px] pt-[10px]">
                <AboutButton href={resumeUrl} newTab>Download Resume</AboutButton>
                <a
                  href="https://www.linkedin.com/in/patrickkirkland/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[8px] border border-[var(--color-ink)] px-[22px] py-[14px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
                >
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <AboutButton href={`mailto:${email}`}>Say hello</AboutButton>
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-0">
            {BIO_SECTIONS.map((section, index) => (
              <section
                key={section.label}
                aria-label={section.label}
                className={index > 0 ? "border-t border-[var(--color-paper-line)] pt-[64px]" : ""}
              >
                {index === 0 && (
                  <div className="mb-[24px] flex items-baseline gap-[14px] border-b border-[var(--color-paper-line)] pb-[12px]">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em] text-[var(--color-ink-mid)]">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <p className="m-0 min-w-0 font-[family-name:var(--font-mono)] text-[13px] uppercase leading-[1.25] tracking-[0.05em] text-[var(--color-accent)]">
                      {section.label}
                    </p>
                  </div>
                )}
                <p className={`m-0 max-w-[920px] font-[family-name:var(--font-serif)] text-[clamp(31px,4vw,58px)] leading-[1.12] tracking-[-0.032em] text-[var(--color-ink)] ${index > 0 ? "pb-[64px]" : "pb-[64px]"}`}>
                  {section.copy}
                </p>
              </section>
            ))}

            {about?.bio && (
              <section className="border-t border-[var(--color-paper-line)] pt-[64px] border-l-0 pl-0" aria-label="On record">
                <div className="border-l border-[var(--color-paper-line)] pl-[24px]">
                  <p className="mb-[18px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.28em] text-[var(--color-accent)]">
                    On record
                  </p>
                  <div className="max-w-[720px] font-[family-name:var(--font-serif)] text-[22px] leading-[1.55] text-[var(--color-ink)] [&_p]:mb-[18px] [&_p]:mt-0">
                    <PortableText value={about.bio} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section id="experience" className="border-t border-[var(--color-ink)] bg-[var(--color-paper)] px-[44px] py-[112px] max-[820px]:px-[22px] max-[820px]:py-[72px]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[320px_minmax(0,1fr)] gap-[96px] max-[980px]:grid-cols-1 max-[980px]:gap-[40px]">
          <div>
            <p className="mb-[20px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.28em] text-[var(--color-ink-mid)]">
              &gt; selected_experience
            </p>
            <h2 className="max-w-[7ch] font-[family-name:var(--font-serif)] text-[clamp(50px,7vw,96px)] font-normal leading-[0.92] tracking-[-0.04em]">
              The track record.
            </h2>
          </div>
          <div className="border-t border-[var(--color-ink)]">
            {EXPERIENCE.map((item) => (
              <ExperienceCard
                key={`${item.company}-${item.role}`}
                company={item.company}
                role={item.role}
                years={item.years}
                detail={item.detail}
              />
            ))}
          </div>
        </div>
      </section>

      {TESTIMONIALS.some((t) => !t.quote.startsWith("[")) && (
        <section className="border-t border-[var(--color-paper-line)] bg-[var(--color-paper)] px-[44px] py-[112px] max-[820px]:px-[22px] max-[820px]:py-[72px]">
          <div className="mx-auto max-w-[1320px]">
            <p className="mb-[48px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.28em] text-[var(--color-ink-mid)]">
              &gt; what_people_say
            </p>
            <div className="grid gap-[56px] max-w-[860px]">
              {TESTIMONIALS.filter((t) => !t.quote.startsWith("[")).map((t) => (
                <blockquote key={t.name}>
                  <p className="font-[family-name:var(--font-serif)] text-[clamp(24px,3.2vw,40px)] leading-[1.22] tracking-[-0.02em] text-[var(--color-ink)]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-[20px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
                    — {t.name}, {t.role}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[var(--color-ink)] bg-[var(--color-dark-panel)] px-[44px] py-[112px] text-[var(--color-dark-ink)] max-[820px]:px-[22px] max-[820px]:py-[56px] max-[820px]:pb-[64px]">
        <div className="mx-auto max-w-[1320px]">
          <Archive projects={featuredProjects} />
        </div>
      </section>

      <AboutHelperPrompt />
    </main>
  );
}

function FactBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="mb-[44px]">
      <h2 className="mb-[12px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.26em] text-[var(--color-accent)]">
        {label}
      </h2>
      <p className="m-0 font-[family-name:var(--font-serif)] text-[24px] leading-[1.25] tracking-[-0.018em] text-[var(--color-ink)]">
        {children}
      </p>
    </div>
  );
}

function AboutButton({ href, children, newTab = false }: { href: string; children: string; newTab?: boolean }) {
  const external = href.startsWith("http") || href.startsWith("mailto:") || newTab;
  const openInTab = href.startsWith("http") || newTab;
  const className =
    "border border-[var(--color-ink)] px-[22px] py-[14px] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]";

  if (external) {
    return (
      <a href={href} className={className} target={openInTab ? "_blank" : undefined} rel={openInTab ? "noopener noreferrer" : undefined}>
        [ {children} ]
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      [ {children} ]
    </Link>
  );
}

function Archive({
  projects,
}: {
  projects: Array<{ id: string; label: string; title: string; year?: string; slug: string; imageUrl?: string }>;
}) {
  const labels = CLIENTS.map((entry) => {
    const needles = (entry.match ?? [entry.label]).map((s) => s.toLowerCase());
    const project = projects.find((item) => {
      const haystack = item.label.toLowerCase();
      return needles.some((n) => haystack.includes(n));
    });
    return { client: entry.label, project };
  });

  return (
    <section aria-label="Client archive">
      <p className="mb-[42px] font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.28em] text-[var(--color-dark-ink-mid)]">
        &gt; client_archive
      </p>
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[18px] md:gap-x-[28px] md:gap-y-[34px] md:grid-cols-4">
        {labels.map(({ client, project }) => {
          const content = (
            <>
              <span data-about-client-label className="font-[family-name:var(--font-mono)] text-[clamp(11px,1.4vw,24px)] max-[820px]:tracking-[0.16em] uppercase tracking-[0.22em] text-[var(--color-dark-ink-soft)] transition-colors duration-150 group-hover:text-[#fff6e6]">
                {client}
              </span>
              {project?.imageUrl && (
                <span className="pointer-events-none absolute left-[18px] top-[32px] z-10 hidden w-[310px] border border-[var(--color-dark-ink)]/20 bg-[var(--color-dark-bg)] p-[14px] opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.5)] transition-opacity duration-150 group-hover:opacity-100 md:block">
                  <img src={project.imageUrl} alt="" className="mb-[12px] h-[180px] w-full object-cover grayscale" />
                  <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-dark-ink-mid)]">
                    {project.year ?? "Selected work"}
                  </span>
                  <span className="mt-[6px] block font-[family-name:var(--font-serif)] text-[24px] leading-[1.05] tracking-[-0.02em] text-[var(--color-dark-ink)]">
                    {project.title}
                  </span>
                </span>
              )}
            </>
          );

          if (project) {
            return (
              <ClientCaseStudyLink
                key={client}
                href={`/work/${project.slug}`}
                className="group relative min-h-[34px]"
                titleSelector="[data-about-client-label]"
              >
                {content}
              </ClientCaseStudyLink>
            );
          }

          return (
            <div key={client} className="group relative min-h-[34px]">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
