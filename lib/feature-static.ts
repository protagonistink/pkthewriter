/**
 * Hardcoded feature content (interpretation intros + fallback cards).
 *
 * The intros are Patrick's voice — they stay in code so they don't drift.
 * Brand cards come from Sanity via `featureCardsQuery` (lib/sanity/queries)
 * and are merged onto the matching static intro by the resolver.
 * `screenwriting` and `resume` remain fully static — no Sanity doc yet.
 */

export type FeatureKey =
  | "airtable"
  | "bp"
  | "techsure"
  | "verizon-up"
  | "chevron"
  | "warnerbros"
  | "att"
  | "mpa"
  | "writing"
  | "screenwriting"
  | "resume";

/** Keys in the `best ad` random pool. */
export const BEST_AD_POOL = ["warnerbros", "airtable", "verizon-up", "att"] as const satisfies readonly FeatureKey[];

/** Keys in the `what's your favorite` random pool. */
export const FAVORITE_POOL = ["att", "warnerbros", "mpa"] as const satisfies readonly FeatureKey[];

/** All brand keys — used by `surprise me`. Order mirrors the /work grid. */
export const ALL_BRANDS = [
  "airtable", "bp", "techsure", "verizon-up", "chevron", "warnerbros", "att", "mpa",
] as const satisfies readonly FeatureKey[];

export type StaticFeature = {
  key: FeatureKey;
  intro: string; // may contain <em>
  title: string;
  kicker: string;
  copy: string; // may contain <em>
  ctas: Array<{ label: string; href: string; variant: "primary" | "ghost" }>;
  heroTag?: string;
  thumbs?: string[];
};

export const INTROS: Record<FeatureKey, string> = {
  airtable: `Four :15 spots, one national launch. My best work isn't usually a single ad — but when it is, it's four.`,
  bp: `Team USA. Brand-led storytelling the year Rio opened the doors.`,
  techsure: `Verizon's pitch for the part of service no one sees.`,
  "verizon-up": `Live activation. Forty-foot monsters. Biggest Little Monsters.`,
  chevron: `Rebranding a giant. Strategy-first, identity downstream.`,
  warnerbros: `Warner Brothers, <em>Steve Jobs</em>. Campaign voice for a biopic that wanted restraint.`,
  att: `Pandemic holidays. A gift-finder that read like a choose-your-own-adventure.`,
  mpa: `<em>"What Comes Next?"</em> — a brand campaign for the Motion Picture Association.`,
  writing: `The shorter the piece, the harder it usually is.`,
  screenwriting: `Yes, really. Two features optioned, one pilot in development.`,
  resume: `One page, current to 2026.`,
};

/**
 * Static fallbacks for the three non-Sanity keys + minimal scaffolds for the
 * brand keys so the resolver has heroTag / thumbs defaults when Sanity omits
 * them. Brand copy is supplied by Sanity's `excerpt` (context) field; if that
 * is missing the card uses `copy` here.
 */
