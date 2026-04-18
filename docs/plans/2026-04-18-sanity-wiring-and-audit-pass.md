# Sanity wiring + audit pass — implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wire Sanity properly (slug backfill + remove static fallbacks), rebuild the feature map against the real eight brands, redesign the case-study overture as a metadata column + display-serif context, add an animated landing placeholder that rotates example asks, and ship a `/resume` redirect route that hides the Drive URL.

**Architecture:** Eight real Sanity `project` documents exist but every `slug.current` is null. A one-off Node script patches slugs, then `app/work/[slug]/page.tsx` stops falling back to `lib/static-case-studies.ts` (deleted). `lib/feature-static.ts` and `lib/intent-router.ts` get rebuilt against the real brand list with new intent variants for randomised picks (`best ad`, `surprise me`, `what's your favorite`) and inline-form cards (`say hi`, `contact`). The case-study overture becomes a two-column grid (metadata stack left, display-serif context right). `ChatBar` gains a typewriter-style rotating placeholder. `/resume` is a Next.js App Router redirect reading from `RESUME_PDF_URL`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Sanity (`@sanity/client`), Vitest 4.

**Design source:** [docs/plans/2026-04-18-sanity-wiring-and-audit-pass-design.md](docs/plans/2026-04-18-sanity-wiring-and-audit-pass-design.md).

---

## Task order & dependencies

1. **Task 1:** Sanity slug backfill (one-off script). Blocks everything else.
2. **Task 2:** Remove `staticCaseStudy` fallback + verify all 8 URLs render.
3. **Task 3:** Rebuild `FeatureKey` + `lib/feature-static.ts` (TDD-adjacent — types only).
4. **Task 4:** Rewrite `lib/intent-router.ts` for the eight brands + new intent kinds (TDD).
5. **Task 5:** Update `lib/feature-resolver.ts` + `FeatureMap` + `featureCardsQuery` for the eight brands.
6. **Task 6:** Case-study overture rewrite (metadata column + display-serif context).
7. **Task 7:** Animated placeholder rotation in `ChatBar.tsx`.
8. **Task 8:** `ContactCard` component for `say hi` / `contact`.
9. **Task 9:** `/resume` redirect route + env wiring.
10. **Task 10:** Final verification — typecheck, lint, test, build, preview walkthrough.

Commit after every task (or every logical step within a task — never batch unrelated changes into one commit).

---

### Task 1: Sanity slug backfill script

Eight published `project` documents in Sanity (`gz4qpupc` / `portfolio`) all have `slug.current == null`. A one-off script patches each.

**Files:**
- Create: `scripts/backfill-sanity-slugs.ts`
- Modify: `package.json` (add a run-script alias)

**Step 1: Install tsx (if not already present)**

```bash
npm list tsx || npm install --save-dev tsx
```

Expected: either `tsx@…` already listed, or a new install line + entry in `devDependencies`.

**Step 2: Write the script**

Create `scripts/backfill-sanity-slugs.ts`:

```ts
/**
 * One-off: patches slug.current onto every existing Sanity `project` doc.
 *
 * Run: npm run sanity:backfill-slugs
 *
 * Reads the write token from SANITY_READ_TOKEN (despite the name, it has
 * write scope). If the token is missing or wrong this script will fail
 * cleanly with the Sanity API error rather than silently no-op.
 */

import { config } from "dotenv";
import { createClient } from "@sanity/client";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
const token = process.env.SANITY_READ_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_READ_TOKEN in .env.local");
  process.exit(1);
}

const SLUGS: Record<string, string> = {
  "097f287e-7d5d-471e-b9e8-2c3132eeb714": "airtable",
  "22582425-2275-4dbc-9544-94953ae90930": "bp",
  "50a7c7ad-a84e-4f86-aaff-d9573bcc7e58": "techsure",
  "7e640024-60bf-4d4c-8537-54c84ce7f6dc": "verizon-up",
  "8088ad4c-c819-4854-a6f8-cc11e00cc4f9": "chevron",
  "93255641-bb98-45bc-b0ac-99035b92afed": "warnerbros",
  "d8e8d67f-3106-46af-a0d7-6d1cad2da5b7": "att",
  "d9da289a-48c4-46dc-b045-fbf7a9757e31": "mpa",
};

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function main() {
  const ids = Object.keys(SLUGS);
  console.log(`Patching ${ids.length} project docs...`);

  for (const id of ids) {
    const slug = SLUGS[id];
    const result = await client
      .patch(id)
      .set({ slug: { _type: "slug", current: slug } })
      .commit();
    console.log(`  ${id.slice(0, 8)}… → slug=${slug}  (rev=${result._rev})`);
  }

  console.log("Done. Verifying...");
  const query = `*[_type == "project" && defined(slug.current)]{_id, title, "slug": slug.current} | order(slug)`;
  const verified = await client.fetch<Array<{ _id: string; title: string; slug: string }>>(query);
  for (const row of verified) {
    console.log(`  ✓ ${row.slug.padEnd(14)} — ${row.title}`);
  }
  if (verified.length !== ids.length) {
    console.error(`Expected ${ids.length} slugged projects, got ${verified.length}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Step 3: Add the npm script**

In `package.json`, add to the `"scripts"` block:

```json
"sanity:backfill-slugs": "tsx scripts/backfill-sanity-slugs.ts"
```

**Step 4: Run the script**

```bash
npm run sanity:backfill-slugs
```

Expected output (order may differ):

```
Patching 8 project docs...
  097f287e… → slug=airtable  (rev=…)
  22582425… → slug=bp  (rev=…)
  50a7c7ad… → slug=techsure  (rev=…)
  7e640024… → slug=verizon-up  (rev=…)
  8088ad4c… → slug=chevron  (rev=…)
  93255641… → slug=warnerbros  (rev=…)
  d8e8d67f… → slug=att  (rev=…)
  d9da289a… → slug=mpa  (rev=…)
Done. Verifying...
  ✓ airtable       — This is How
  ✓ att            — Lily's Gift Decider 
  ✓ bp             — Team USA
  ✓ chevron        — Rebranding a Giant
  ✓ mpa            — "What Comes Next?"
  ✓ techsure       — "Your Tech Should Work" 
  ✓ verizon-up     — Biggest Little Monsters
  ✓ warnerbros     — "Steve Jobs"
```

If the token is wrong or missing write scope, Sanity will reject the patch with `Insufficient permissions` — flag to the user rather than retrying.

**Step 5: Commit**

```bash
git add package.json package-lock.json scripts/backfill-sanity-slugs.ts
git commit -m "feat(sanity): backfill slugs for the 8 published projects"
```

---

### Task 2: Remove the static case-study fallback

Slugs live in Sanity now. The `?? staticCaseStudy(slug)` fallback in `app/work/[slug]/page.tsx` was a temporary bridge and should go. `lib/static-case-studies.ts` gets deleted.

**Files:**
- Modify: `app/work/[slug]/page.tsx`
- Delete: `lib/static-case-studies.ts`

