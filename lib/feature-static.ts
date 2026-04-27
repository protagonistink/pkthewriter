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
  | "about"
  | "writing"
  | "screenwriting"
  | "resume"
  | "rates"
  | "availability";

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
  /** Client / brand — displayed in the case-study handoff. */
  brand?: string;
  title: string;
  kicker: string;
  copy: string; // may contain <em>
  /**
   * Optional scan-able bullets. When present, ResponseFeature renders them in
   * place of `copy` — used by cards (like the resume) that want signal over
   * microcopy.
   */
  highlights?: string[];
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
  about: `The useful version: writer, creative director, narrative problem-solver. Usually in that order.`,
  writing: `The shorter the piece, the harder it usually is.`,
  screenwriting: `Yes, really. Two features optioned, one pilot in development.`,
  resume: `One page, current to 2026.`,
  // PRE-LAUNCH: Patrick to confirm rates copy + availability quarter / month.
  rates: `Day rate depends on scope and duration. Retainer available for ongoing work.`,
  availability: `Currently booking projects starting Q3 2026. Prefer 2–4 week engagements.`,
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
    brand: "Airtable",
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
    brand: "BP",
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
    brand: "Verizon",
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
    brand: "Verizon",
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
    brand: "Chevron",
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
    brand: "Warner Bros.",
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
    brand: "AT&T",
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
    brand: "MPA",
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
  about: {
    key: "about",
    intro: INTROS.about,
    title: "Patrick Kirkland",
    kicker: "Writer · Creative Director · Protagonist Ink",
    copy: `I have spent 20-plus years making campaigns, films, launches, decks, speeches, and strategy behave like they are all part of the same story. Apple, HBO, Verizon, founders, arts organizations, mission-driven brands. The useful version: I help people say the thing they mean before the room invents a safer sentence.`,
    ctas: [
      { label: "Read the full about →", href: "/about", variant: "primary" },
      { label: "Email Patrick", href: "mailto:patrick@pkthewriter.com", variant: "ghost" },
    ],
    heroTag: "Bio · 2026",
    thumbs: ["Strategy", "Campaigns", "Scripts"],
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
    kicker: "PDF · 1 page",
    copy: "",
    highlights: [
      "20+ years — agency and brand side",
      "Apple · HBO · Verizon · AT&amp;T · Airtable · Chevron · BP · Warner Bros.",
      "Writer · Creative Director · Narrative Strategy",
      "ADDYs · Austin Film Festival · CES · iBooks #1 · RACies Silver",
    ],
    ctas: [
      { label: "Open the PDF →", href: "/resume", variant: "primary" },
      { label: "Email me the PDF", href: "mailto:patrick@pkthewriter.com?subject=Resume%20PDF", variant: "ghost" },
    ],
    heroTag: "PDF · 1 page",
    thumbs: ["Clients", "Roles", "Recognition"],
  },
  rates: {
    key: "rates",
    intro: INTROS.rates,
    title: "Rates",
    kicker: "Day rate · Retainer · Project",
    copy: "",
    highlights: [
      "Day rate available — contact for current range",
      "Retainer pricing for ongoing or multi-sprint work",
      "Project-based for defined-scope deliverables",
      "NDA-friendly — standard or custom",
    ],
    ctas: [
      { label: "Email me →", href: "mailto:patrick@pkthewriter.com?subject=Rates", variant: "primary" },
      { label: "Book 15 min →", href: "https://calendar.superhuman.com/book/11VL7tJ5Cd1dIChMDX/2T1Pl", variant: "ghost" },
    ],
    heroTag: "Rates · 2026",
    thumbs: ["Day rate", "Retainer", "Project"],
  },
  availability: {
    key: "availability",
    intro: INTROS.availability,
    title: "Availability",
    kicker: "Freelance · Q3 2026",
    copy: "",
    highlights: [
      "Open for new projects starting July 2026",
      "Prefer 2–4 week engagements",
      "Can extend for the right project",
      "Reply within 24 hours",
    ],
    ctas: [
      { label: "Email me →", href: "mailto:patrick@pkthewriter.com?subject=Availability", variant: "primary" },
      { label: "Book 15 min →", href: "https://calendar.superhuman.com/book/11VL7tJ5Cd1dIChMDX/2T1Pl", variant: "ghost" },
    ],
    heroTag: "Available · 2026",
    thumbs: ["Start date", "Duration", "Scope"],
  },
};

/**
 * The three alts under each feature. Rotates the feature pool so every card
 * points to different peers. `work` is always the third escape hatch.
 */
const brandAlts = (self: FeatureKey): Array<{ key: FeatureKey | "work"; label: string; note?: string }> => {
  const index = ALL_BRANDS.indexOf(self as (typeof ALL_BRANDS)[number]);
  const n = ALL_BRANDS.length;
  const others = index < 0
    ? ALL_BRANDS.filter((k) => k !== self).slice(0, 2)
    : [ALL_BRANDS[(index + 1) % n], ALL_BRANDS[(index + 2) % n]];
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
  about: [
    { key: "resume", label: "Resume", note: "(one page)" },
    { key: "writing", label: "Read something short" },
    { key: "work", label: "See all work" },
  ],
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
  rates: [
    { key: "availability", label: "Availability", note: "(when I can start)" },
    { key: "resume", label: "Resume", note: "(one page)" },
    { key: "work", label: "See all work" },
  ],
  availability: [
    { key: "rates", label: "Rates", note: "(day rate)" },
    { key: "resume", label: "Resume", note: "(one page)" },
    { key: "work", label: "See all work" },
  ],
};