export const STATIC_FEATURES: Record<FeatureKey, StaticFeature> = {
  airtable: {
    key: "airtable",
    intro: INTROS.airtable,
    title: "This is How",
    kicker: "Brand Campaign · 2024",
    copy: `Four :15 spots for Airtable's first national campaign. Product-first stories, written around how work actually flows when the system works.`,
    ctas: [
      { label: "Read the story →", href: "/work/airtable", variant: "primary" },
      { label: "See the spots", href: "/work/airtable#artifacts", variant: "ghost" },
    ],
    heroTag: "Spot · :15",
    thumbs: ["Design", "Publish", "Go Live"],
  },
  bp: {
    key: "bp",
    intro: INTROS.bp,
    title: "Team USA",
    kicker: "360 Brand Campaign · 2016",
    copy: `A 360 campaign built around the athletes BP was sponsoring for Rio. Sport as anthology, brand as patron.`,
    ctas: [
      { label: "Read the story →", href: "/work/bp", variant: "primary" },
      { label: "See the artifacts", href: "/work/bp#artifacts", variant: "ghost" },
    ],
    heroTag: "Campaign · 2016",
    thumbs: ["Film", "Print", "Social"],
  },
  techsure: {
    key: "techsure",
    intro: INTROS.techsure,
    title: "Your Tech Should Work",
    kicker: "TV Campaign · 2020",
    copy: `Verizon Techsure — a warranty pitched as quiet competence instead of a fear sell.`,
    ctas: [
      { label: "Read the story →", href: "/work/techsure", variant: "primary" },
      { label: "See the spots", href: "/work/techsure#artifacts", variant: "ghost" },
    ],
    heroTag: "Spot · :30",
    thumbs: ["Broadcast", "Digital", "Retail"],
  },
  "verizon-up": {
    key: "verizon-up",
    intro: INTROS["verizon-up"],
    title: "Biggest Little Monsters",
    kicker: "Live Social Activation · 2021",
    copy: `Forty-foot inflatable monsters, a pop-up in Manhattan, and a live social feed that ran the campaign in real time.`,
    ctas: [
      { label: "Read the story →", href: "/work/verizon-up", variant: "primary" },
      { label: "See the artifacts", href: "/work/verizon-up#artifacts", variant: "ghost" },
    ],
    heroTag: "Activation · 2021",
    thumbs: ["Pop-up", "Social", "Press"],
  },
  chevron: {
    key: "chevron",
    intro: INTROS.chevron,
    title: "Rebranding a Giant",
    kicker: "Brand Strategy & Identity · 2024",
    copy: `A top-to-bottom reframe: brand strategy, identity system, and .com. Turning a century-old energy company into something a thirty-year-old could work for.`,
    ctas: [
      { label: "Read the story →", href: "/work/chevron", variant: "primary" },
      { label: "See the artifacts", href: "/work/chevron#artifacts", variant: "ghost" },
    ],
    heroTag: "Strategy · 2024",
    thumbs: ["Identity", ".com", "System"],
  },
  warnerbros: {
    key: "warnerbros",
    intro: INTROS.warnerbros,
    title: "Steve Jobs",
    kicker: "Campaign · 2015",
    copy: `Campaign voice for Danny Boyle's <em>Steve Jobs</em>. An awards-season push that trusted the audience to sit with the ambiguity.`,
    ctas: [
      { label: "Read the story →", href: "/work/warnerbros", variant: "primary" },
      { label: "See the artifacts", href: "/work/warnerbros#artifacts", variant: "ghost" },
    ],
    heroTag: "Trailer Copy · 2015",
    thumbs: ["Trailers", "OOH", "Digital"],
  },
  att: {
    key: "att",
    intro: INTROS.att,
    title: "Lily's Gift Decider",
    kicker: "Digital Activation · 2021",
    copy: `A holiday gift-finder built around AT&T's spokesperson Lily. Forty-plus scripts, every path leading to a gift that fit.`,
    ctas: [
      { label: "Read the story →", href: "/work/att", variant: "primary" },
      { label: "See the artifacts", href: "/work/att#artifacts", variant: "ghost" },
    ],
    heroTag: "Activation · 2021",
    thumbs: ["Scripts", "Retail", "Digital"],
  },
  mpa: {
    key: "mpa",
    intro: INTROS.mpa,
    title: "What Comes Next?",
    kicker: "Brand Campaign · 2016",
    copy: `A brand campaign for the Motion Picture Association — an industry body arguing for the future of cinema without sounding like one.`,
    ctas: [
      { label: "Read the story →", href: "/work/mpa", variant: "primary" },
      { label: "See the artifacts", href: "/work/mpa#artifacts", variant: "ghost" },
    ],
    heroTag: "Campaign · 2016",
    thumbs: ["Film", "Print", "Digital"],
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
    copy: `I treat ad work and screenwriting as the same job done under different word counts. Everything I learned about <em>structure</em> came from the pilot I couldn't sell; everything I learned about <em>economy</em> came from a thirty-second spot. Say the word and I'll send a pilot PDF.`,
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
    kicker: "PDF · annotated",
    copy: `The short version. Clients, titles, dates, and the three or four sentences that stitch it together.`,
    ctas: [
      { label: "Open the resume →", href: "/resume", variant: "primary" },
      { label: "Email me the PDF", href: "mailto:patrick@pkthewriter.com?subject=Resume%20PDF", variant: "ghost" },
    ],
    heroTag: "Resume · 2026",
    thumbs: ["Clients", "Titles", "Dates"],
  },
};

/**
 * The three alts under each feature. Rotates the feature pool so every card
 * points to different peers. `work` is always the third escape hatch.
 */
const brandAlts = (self: FeatureKey): Array<{ key: FeatureKey | "work"; label: string; note?: string }> => {
  const others = ALL_BRANDS.filter((k) => k !== self).slice(0, 2);
  return [
    ...others.map((k) => ({ key: k, label: STATIC_FEATURES[k].title, note: `(${STATIC_FEATURES[k].kicker.split(" · ")[0].toLowerCase()})` })),
    { key: "work" as const, label: "See all work" },
  ];
};

export const ALTS: Record<FeatureKey, Array<{ key: FeatureKey | "work"; label: string; note?: string }>> = {
  airtable: brandAlts("airtable"),
  bp: brandAlts("bp"),
  techsure: brandAlts("techsure"),
  "verizon-up": brandAlts("verizon-up"),
  chevron: brandAlts("chevron"),
  warnerbros: brandAlts("warnerbros"),
  att: brandAlts("att"),
  mpa: brandAlts("mpa"),
  writing: [
    { key: "airtable", label: "Airtable", note: "(case study)" },
    { key: "screenwriting", label: "Screenwriting", note: "(reel)" },
    { key: "work", label: "See all work" },
  ],
  screenwriting: [
    { key: "writing", label: "Read something short" },
    { key: "airtable", label: "Airtable", note: "(case study)" },
    { key: "work", label: "See all work" },
  ],
  resume: [
    { key: "airtable", label: "Airtable", note: "(case study)" },
    { key: "writing", label: "Read something short" },
    { key: "work", label: "See all work" },
  ],
};