**Step 1: Simplify `app/work/[slug]/page.tsx`**

Replace the whole file with:

```tsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { caseStudyBySlugQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";
import { CaseStudyView } from "@/components/canvas/CaseStudyView";

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityClient
    .fetch<Project | null>(caseStudyBySlugQuery, { slug })
    .catch(() => null);
  if (!project) notFound();
  return <CaseStudyView project={project} />;
}
```

**Step 2: Delete the fallback module**

```bash
rm lib/static-case-studies.ts
```

**Step 3: Verify no other imports remain**

```bash
grep -rn "static-case-studies" --include="*.ts" --include="*.tsx" .
```

Expected: no output (empty).

**Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

**Step 5: Smoke-test in dev**

```bash
npm run dev
```

Open each of:
- http://localhost:3003/work/airtable
- http://localhost:3003/work/bp
- http://localhost:3003/work/techsure
- http://localhost:3003/work/verizon-up
- http://localhost:3003/work/chevron
- http://localhost:3003/work/warnerbros
- http://localhost:3003/work/att
- http://localhost:3003/work/mpa

Each should render the existing `CaseStudyView` (hero + overture + moments + credits) with real Sanity imagery. No 404s.

Also confirm `http://localhost:3003/work/does-not-exist` returns a 404.

Kill the dev server when done.

**Step 6: Commit**

```bash
git add app/work/[slug]/page.tsx lib/static-case-studies.ts
git commit -m "feat(work): drop static case-study fallback now that Sanity is wired"
```

---

### Task 3: Rebuild `FeatureKey` + `lib/feature-static.ts`

The `FeatureKey` union changes from `verizon | apple | mercedes | writing | screenwriting | resume` to the eight real brand slugs plus the existing `writing`, `screenwriting`, `resume`. `INTROS`, `STATIC_FEATURES`, and `ALTS` are rebuilt against the new set. Apple and Mercedes entries are deleted.

Intros for each brand are Patrick's voice — one dry sentence each, to be tuned later by Patrick if he wants, but here are workable starts drawn from the Sanity copy.

**Files:**
- Modify: `lib/feature-static.ts`

**Step 1: Replace the file wholesale**

```ts
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
```

**Step 2: Typecheck — expect lots of failures**

```bash
npm run typecheck
```

Expected: errors in the files that reference the old keys (`apple`, `mercedes`, `verizon`):
- `lib/feature-resolver.ts` (multiple)
- `lib/intent-router.ts` (multiple)
- `lib/case-study-next.ts` (if the handoff parallel session landed) — references old keys
- possibly `lib/sanity/queries.ts` (`featureCardsQuery` result type)
- `app/page.tsx` (if it imports `FeatureMap`)

These get fixed in Tasks 4 and 5. Do not try to fix them here.

**Step 3: Commit**

```bash
git add lib/feature-static.ts
git commit -m "feat(features): rebuild feature map against 8 real Sanity brands"
```

Note: typecheck is broken at this commit. Tasks 4–5 fix it. The commit is still clean because it captures one coherent change (the rebuild of the static feature map).

---

### Task 4: Rewrite `lib/intent-router.ts` + tests (TDD)

Keywords for the eight brands. New intent variants: random-pick for `best ad` / `surprise me` / `what's your favorite`, and a contact-card intent for `say hi` / `contact`. Apple and Mercedes rules deleted.

The random picks are testable because we can inject a deterministic `random()` function.

**Files:**
- Modify: `lib/intent-router.ts`
- Modify: `lib/intent-router.test.ts` (replace existing brand tests; add new ones)

**Step 1: Write the failing tests**

Replace `lib/intent-router.test.ts` wholesale:

