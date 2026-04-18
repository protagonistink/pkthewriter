/**
 * Hardcoded feature content (interpretation intros + fallback cards).
 *
 * The interpretation intros are Patrick's voice — they stay in code so they
 * don't drift. Cards for `screenwriting` and `resume` are also static
 * (these pieces don't live in Sanity yet). Cards for Verizon/Apple/Mercedes/
 * writing come from Sanity via `featureCardsQuery` and are merged onto the
 * matching static intro by the resolver.
 */

export type FeatureKey =
  | "verizon"
  | "apple"
  | "mercedes"
  | "writing"
  | "screenwriting"
  | "resume";

export type StaticFeature = {
  key: FeatureKey;
  intro: string; // may contain minimal inline markup: <em>
  title: string;
  kicker: string;
  copy: string; // may contain <em>
  ctas: Array<{ label: string; href: string; variant: "primary" | "ghost" }>;
  /** Label shown inside the hero gallery tile. */
  heroTag?: string;
  /** Up to three short labels for the side thumbnails. */
  thumbs?: string[];
};

export const INTROS: Record<FeatureKey, string> = {
  verizon: `Ah, the <em>"best ad"</em> question. Honestly, my best work isn't usually a single ad.`,
  apple: `Apple. A different kind of discipline — product-first, every word weighed.`,
  mercedes: `Mercedes. Cinema at thirty seconds. Voice before volume.`,
  writing: `The shorter the piece, the harder it usually is.`,
  screenwriting: `Yes, really. Two features optioned, one pilot in development.`,
  resume: `One page, current to 2026.`,
};

/** Full static cards (used when Sanity has no matching entry). */
export const STATIC_FEATURES: Record<FeatureKey, StaticFeature> = {
  verizon: {
    key: "verizon",
    intro: INTROS.verizon,
    title: "Verizon",
    kicker: "Brand identity & campaign · 2017–2024",
    copy: `People always ask for the <em>"best ad,"</em> but as a writer, my favorite work is rarely just one script. For Verizon, it was <em>seven years</em> of shifting a massive telecom ship. Yes, there were TV spots — but the real triumph was building a voice that worked across UX, retail, and retention. It's the project that taught me how to write for an ecosystem, not just a screen.`,
    ctas: [
      { label: "Read the story →", href: "/work/verizon", variant: "primary" },
      { label: "View the artifacts", href: "/work/verizon#artifacts", variant: "ghost" },
    ],
    heroTag: "Brand Book · Pg. 12",
    thumbs: ["Retail", "Digital", "OOH"],
  },
  apple: {
    key: "apple",
    intro: INTROS.apple,
    title: "Apple",
    kicker: "UX writing & product voice · 2021–2023",
    copy: `With Apple, the job was subtraction. You're not writing <em>for</em> the product; you're getting out of its way. I worked on onboarding, in-app tone, and a handful of launch moments — the kind of work where a single adjective can cost you a week. I learned more about <em>restraint</em> here than anywhere else.`,
    ctas: [
      { label: "Read the story →", href: "/work/apple", variant: "primary" },
      { label: "View the artifacts", href: "/work/apple#artifacts", variant: "ghost" },
    ],
    heroTag: "Onboarding · v3",
    thumbs: ["iOS", "Setup", "Launch"],
  },
  mercedes: {
    key: "mercedes",
    intro: INTROS.mercedes,
    title: "Mercedes-Benz",
    kicker: "Film & brand voice · 2020–2022",
    copy: `Luxury asks you to trust the audience. We built a voice that whispered where competitors shouted — long-copy print, a film series with real directors, and a brand book that treated silence as a design element. If you want to see <em>craft</em>, start here.`,
    ctas: [
      { label: "Read the story →", href: "/work/mercedes", variant: "primary" },
      { label: "View the artifacts", href: "/work/mercedes#artifacts", variant: "ghost" },
    ],
    heroTag: "Film · 2021",
    thumbs: ["Print", "Film", "Brand Book"],
  },
  writing: {
    key: "writing",
    intro: INTROS.writing,
    title: "How to be replaced by a machine",
    kicker: "Essay · Adweek · 2024 · 8 min",
    copy: `Eight hundred words about what happens when the tools get good enough to do the boring half of this job — and what the honest half of the work looks like after. It's the most shared thing I've written. <em>Fair warning:</em> it will annoy some of your colleagues.`,
    ctas: [
      { label: "Read the essay →", href: "/writing", variant: "primary" },
      { label: "See all writing", href: "/writing", variant: "ghost" },
    ],
    heroTag: "Adweek · 2024",
    thumbs: ["Essay", "Column", "Short"],
  },
  screenwriting: {
    key: "screenwriting",
    intro: INTROS.screenwriting,
    title: "Screenwriting",
    kicker: "Features · pilots · shorts",
    copy: `I treat ad work and screenwriting as the same job done under different word counts. Everything I learned about <em>structure</em> came from the pilot I couldn't sell; everything I learned about <em>economy</em> came from a thirty-second spot. The reel pulls from both. Say the word and I'll send a pilot PDF.`,
    ctas: [
      { label: "See the reel →", href: "/screenwriting", variant: "primary" },
      { label: "Request a pilot PDF", href: "mailto:patrick@pkthewriter.com?subject=Pilot%20PDF", variant: "ghost" },
    ],
    heroTag: "Pilot · 2025",
    thumbs: ["Features", "Pilots", "Shorts"],
  },
  resume: {
    key: "resume",
    intro: INTROS.resume,
    title: "Resume — 2026",
    kicker: "PDF · 180kb · annotated",
    copy: `The short version. Clients, titles, dates, and the three or four sentences that stitch it together. If you want the long version with case-study links, that lives on the About page. <em>Need the PDF emailed?</em> Say so and I'll send it.`,
    ctas: [
      { label: "Open the resume →", href: "/about#resume", variant: "primary" },
      { label: "Email me the PDF", href: "mailto:patrick@pkthewriter.com?subject=Resume%20PDF", variant: "ghost" },
    ],
    heroTag: "Resume · 2026",
    thumbs: ["Clients", "Titles", "Dates"],
  },
};

/** The three alternatives shown under the main feature card, per context. */
export const ALTS: Record<FeatureKey, Array<{ key: FeatureKey | "work"; label: string; note?: string }>> = {
  verizon: [
    { key: "apple", label: "Apple", note: "(UX writing)" },
    { key: "mercedes", label: "Mercedes", note: "(film)" },
    { key: "work", label: "See all work" },
  ],
  apple: [
    { key: "verizon", label: "Verizon", note: "(ecosystem)" },
    { key: "mercedes", label: "Mercedes", note: "(film)" },
    { key: "work", label: "See all work" },
  ],
  mercedes: [
    { key: "verizon", label: "Verizon", note: "(ecosystem)" },
    { key: "apple", label: "Apple", note: "(UX writing)" },
    { key: "work", label: "See all work" },
  ],
  writing: [
    { key: "verizon", label: "Verizon", note: "(case study)" },
    { key: "screenwriting", label: "Screenwriting", note: "(reel)" },
    { key: "work", label: "See all work" },
  ],
  screenwriting: [
    { key: "writing", label: "Read something short" },
    { key: "verizon", label: "Verizon", note: "(case study)" },
    { key: "work", label: "See all work" },
  ],
  resume: [
    { key: "verizon", label: "Verizon", note: "(case study)" },
    { key: "writing", label: "Read something short" },
    { key: "work", label: "See all work" },
  ],
};
