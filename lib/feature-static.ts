/**
 * Hardcoded feature content (interpretation intros + fallback cards).
 *
 * The intros are Patrick's voice — they stay in code so they don't drift.
 * Brand cards use this copy. Sanity supplies project media + slugs through
 * `featureCardsQuery` (lib/sanity/queries), then the resolver merges them in.
 * Non-brand cards remain fully static — no Sanity docs yet.
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
  intro: string; // may contain simple inline HTML
  /** Client / brand — displayed in the case-study handoff. */
  brand?: string;
  title: string;
  kicker: string;
  copy: string; // may contain simple inline HTML
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
  airtable: `Four :15 spots, one national launch. Is it my best work? Cutting tech specs into one line? Solving the puzzle was a lot of fun.`,
  bp: `360 campaign. 18 spots for Team USA. Brand-led storytelling from the heart of the country.`,
  techsure: `Verizon's spot I wrote for the part of tech no one wants to think about: when it's broken.`,
  "verizon-up": `One night. Lady Gaga, Live at Citi Field. Live social production done on the fly.`,
  chevron: `Rebranding a 150-year old industry giant. Audience first, strategy-second, science above all.`,
  warnerbros: `I love doing trailer work. Especially for a Sorkin flick. Especially about a tech genius.`,
  att: `Remember choose-your-own-adventure stories? I made one with Lily.`,
  mpa: `360 brand campaign for the Motion Picture Association (the group that hands out movie ratings).`,
  about: `Writer, creative director, narrative builder. And Dad. Usually in that order.`,
  writing: `Blogs, Substacks, articles, short stories, and a best-seller. Want to read one?`,
  screenwriting: `Started my career in Hollywood writer's rooms and development offices. And still going strong.`,
  resume: `Sure, grab it <a href="/resume">here</a> or check out my <a href="https://www.linkedin.com/in/patrickkirkland/">LinkedIn</a>. I keep it updated.`,
  rates: `Day rate depends on scope and duration. Retainer available for ongoing work.`,
  availability: `Currently booking projects covering Q2 &amp; Q3, 2026. Want to talk about a longer engagement? <a href="mailto:patrick@pkthewriter.com?subject=Availability">Reach out.</a>`,
};

/**
 * Static copy for chat response cards. Brand media and slugs may be supplied
 * by Sanity, but the displayed words live here.
 */
export const STATIC_FEATURES: Record<FeatureKey, StaticFeature> = {
  airtable: {
    key: "airtable",
    intro: INTROS.airtable,
    brand: "Airtable",
    title: "This is How",
    kicker: "Brand Campaign · 2024",
    copy: `Four :15 spots for Airtable's first national campaign. We wrote use case-first stories, written around what's possible when you have the right app to build your product.`,
    ctas: [
      { label: "Read all about it →", href: "/work/airtable", variant: "primary" },
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
    copy: `We cheered on Team USA from the BP seats with this 360 campaign built around the athletes, their trainers, and the chance to become legends.`,
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
    kicker: "TV Campaign · 2021",
    copy: `Modern life revolves around tech. It should work, but when it doesn't, Verizon's got you covered.`,
    ctas: [
      { label: "See the spot →", href: "/work/techsure", variant: "primary" },
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
    copy: `Like an old set of Legos, this was a top-to-bottom reframe to bring a century-old energy company to modern day vibes.`,
    ctas: [
      { label: "See how we did it →", href: "/work/chevron", variant: "primary" },
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
    copy: `Campaign trailers for Aaron Sorkin's <em>Steve Jobs</em>. A nonlinear biography, a homage to a Genius, and awards-season push.`,
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
    copy: `Remember choose-your-own-adventure books? I designed and wrote my own version with this holiday gift-finder built around AT&T's spokesperson Lily.`,
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
    copy: `A 360-brand campaign for the Motion Picture Association that made the case for cinema's future from the grade-giving org's first public campaign.`,
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
    copy: `I've spent 20 years writing campaigns, films, launches, decks, speeches, and strategy like they're all versions of my favorite stories. Ogilvy, Verizon, Chevron, founders, arts organizations, mission-driven brands. My favorite part of this career is helping people say what they mean and mean what they say.`,
    ctas: [
      { label: "More about me →", href: "/about", variant: "primary" },
      { label: "Email me", href: "mailto:patrick@pkthewriter.com", variant: "ghost" },
    ],
    heroTag: "Bio · 2026",
    thumbs: ["Strategy", "Campaigns", "Scripts"],
  },
  writing: {
    key: "writing",
    intro: INTROS.writing,
    title: "Writing",
    kicker: "Blogs · Substacks · Articles · Short Stories",
    copy: `The writing is coming, I'm just crossing my t's and dotting my lower-case j's.`,
    ctas: [
      { label: "Email me >", href: "mailto:patrick@pkthewriter.com?subject=Writing", variant: "primary" },
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
    copy: `Send me an email, I'll send you some loglines. If you're interested in reading more, I'll send you a script.`,
    ctas: [
      { label: "Email me >", href: "mailto:patrick@pkthewriter.com?subject=Screenwriting", variant: "primary" },
      { label: "See the reel →", href: "/screenwriting", variant: "ghost" },
    ],
    heroTag: "Pilot · 2025",
    thumbs: ["Features", "Pilots", "Shorts"],
  },
  resume: {
    key: "resume",
    intro: INTROS.resume,
    title: "Resume - 2026",
    kicker: "PDF · 1 page",
    copy: "",
    highlights: [
      "20+ years — agency and brand side",
      "Ogilvy · Verizon · AT&amp;T · Airtable · Chevron · BP · Warner Bros.",
      "Writer · Creative Director · Narrative Strategy",
      "ADDYs · Austin Film Festival · CES · iBooks #1 · RACies Silver",
    ],
    ctas: [
      { label: "Download the PDF →", href: "/resume", variant: "primary" },
      { label: "Say hi on LinkedIn >", href: "https://www.linkedin.com/in/patrickkirkland/", variant: "ghost" },
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
      "Day rate available - contact for current range",
      "Retainer pricing for ongoing or multi-sprint work",
      "Project-based for defined-scope deliverables",
      "NDA-friendly - standard or custom",
    ],
    ctas: [
      { label: "Email me →", href: "mailto:patrick@pkthewriter.com?subject=Rates", variant: "primary" },
      { label: "Book 15 min chat→", href: "https://calendar.superhuman.com/book/11VL7tJ5Cd1dIChMDX/2T1Pl", variant: "ghost" },
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
      "Open for new projects starting May 2026",
      "Can extend for the right project",
      "I'll get back to you within 24 hours",
    ],
    ctas: [
      { label: "Email me →", href: "mailto:patrick@pkthewriter.com?subject=Availability", variant: "primary" },
      { label: "Say hi on LinkedIn >", href: "https://www.linkedin.com/in/patrickkirkland/", variant: "ghost" },
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