```ts
import { describe, it, expect } from "vitest";
import { routeIntent } from "./intent-router";

/** Deterministic random: always returns 0 → first element of any pool. */
const RAND_ZERO = () => 0;
/** Deterministic random: always returns 0.99 → last element of any pool. */
const RAND_LAST = () => 0.99;

describe("routeIntent — navigation (grid fallback)", () => {
  it("routes 'show me the work' → /work", () => {
    const r = routeIntent("show me the work");
    expect(r.kind).toBe("navigate");
    if (r.kind === "navigate") expect(r.to).toBe("/work");
  });
  it("routes 'case studies' → /work", () => {
    expect(routeIntent("case studies")).toMatchObject({ kind: "navigate", to: "/work" });
  });
  it("routes 'portfolio' → /work", () => {
    expect(routeIntent("portfolio please")).toMatchObject({ kind: "navigate", to: "/work" });
  });
  it("routes 'about you' → /about", () => {
    expect(routeIntent("about you")).toMatchObject({ kind: "navigate", to: "/about" });
  });
  it("solo 'work' routes to /work", () => {
    expect(routeIntent("work")).toMatchObject({ kind: "navigate", to: "/work" });
  });
  it("is case-insensitive for nav keywords", () => {
    expect(routeIntent("Work")).toMatchObject({ kind: "navigate", to: "/work" });
  });
});

describe("routeIntent — brand feature cards", () => {
  it("routes 'airtable' → feature:airtable", () => {
    expect(routeIntent("airtable")).toMatchObject({ kind: "feature", key: "airtable" });
  });
  it("routes 'bp' → feature:bp", () => {
    expect(routeIntent("bp")).toMatchObject({ kind: "feature", key: "bp" });
  });
  it("routes 'chevron' → feature:chevron", () => {
    expect(routeIntent("chevron")).toMatchObject({ kind: "feature", key: "chevron" });
  });
  it("routes 'warner' → feature:warnerbros", () => {
    expect(routeIntent("warner")).toMatchObject({ kind: "feature", key: "warnerbros" });
  });
  it("routes 'warner brothers' → feature:warnerbros", () => {
    expect(routeIntent("warner brothers")).toMatchObject({ kind: "feature", key: "warnerbros" });
  });
  it("routes 'mpa' → feature:mpa", () => {
    expect(routeIntent("mpa")).toMatchObject({ kind: "feature", key: "mpa" });
  });
  it("routes 'at&t' → feature:att", () => {
    expect(routeIntent("at&t")).toMatchObject({ kind: "feature", key: "att" });
  });
  it("routes 'att' → feature:att", () => {
    expect(routeIntent("att")).toMatchObject({ kind: "feature", key: "att" });
  });
  it("routes 'techsure' → feature:techsure", () => {
    expect(routeIntent("techsure")).toMatchObject({ kind: "feature", key: "techsure" });
  });
  it("routes solo 'verizon' → feature:verizon-up (the canonical Verizon)", () => {
    expect(routeIntent("verizon")).toMatchObject({ kind: "feature", key: "verizon-up" });
  });
});

describe("routeIntent — random pool picks", () => {
  it("'best ad' with rand=0 picks the first BEST_AD_POOL entry (warnerbros)", () => {
    expect(routeIntent("best ad", RAND_ZERO)).toMatchObject({ kind: "feature", key: "warnerbros" });
  });
  it("'best ad' with rand=last picks the last BEST_AD_POOL entry (att)", () => {
    expect(routeIntent("best ad", RAND_LAST)).toMatchObject({ kind: "feature", key: "att" });
  });
  it("'surprise me' with rand=0 picks the first ALL_BRANDS entry (airtable)", () => {
    expect(routeIntent("surprise me", RAND_ZERO)).toMatchObject({ kind: "feature", key: "airtable" });
  });
  it("'surprise me' with rand=last picks the last ALL_BRANDS entry (mpa)", () => {
    expect(routeIntent("surprise me", RAND_LAST)).toMatchObject({ kind: "feature", key: "mpa" });
  });
  it("'what's your favorite' picks from FAVORITE_POOL", () => {
    expect(routeIntent("what's your favorite", RAND_ZERO)).toMatchObject({ kind: "feature", key: "att" });
    expect(routeIntent("what's your favorite", RAND_LAST)).toMatchObject({ kind: "feature", key: "mpa" });
  });
  it("'favorite' (solo) also matches", () => {
    expect(routeIntent("favorite", RAND_ZERO)).toMatchObject({ kind: "feature", key: "att" });
  });
});

describe("routeIntent — contact-card intents", () => {
  it("routes 'say hi' → contact-card:hi", () => {
    expect(routeIntent("say hi")).toMatchObject({ kind: "contact-card", variant: "hi" });
  });
  it("routes bare 'hi' → contact-card:hi", () => {
    expect(routeIntent("hi")).toMatchObject({ kind: "contact-card", variant: "hi" });
  });
  it("routes bare 'hello' → contact-card:hi", () => {
    expect(routeIntent("hello")).toMatchObject({ kind: "contact-card", variant: "hi" });
  });
  it("routes 'contact' → contact-card:contact", () => {
    expect(routeIntent("contact")).toMatchObject({ kind: "contact-card", variant: "contact" });
  });
  it("routes 'contact me' → contact-card:contact", () => {
    expect(routeIntent("contact me")).toMatchObject({ kind: "contact-card", variant: "contact" });
  });
});

describe("routeIntent — other features", () => {
  it("routes 'resume' → feature:resume", () => {
    expect(routeIntent("resume")).toMatchObject({ kind: "feature", key: "resume" });
  });
  it("routes 'cv' → feature:resume", () => {
    expect(routeIntent("cv please")).toMatchObject({ kind: "feature", key: "resume" });
  });
  it("routes 'screenplays' → feature:screenwriting", () => {
    expect(routeIntent("do you write screenplays?")).toMatchObject({ kind: "feature", key: "screenwriting" });
  });
  it("routes 'essay' → feature:writing", () => {
    expect(routeIntent("got any essays")).toMatchObject({ kind: "feature", key: "writing" });
  });
});

describe("routeIntent — PI card", () => {
  it("routes 'protagonist ink' → card:pi", () => {
    expect(routeIntent("tell me about protagonist ink")).toMatchObject({ kind: "card", id: "pi" });
  });
  it("routes bare 'pi' → card:pi", () => {
    expect(routeIntent("pi?")).toMatchObject({ kind: "card", id: "pi" });
  });
});

describe("routeIntent — lead (prose without navigation keywords)", () => {
  it("treats long prose as a lead", () => {
    expect(routeIntent("we need a brand voice for a fintech launch")).toMatchObject({ kind: "lead" });
  });
  it("treats a long question as a lead", () => {
    expect(routeIntent("can you help with a launch next quarter")).toMatchObject({ kind: "lead" });
  });
});

describe("routeIntent — clarify (ambiguous short input)", () => {
  it("treats single unmatched word as clarify", () => {
    expect(routeIntent("sup")).toMatchObject({ kind: "clarify" });
  });
  it("treats empty string as clarify", () => {
    expect(routeIntent("")).toMatchObject({ kind: "clarify" });
  });
  it("treats '????' as clarify", () => {
    expect(routeIntent("????")).toMatchObject({ kind: "clarify" });
  });
});
```

**Step 2: Run the tests — expect fail**

```bash
npm run test -- lib/intent-router
```

Expected: most tests fail because the new intent kinds and new keys don't exist yet.

**Step 3: Rewrite `lib/intent-router.ts`**

```ts
/**
 * Intent router for the landing chat bar.
 *
 * Pure function. No side effects. No API calls. No LLM.
 * Keyword matching against a small map, with sensible lead/clarify fallback
 * when nothing matches.
 *
 * v0.4: brand keywords reconciled with Sanity's real catalog (8 brands),
 * new `contact-card` intent for say-hi / contact flows, random-pool picks
 * for `best ad` / `surprise me` / `what's your favorite`. Accepts an
 * optional `random()` so tests can pin deterministic picks.
 */

import { ALL_BRANDS, BEST_AD_POOL, FAVORITE_POOL, type FeatureKey } from "./feature-static";

export type Intent =
  | { kind: "navigate"; to: string; label: string }
  | { kind: "feature"; key: FeatureKey }
  | { kind: "card"; id: "pi" }
  | { kind: "contact-card"; variant: "hi" | "contact" }
  | { kind: "lead" }
  | { kind: "clarify" };

type RandFn = () => number;

function pick<T>(pool: readonly T[], rand: RandFn): T {
  const i = Math.floor(rand() * pool.length);
  return pool[Math.min(i, pool.length - 1)];
}

type Rule = {
  pattern: RegExp;
  intent: Intent | ((rand: RandFn) => Intent);
};

const RULES: Rule[] = [
  // PI card — check first so it doesn't fall through.
  { pattern: /(protagonist\s+ink|\bprotagonist\b|\bpi\b)/i, intent: { kind: "card", id: "pi" } },

  // Contact-card intents — before feature matches so "contact" doesn't nav.
  { pattern: /\b(contact|contact\s+me|get\s+in\s+touch)\b/i, intent: { kind: "contact-card", variant: "contact" } },
  { pattern: /\b(say\s+hi|hi|hello|hey)\b/i, intent: { kind: "contact-card", variant: "hi" } },

  // Random pools.
  { pattern: /\bsurprise\s+me\b/i, intent: (r) => ({ kind: "feature", key: pick(ALL_BRANDS, r) }) },
  { pattern: /(what'?s\s+your\s+favou?rite|\bfavou?rite\b)/i, intent: (r) => ({ kind: "feature", key: pick(FAVORITE_POOL, r) }) },
  { pattern: /\bbest\s+(ad|work|campaign|spot|project)\b/i, intent: (r) => ({ kind: "feature", key: pick(BEST_AD_POOL, r) }) },

  // Resume (before screenwriting so "cv" matches here).
  { pattern: /\b(resume|résumé|cv)\b/i, intent: { kind: "feature", key: "resume" } },

  // Screenwriting.
  { pattern: /\b(screenplay|screenplays|script|scripts|screenwriting|screenwriter|screenwriters|pilot|pilots)\b/i, intent: { kind: "feature", key: "screenwriting" } },

  // Brand keywords. Order matters — more specific first.
  { pattern: /\b(techsure|your\s+tech\s+should\s+work)\b/i, intent: { kind: "feature", key: "techsure" } },
  { pattern: /\b(verizon\s+up|biggest\s+little\s+monsters|verizon)\b/i, intent: { kind: "feature", key: "verizon-up" } },
  { pattern: /\bairtable\b/i, intent: { kind: "feature", key: "airtable" } },
  { pattern: /\bchevron\b/i, intent: { kind: "feature", key: "chevron" } },
  { pattern: /\b(warner(\s*brothers|\s*bros)?|steve\s+jobs)\b/i, intent: { kind: "feature", key: "warnerbros" } },
  { pattern: /(at\s*&\s*t|\batt\b|lily|gift\s+decider)/i, intent: { kind: "feature", key: "att" } },
  { pattern: /\b(mpa|motion\s+picture\s+association|what\s+comes\s+next)\b/i, intent: { kind: "feature", key: "mpa" } },
  { pattern: /\b(bp|team\s+usa)\b/i, intent: { kind: "feature", key: "bp" } },

  // Writing.
  { pattern: /\b(writing|essay|essays|clip|clips|story|stories|column|columns|short|read\s+something)\b/i, intent: { kind: "feature", key: "writing" } },

  // Work grid (broader than brand keywords; last).
  { pattern: /(\bwork\b|case\s+stud(y|ies)|\bportfolio\b|\bads\b|\bcampaigns\b|brand\s+work)/i, intent: { kind: "navigate", to: "/work", label: "case studies" } },

  // About.
  { pattern: /(about\s+(you|patrick|yourself)|who\s+are\s+you|\bbio\b|meet\s+(you|patrick))/i, intent: { kind: "navigate", to: "/about", label: "about" } },
];

const SOLO_NAV: Record<string, Intent> = {
  about: { kind: "navigate", to: "/about", label: "about" },
  bio: { kind: "navigate", to: "/about", label: "about" },
  work: { kind: "navigate", to: "/work", label: "case studies" },
  portfolio: { kind: "navigate", to: "/work", label: "case studies" },
};

export function routeIntent(input: string, rand: RandFn = Math.random): Intent {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return { kind: "clarify" };

  const solo = trimmed.replace(/[.!?]+$/, "").toLowerCase();
  if (SOLO_NAV[solo]) return SOLO_NAV[solo];

  for (const { pattern, intent } of RULES) {
    if (pattern.test(trimmed)) return typeof intent === "function" ? intent(rand) : intent;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const hasAlpha = /[a-z]/i.test(trimmed);
  const hasQuestion = trimmed.includes("?");

  if (!hasAlpha) return { kind: "clarify" };
  if (words.length >= 3) return { kind: "lead" };
  if (trimmed.length >= 20) return { kind: "lead" };
  if (hasQuestion && trimmed.length >= 8) return { kind: "lead" };

  return { kind: "clarify" };
}
```

**Step 4: Run the tests — expect PASS**

```bash
npm run test -- lib/intent-router
```

Expected: all tests pass.

**Step 5: Commit**

```bash
git add lib/intent-router.ts lib/intent-router.test.ts
git commit -m "feat(router): 8-brand keyword map + random pools + contact-card intent"
```

---

### Task 5: Update `lib/feature-resolver.ts` + `FeatureMap` + `featureCardsQuery`

The resolver's `FeatureMap` shape changes (keys become the eight brand slugs instead of verizon/apple/mercedes). `featureCardsQuery` rewrites to hit the eight brands in one round-trip. The resolver's `projectCard` helper generalizes to any brand key.

**Files:**
- Modify: `lib/feature-resolver.ts`
- Modify: `lib/sanity/queries.ts` (`featureCardsQuery`, `FeatureCardsResult`)
- Modify: `app/page.tsx` (query invocation — mirror the shape)

**Step 1: Rewrite `lib/sanity/queries.ts` feature-cards section**

Replace the `featureCardsQuery` + `FeatureCardsResult` block (lines starting at `/** Landing feature-card preload`) with:

```ts
/**
 * Landing feature-card preload — returns a lookup of the eight brand
 * projects by their slug. Writing is intentionally excluded until a
 * writingClip doc exists; the resolver falls back to static copy.
 */
export const featureCardsQuery = /* groq */ `
  {
    "airtable":   *[_type == "project" && slug.current == "airtable"][0]   { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "bp":         *[_type == "project" && slug.current == "bp"][0]         { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "techsure":   *[_type == "project" && slug.current == "techsure"][0]   { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "verizon-up": *[_type == "project" && slug.current == "verizon-up"][0] { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "chevron":    *[_type == "project" && slug.current == "chevron"][0]    { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "warnerbros": *[_type == "project" && slug.current == "warnerbros"][0] { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "att":        *[_type == "project" && slug.current == "att"][0]        { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) },
    "mpa":        *[_type == "project" && slug.current == "mpa"][0]        { "slug": slug.current, title, brand, year, type, "excerpt": context, "coverImage": coalesce(heroImage, mainImage) }
  }
`;

type RawProject = {
  slug: string;
  title: string;
  brand?: string;
  year?: string;
  type?: string;
  excerpt?: string;
  coverImage?: { asset: { _ref: string; _type: "reference" } };
};

export type FeatureCardsResult = {
  airtable: RawProject | null;
  bp: RawProject | null;
  techsure: RawProject | null;
  "verizon-up": RawProject | null;
  chevron: RawProject | null;
  warnerbros: RawProject | null;
  att: RawProject | null;
  mpa: RawProject | null;
};
```

Delete any now-orphaned `RawWriting` type if nothing else references it.

**Step 2: Rewrite `lib/feature-resolver.ts`**

```ts
/**
 * Feature resolver — merges a Sanity-backed card map with the static
 * intros in feature-static.ts. Pure, synchronous.
 */

import { ALTS, INTROS, STATIC_FEATURES, type FeatureKey } from "./feature-static";
import { urlForImage } from "./sanity/image";

export type FeatureCta = { label: string; href: string; variant: "primary" | "ghost" };

export type FeatureCard = {
  key: FeatureKey;
  intro: string;
  title: string;
  kicker: string;
  copy: string;
  ctas: FeatureCta[];
  heroTag?: string;
  thumbs?: string[];
  coverImageUrl?: string;
  alts: Array<{ key: FeatureKey | "work"; label: string; note?: string }>;
};

export type SanityFeatureProject = {
  slug: string;
  title: string;
  brand?: string;
  year?: string;
  type?: string;
  excerpt?: string;
  coverImage?: { asset: { _ref: string; _type: "reference" } };
};

export type FeatureMap = {
  airtable?: SanityFeatureProject | null;
  bp?: SanityFeatureProject | null;
  techsure?: SanityFeatureProject | null;
  "verizon-up"?: SanityFeatureProject | null;
  chevron?: SanityFeatureProject | null;
  warnerbros?: SanityFeatureProject | null;
  att?: SanityFeatureProject | null;
  mpa?: SanityFeatureProject | null;
};

type BrandKey = keyof FeatureMap;

const BRAND_KEYS = new Set<string>([
  "airtable", "bp", "techsure", "verizon-up", "chevron", "warnerbros", "att", "mpa",
]);

function isBrandKey(k: FeatureKey): k is BrandKey {
  return BRAND_KEYS.has(k);
}

function projectCard(key: BrandKey, project: SanityFeatureProject | null | undefined): FeatureCard {
  const base = STATIC_FEATURES[key];
  if (!project) return { ...base, alts: ALTS[key] };
  const kickerParts = [project.brand, project.year, project.type].filter(Boolean);
  const coverImageUrl = project.coverImage ? urlForImage(project.coverImage).width(1600).url() : undefined;
  return {
    key,
    intro: INTROS[key],
    title: project.title,
    kicker: kickerParts.join(" · ") || base.kicker,
    copy: project.excerpt ?? base.copy,
    coverImageUrl,
    ctas: [
      { label: "Read the story →", href: `/work/${project.slug}`, variant: "primary" },
      { label: "View the artifacts", href: `/work/${project.slug}#artifacts`, variant: "ghost" },
    ],
    heroTag: base.heroTag,
    thumbs: base.thumbs,
    alts: ALTS[key],
  };
}

export function resolveFeature(key: FeatureKey, map?: FeatureMap): FeatureCard {
  if (isBrandKey(key)) return projectCard(key, map?.[key]);
  // Non-brand keys (writing, screenwriting, resume) render from statics only.
  return { ...STATIC_FEATURES[key], alts: ALTS[key] };
}

export { type FeatureKey } from "./feature-static";
```

**Step 3: Update `app/page.tsx` to pass the new FeatureMap shape**

Find the fetch + prop-pass for `featureCardsQuery` and update the type binding so it compiles against the new `FeatureMap`. If the file currently has:

```ts
const featureMap = await sanityClient.fetch<FeatureCardsResult>(featureCardsQuery).catch(() => ({} as FeatureCardsResult));
```

Then the typecheck should pass already. The only place that might need manual intervention is if `app/page.tsx` was constructing `FeatureMap` by destructuring specific keys. Read it, adjust if necessary.

```bash
cat app/page.tsx
```

If it just passes `featureMap={featureMap}` to `<LandingClient />`, you're done — TS will check the shape.

**Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: PASS.

If `lib/case-study-next.ts` exists from the parallel session and references `apple` / `mercedes`, fix those references here too — the file's keyword set needs to be the new eight brands.

**Step 5: Commit**

```bash
git add lib/feature-resolver.ts lib/sanity/queries.ts app/page.tsx
git commit -m "feat(resolver): generalize brand cards over all 8 Sanity slugs"
```

---

### Task 6: Case-study overture rewrite

Replace the current `§ Overture` block with a two-column overture section directly under the hero. Left column = metadata stack (Client / Role / Year / Type / — / Disciplines / Deliverables / Impact). Right column = the `context` paragraph in large display serif with a subtle bottom fade.

Remove the bottom Credits strip — its contents moved up.

**Files:**
- Modify: `components/canvas/CaseStudyView.tsx`

**Step 1: Rewrite the relevant sections of the file**

Open `components/canvas/CaseStudyView.tsx`. Keep the hero section (lines ~13–49) unchanged. Replace the Overture, Moments, Gallery, Credits, and Portable-Text-fallback blocks with:

```tsx
      {/* Overture — metadata stack on the left, display-serif context on the right */}
      {(p.context || p.disciplines?.length || p.deliverables?.length || p.impact?.length) && (
        <section className="px-[60px] pt-[88px] pb-[60px] max-[820px]:px-[24px] max-[820px]:pt-[60px] max-[820px]:pb-[40px]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-[minmax(200px,260px)_1fr] gap-[80px] max-[820px]:grid-cols-1 max-[820px]:gap-[40px]">
            <aside>
              <MetadataRow label="Client" value={p.brand} />
              <MetadataRow label="Role" value={p.role} />
              <MetadataRow label="Year" value={p.year} />
              <MetadataRow label="Type" value={p.type} />
              {(p.disciplines?.length || p.deliverables?.length || p.impact?.length) && (
                <div className="mt-[28px] pt-[28px] border-t border-[var(--color-paper-line)]">
                  {p.disciplines?.length ? <MetadataRow label="Disciplines" value={p.disciplines.join(", ")} /> : null}
                  {p.deliverables?.length ? <MetadataRow label="Deliverables" value={p.deliverables.join(", ")} /> : null}
                  {p.impact?.length ? <MetadataRow label="Impact" value={p.impact.join(" · ")} /> : null}
                </div>
              )}
            </aside>

            {p.context && (
              <div className="relative">
                <p className="font-[family-name:var(--font-serif)] font-normal text-[clamp(26px,3.2vw,42px)] leading-[1.22] tracking-[-0.005em] m-0 text-[var(--color-ink)]">
                  {p.context}
                </p>
                <div
                  aria-hidden="true"
                  className="absolute left-0 right-0 bottom-0 h-[96px] pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(15,14,12,0) 0%, var(--color-paper) 92%)",
                  }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Numbered moments — editorial sections, intercut with gallery stills */}
      {moments.length > 0 && (
        <div className="pb-[80px]">
          {moments.map((section, i) => (
            <Moment key={`moment-${i}`} section={section} index={i} />
          ))}
        </div>
      )}

      {/* Gallery fallback — if no editorial sections, show gallery as full-bleed stills */}
      {moments.length === 0 && p.gallery?.length ? (
        <section className="pb-[80px]">
          {p.gallery.map((img, i) => (
            <figure key={`gal-${i}`} className="w-full mb-[2px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlForImage(img).width(2000).url()} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </section>
      ) : null}

      {/* Portable-Text fallback — conflict/resolution if no editorial sections */}
      {moments.length === 0 && (p.conflict || p.resolution) && (
        <section className="px-[60px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[56px]">
          <div className="max-w-[740px] mx-auto space-y-[48px]">
            {p.conflict && (
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[18px]">
                  § 01 &nbsp; Conflict
                </div>
                <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink)] [&_p]:mb-[18px]">
                  <PortableText value={p.conflict} />
                </div>
              </div>
            )}
            {p.resolution && (
              <div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[18px]">
                  § 02 &nbsp; Resolution
                </div>
                <div className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.65] text-[var(--color-ink)] [&_p]:mb-[18px]">
                  <PortableText value={p.resolution} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
```

**Step 2: Add the `MetadataRow` helper, delete the old `CreditCol`**

At the bottom of the same file, replace `CreditCol` with `MetadataRow`:

```tsx
function MetadataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-[18px]">
      <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)] mb-[6px]">
        {label}
      </div>
      <div className="font-[family-name:var(--font-serif)] text-[17px] leading-[1.35] text-[var(--color-ink)]">
        {value}
      </div>
    </div>
  );
}
```

Delete the old `CreditCol` function entirely.

**Step 3: Verify the moment component is unchanged**

The `Moment` helper (the numbered-section renderer) stays as-is. Read it to confirm nothing referenced `CreditCol`.

**Step 4: Typecheck + lint**

```bash
npm run typecheck && npm run lint
```

Expected: PASS. Any unused-variable warnings indicate an incomplete edit — clean them up.

**Step 5: Preview**

```bash
npm run dev
```

Open `http://localhost:3003/work/airtable`. Expect:
- Full-bleed hero unchanged (image + kicker + title + role bottom-left).
- Below hero: two-column grid. Left column has `CLIENT`, `ROLE`, `YEAR`, `TYPE` as mono-labelled serif values. Rule. Then `DISCIPLINES`, `DELIVERABLES`, `IMPACT` in the same treatment.
- Right column: the `context` sentence in big display serif, with a subtle fade at the bottom.
- No `§ Overture` heading.
- No bottom credits strip.
- Moments render below in the existing numbered-section format.

Check two or three other slugs to confirm consistency.

**Step 6: Commit**

```bash
git add components/canvas/CaseStudyView.tsx
git commit -m "feat(case-study): overture as metadata column + display-serif context"
```

---

### Task 7: Animated placeholder rotation in ChatBar

The placeholder input types → holds → erases → rotates. Pool of 8 sample asks. Rotates 4 picks then lands on `surprise me`. Stops on focus, on user input, on `prefers-reduced-motion`.

The rotation *scheduler* is a tiny pure helper we can unit-test; the DOM side effects live in the `useEffect`.

**Files:**
- Create: `lib/placeholder-rotation.ts`
- Create: `lib/placeholder-rotation.test.ts`
- Modify: `components/landing/ChatBar.tsx`

**Step 1: Write the failing tests**

```ts
// lib/placeholder-rotation.test.ts
import { describe, it, expect } from "vitest";
import { buildRotationPlan, DEFAULT_POOL, LANDING_PLACEHOLDER } from "./placeholder-rotation";

describe("buildRotationPlan", () => {
  it("always ends with the landing placeholder", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    expect(plan[plan.length - 1]).toBe(LANDING_PLACEHOLDER);
  });

  it("produces 5 entries by default (4 picks + landing)", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    expect(plan).toHaveLength(5);
  });

  it("never picks the landing placeholder for intermediate slots", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    const intermediates = plan.slice(0, -1);
    expect(intermediates).not.toContain(LANDING_PLACEHOLDER);
  });

  it("never repeats the same example back-to-back", () => {
    // rand=0 would normally pick index 0 every time; the plan must dedupe.
    const plan = buildRotationPlan({ rand: () => 0 });
    for (let i = 1; i < plan.length; i++) {
      expect(plan[i]).not.toBe(plan[i - 1]);
    }
  });

  it("draws from DEFAULT_POOL", () => {
    const plan = buildRotationPlan({ rand: () => 0 });
    for (const entry of plan) {
      expect([...DEFAULT_POOL, LANDING_PLACEHOLDER]).toContain(entry);
    }
  });
});
```

**Step 2: Run — expect fail**

```bash
npm run test -- lib/placeholder-rotation
```

Expected: fails with "module not found".

**Step 3: Implement the helper**

```ts
// lib/placeholder-rotation.ts

/**
 * Pure scheduler for the ChatBar's rotating placeholder.
 *
 * Produces an ordered list of sample strings to display in the input
 * placeholder. The last entry is always LANDING_PLACEHOLDER (the resting
 * state). Intermediate entries are drawn without replacement from a pool,
 * with the constraint that no two adjacent entries are equal.
 */

export const LANDING_PLACEHOLDER = "/ surprise me";

export const DEFAULT_POOL = [
  "/ best ad",
  "/ work",
  "/ resume",
  "/ contact",
  "/ about",
  "/ say hi",
  "/ what's your favorite",
] as const;

export type RotationPlanOptions = {
  rand?: () => number;
  /** Number of intermediate picks before the landing placeholder (default 4). */
  steps?: number;
  pool?: readonly string[];
};

export function buildRotationPlan(opts: RotationPlanOptions = {}): string[] {
  const rand = opts.rand ?? Math.random;
  const steps = opts.steps ?? 4;
  const pool = opts.pool ?? DEFAULT_POOL;

  const plan: string[] = [];
  let prev: string | null = null;
  for (let i = 0; i < steps; i++) {
    const choice = pickDifferent(pool, prev, rand);
    plan.push(choice);
    prev = choice;
  }
  plan.push(LANDING_PLACEHOLDER);
  return plan;
}

function pickDifferent(pool: readonly string[], exclude: string | null, rand: () => number): string {
  if (pool.length === 1) return pool[0];
  let i = Math.floor(rand() * pool.length);
  if (pool[i] === exclude) i = (i + 1) % pool.length;
  return pool[i];
}
```

**Step 4: Run — expect PASS**

```bash
npm run test -- lib/placeholder-rotation
```

Expected: all green.

**Step 5: Wire the rotation into `ChatBar.tsx`**

Open `components/landing/ChatBar.tsx`. Near the top imports, add:

```tsx
import { buildRotationPlan, LANDING_PLACEHOLDER } from "@/lib/placeholder-rotation";
```

Inside the `ChatBar` component, below the existing `const [value, setValue] = useState("");` line, add the placeholder rotation state + effect:

```tsx
const [placeholder, setPlaceholder] = useState<string>(LANDING_PLACEHOLDER);

// Animated rotating placeholder. Pauses on focus, on input, and on
// prefers-reduced-motion. Always lands on LANDING_PLACEHOLDER.
useEffect(() => {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setPlaceholder(LANDING_PLACEHOLDER);
    return;
  }

  const plan = buildRotationPlan();
  let cancelled = false;
  let timers: ReturnType<typeof setTimeout>[] = [];

  async function run() {
    for (const target of plan) {
      if (cancelled) return;
      await typeOut(target);
      if (target === LANDING_PLACEHOLDER) return;
      await wait(1600);
      if (cancelled) return;
      await eraseBack();
      await wait(140);
    }
  }

  function wait(ms: number) {
    return new Promise<void>((resolve) => {
      const t = setTimeout(resolve, ms);
      timers.push(t);
    });
  }

  function typeOut(target: string) {
    return new Promise<void>((resolve) => {
      let i = 0;
      function step() {
        if (cancelled) return resolve();
        i += 1;
        setPlaceholder(target.slice(0, i));
        if (i >= target.length) return resolve();
        const t = setTimeout(step, 38);
        timers.push(t);
      }
      step();
    });
  }

  function eraseBack() {
    return new Promise<void>((resolve) => {
      function step() {
        if (cancelled) return resolve();
        setPlaceholder((prev) => {
          const next = prev.slice(0, -1);
          if (next.length === 0) {
            const t = setTimeout(resolve, 0);
            timers.push(t);
            return next;
          }
          const t = setTimeout(step, 22);
          timers.push(t);
          return next;
        });
      }
      step();
    });
  }

  run();

  return () => {
    cancelled = true;
    for (const t of timers) clearTimeout(t);
  };
}, []);

// Stop the rotation as soon as the user focuses or types.
function stopRotation() {
  setPlaceholder(LANDING_PLACEHOLDER);
}
```

Then, in the `<input>` element, replace the hardcoded `placeholder="/ best ad"` attribute with `placeholder={placeholder}` and add `onFocus={stopRotation}`:

```tsx
<input
  ref={inputRef}
  id="chat"
  type="text"
  value={value}
  onChange={(e) => {
    stopRotation();
    setValue(e.target.value);
    if (mode === "clarify") setMode("initial");
  }}
  onFocus={stopRotation}
  placeholder={placeholder}
  aria-label="Ask Patrick a question"
  className="… (unchanged)"
/>
```

The `stopRotation` call on change is what halts the typewriter if a user starts typing before the rotation finishes.

**Step 6: Preview**

```bash
npm run dev
```

Open the landing. Expect: the placeholder types in `/ best ad` character by character, holds, erases, types the next, erases, and after 4 rotations settles on `/ surprise me`. Focus the input — rotation stops and the placeholder snaps to `/ surprise me`. Toggle `prefers-reduced-motion` in DevTools (Rendering panel → Emulate CSS media feature `prefers-reduced-motion: reduce`), reload — placeholder is immediately `/ surprise me`, no animation.

**Step 7: Commit**

```bash
git add lib/placeholder-rotation.ts lib/placeholder-rotation.test.ts components/landing/ChatBar.tsx
git commit -m "feat(chat): animated rotating placeholder landing on 'surprise me'"
```

---

### Task 8: ContactCard component for `say hi` / `contact`

A new card rendered by `LandingClient` when the router returns `{ kind: "contact-card" }`. Shares the same mount slot as `ResponseFeature` but has its own component.

**Files:**
- Create: `components/landing/ContactCard.tsx`
- Modify: `components/landing/ChatBar.tsx` (new `onContactCard` prop)
- Modify: `app/landing-client.tsx` (state + render)

**Step 1: Create the ContactCard component**

```tsx
// components/landing/ContactCard.tsx
"use client";

import { useState } from "react";

type Variant = "hi" | "contact";

type Props = {
  variant: Variant;
  onLead: (message: string) => Promise<void>;
  onFallback: () => void;
};

const COPY: Record<Variant, { eyebrow: string; title: string; body: string }> = {
  hi: {
    eyebrow: "→ Hey back.",
    title: "What should I tell you about?",
    body: "Drop a line — a project, a question, an intro you want me to make. I read everything.",
  },
  contact: {
    eyebrow: "→ Sure.",
    title: "Patrick Kirkland",
    body: "Email, LinkedIn, or just tell me what you're working on below. I get back to every note, usually same day.",
  },
};

export function ContactCard({ variant, onLead, onFallback }: Props) {
  const copy = COPY[variant];
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || status === "sending") return;
    setStatus("sending");
    try {
      await onLead(trimmed);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="response-slot mt-[34px]" aria-live="polite">
      <p className="font-[family-name:var(--font-mono)] text-[13px] leading-[1.6] text-[var(--color-ink-mid)] mb-[22px]">
        <span className="text-[var(--color-accent)] mr-1">→</span>
        {copy.eyebrow.replace(/^→\s*/, "")}
      </p>

      <article
        className="overflow-hidden rounded-[22px] border border-[var(--color-paper-line)] shadow-[var(--shadow-soft)]"
        style={{ background: "linear-gradient(180deg, var(--color-paper-panel) 0%, #fcf8ee 100%)" }}
      >
        <div className="px-[42px] py-[38px] max-[820px]:px-[26px] max-[820px]:py-[28px]">
          <h2 className="font-[family-name:var(--font-serif)] font-normal text-[44px] leading-[1] tracking-[-0.01em] m-0 mb-[14px] max-[820px]:text-[36px]">
            {copy.title}
          </h2>
          <p className="font-[family-name:var(--font-serif)] text-[19px] leading-[1.6] text-[var(--color-ink-mid)] max-w-[62ch] m-0 mb-[22px]">
            {copy.body}
          </p>

          {status !== "sent" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[12px]" autoComplete="off">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="A sentence is enough."
                rows={3}
                className="
                  w-full px-[20px] py-[16px]
                  font-[family-name:var(--font-mono)] text-[14px]
                  text-[var(--color-ink)]
                  bg-[var(--color-paper)]
                  border border-[var(--color-paper-line)]
                  rounded-[14px]
                  outline-none resize-none
                  placeholder:text-[var(--color-ink-faint)]
                  focus:border-[var(--color-ink-soft)]
                "
              />
              <div className="flex flex-wrap items-center gap-[14px]">
                <button
                  type="submit"
                  disabled={!value.trim() || status === "sending"}
                  className="inline-flex items-center gap-2 px-[22px] py-[12px] rounded-[10px] font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === "sending" ? "Sending…" : "Send →"}
                </button>
                <a
                  href="mailto:patrick@pkthewriter.com"
                  className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase text-[var(--color-ink-mid)] hover:text-[var(--color-ink)]"
                >
                  Email
                </a>
                {variant === "contact" && (
                  <a
                    href="https://www.linkedin.com/in/patrickkirkland/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.12em] uppercase text-[var(--color-ink-mid)] hover:text-[var(--color-ink)]"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
              {status === "error" && (
                <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--color-accent)]">
                  That didn't send — try email instead.
                </p>
              )}
            </form>
          ) : (
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-mid)]">
              <span className="text-[var(--color-accent)] mr-1">•</span>
              Got it. I'll reply directly.
            </p>
          )}
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[10px] mt-[22px] pt-[20px]">
        <button
          type="button"
          onClick={onFallback}
          className="font-[family-name:var(--font-serif)] text-[15px] text-[var(--color-ink-mid)] hover:text-[var(--color-ink)] underline decoration-[var(--color-paper-line)] underline-offset-4"
        >
          Or did you want to talk about something else?
        </button>
      </div>
    </section>
  );
}
```

Confirm the LinkedIn URL matches Patrick's actual profile before committing. If he has a different canonical URL, swap it in.

**Step 2: Update `ChatBar.tsx` to emit the contact-card intent**

Near the top of the file, add to the `Props` type:

```ts
onContactCard: (variant: "hi" | "contact") => void;
```

Destructure it in the function arguments, then add a case in `dispatch`'s switch:

```ts
case "contact-card": {
  setMode("initial");
  setReply(null);
  setValue("");
  onContactCard(intent.variant);
  return;
}
```

**Step 3: Update `app/landing-client.tsx` to render ContactCard**

Add to the imports:

```ts
import { ContactCard } from "@/components/landing/ContactCard";
```

Alongside the existing `feature` state, add:

```ts
const [contactCard, setContactCard] = useState<"hi" | "contact" | null>(null);
```

Add a handler:

```ts
function handleContactCard(variant: "hi" | "contact") {
  setFeature(null);
  setContactCard(variant);
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
```

Update `handleReset` to also clear the contact card:

```ts
function handleReset() {
  setFeature(null);
  setContactCard(null);
}
```

Update `inResponse`:

```ts
const inResponse = feature !== null || contactCard !== null;
```

Wire the new prop into `<ChatBar />`:

```tsx
<ChatBar
  onLead={handleLead}
  onNavigate={handleNavigate}
  onCard={(id) => id === "pi" && setPiOpen(true)}
  onFeature={(key) => handleFeature(key)}
  onContactCard={handleContactCard}
  inResponse={inResponse}
  onReset={handleReset}
  autoFocus={autoFocus}
/>
```

Render the card when present:

```tsx
{feature && (
  <ResponseFeature feature={feature} onAltSelect={(key) => handleFeature(key)} />
)}
{contactCard && (
  <ContactCard
    variant={contactCard}
    onLead={handleLead}
    onFallback={handleReset}
  />
)}
```

**Step 4: Preview**

```bash
npm run dev
```

Type `hi` into the prompt. Expect: the ContactCard renders with "Hey back. / What should I tell you about?" + textarea + Send + Email buttons. No LinkedIn link.

Reset (× button). Type `contact`. Expect: same card with "Sure. / Patrick Kirkland" copy and a LinkedIn link alongside Email.

Submit a note → status flips to "Got it." and the API receives a lead (watch the terminal for the /api/lead log if one exists; otherwise trust the POST).

Click "Or did you want to talk about something else?" → card disappears, landing resets.

**Step 5: Typecheck + lint + test**

```bash
npm run typecheck && npm run lint && npm run test
```

Expected: all PASS.

**Step 6: Commit**

```bash
git add components/landing/ContactCard.tsx components/landing/ChatBar.tsx app/landing-client.tsx
git commit -m "feat(landing): ContactCard for say-hi + contact intents"
```

---

### Task 9: `/resume` redirect route

Hides the Google Drive URL behind a shortlink. Only `app/resume/route.ts` touches the URL; every other reference in the codebase is `/resume`.

**Files:**
- Create: `app/resume/route.ts`
- Modify: `.env.local` (add `RESUME_PDF_URL`)
- Modify: `.env.example` (document the new var)
- Grep for any direct Drive URL usages in code/components and replace them with `/resume`.

**Step 1: Add the env var**

Append to `.env.local`:

```
RESUME_PDF_URL=https://drive.google.com/file/d/17nPnGb8Xv2bj9XJzf0JF3HNSuGV7Zz9l/view?usp=sharing
```

Append to `.env.example`:

```
RESUME_PDF_URL=
```

**Step 2: Create the route**

```ts
// app/resume/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const url = process.env.RESUME_PDF_URL;
  if (!url) {
    return NextResponse.json({ error: "Resume URL not configured" }, { status: 503 });
  }
  return NextResponse.redirect(url, 302);
}
```

**Step 3: Audit for Drive URL leakage**

```bash
grep -rn "drive.google.com" --include="*.ts" --include="*.tsx" --include="*.md" .
```

Expected: only `.env.local`, `.env.example`, `docs/plans/2026-04-18-sanity-wiring-and-audit-pass-design.md`, and `docs/plans/2026-04-18-sanity-wiring-and-audit-pass.md` contain the URL. No component file, no meta tag, no structured-data block. If anything else shows up, replace the URL with `/resume`.

Also audit for any visible `href` or `<a>` pointing at `drive.google.com`:

```bash
grep -rn "17nPnGb8" --include="*.ts" --include="*.tsx" .
```

Same expectation — only `.env.*` and docs.

**Step 4: Verify the route works**

```bash
npm run dev
```

In one terminal:

```bash
curl -I http://localhost:3003/resume
```

Expected: `HTTP/1.1 302` with `location: https://drive.google.com/file/d/…/view?usp=sharing`.

Also open `http://localhost:3003/resume` in a browser — should redirect to the Drive preview.

Then confirm no leak:

```bash
curl -s http://localhost:3003/ | grep -i "drive.google.com"
```

Expected: no output (empty).

**Step 5: Commit**

```bash
git add app/resume/route.ts .env.example
git commit -m "feat(resume): /resume redirect route hides Drive URL"
```

(`.env.local` is gitignored; don't try to commit it.)

---

### Task 10: Final verification

**Step 1: Full check suite**

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

All four must pass. Pre-existing lint warnings for unrelated `<img>` tags in files you didn't touch are acceptable.

**Step 2: Preview walkthrough**

```bash
npm run dev
```

Walk these in order and confirm each works:

**Landing:**
- [ ] Placeholder types in `/ best ad`, erases, types `/ work`, erases, …, lands on `/ surprise me`.
- [ ] Pressing `/` focuses the input and freezes the placeholder at `/ surprise me`.
- [ ] Typing `best ad` → a brand feature card appears (random from warnerbros/airtable/verizon-up/att).
- [ ] Typing `surprise me` → a random brand card appears.
- [ ] Typing `what's your favorite` → a card from att/warnerbros/mpa.
- [ ] Typing `hi` → ContactCard with "Hey back." copy, no LinkedIn.
- [ ] Typing `contact` → ContactCard with "Sure." copy plus LinkedIn link.
- [ ] Clicking the "something else" link resets the landing.

**Case studies (all 8 slugs):**
- [ ] `/work/airtable` renders hero with Airtable imagery; metadata column shows Client: Airtable, Role: Creative Director, Year: 10 / 2024, Type: Brand Campaign, then Disciplines, Deliverables, Impact.
- [ ] Right column shows the Airtable context paragraph in large display serif with bottom fade.
- [ ] `§ 01`, `§ 02`, `§ 03` moments render below.
- [ ] No bottom credits strip.
- [ ] The other seven slugs all render without errors.
- [ ] `/work/does-not-exist` → 404.

**Resume:**
- [ ] `curl -I http://localhost:3003/resume` returns 302 + Drive URL in the `location` header.
- [ ] `view-source:http://localhost:3003/` contains no `drive.google.com` anywhere.

**Back-navigation from case study:**
- [ ] `← All work` in the top-left of any case study goes to `/work`.
- [ ] If the handoff-block PR from the parallel session has landed: the `NEXT — X` block at the foot points to the next case study by slug; the `Or ask for something specific →` link goes to `/?ask=1` and focuses the prompt on the landing.

**Step 3: Commit any adjustments**

If verification surfaced a small tweak, commit it with a targeted message. Otherwise nothing to commit — prior tasks are enough.

**Step 4: Done**

Stop the dev server. Summarize what shipped to the user.

---

## Non-goals (don't do these)

- No Sanity Studio schema changes beyond the slug backfill.
- No new Sanity content types (no writingClip, no aboutPage, no suggestionSet).
- No HeroIntro edits. It stays spare.
- No numbered-moment redesign. Those work.
- No new rail entries. Rail stays Home / Work / Writing / About / Contact.
- No stupid-input `bounce` intent. That's a separate task for later.
- No type-on animation on the response interpretation line. Deferred.
- No sticky § TOC rail. Deferred.
- No ⌘K palette. Deferred.
