# pkthewriter Chat-First Portfolio V1 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a chat-first, single-page personal portfolio for Patrick (copywriter/screenwriter) that surfaces case studies, writing, resume, a Protagonist Ink hand-off, and a screenwriting gallery via a chat-bar-hero landing page with full-canvas takeover responses.

**Architecture:** Next.js 16 App Router + React 19 + Tailwind 4, content from pkthewriter's existing Sanity project (`gz4qpupc`), lead capture via Resend email, motion via `motion` library. Dark landing, light canvas takeovers (the "Stage" direction).

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind CSS 4, `next-sanity`, `@portabletext/react`, `motion`, `resend`, Vercel (Analytics + Speed Insights).

**Design doc:** `/Users/pat/.claude/plans/sunny-bubbling-pine.md` — read this first.

**Seed prototype:** `/Users/pat/Documents/Claude/Projects/Protagonist Ink/portfolio.html` — source of palette, typography, and voice.

---

## Pre-flight — READ BEFORE CODING

### Task 0: Read the Next.js 16 docs

**Why:** Per `/Users/pat/Sites/Protagonist Ink/Content-Dash/AGENTS.md`, this is "NOT the Next.js you know." Next 16 has breaking changes from training data. Read the App Router, route-handlers, and metadata docs.

**Step 1:** Check what docs are available:

```bash
ls /Users/pat/Sites/Protagonist\ Ink/PI_site/node_modules/next/dist/docs/ 2>/dev/null || ls /Users/pat/Sites/Content-Dash/node_modules/next/dist/docs/ 2>/dev/null
```

**Step 2:** Read at minimum:
- App Router overview
- Route handlers (for `/api/lead`)
- Metadata API (for OG tags)
- Dynamic route segments (for `/work/[slug]`, `/story/[slug]`)
- `next/font` (Inter, Space Mono)

**Step 3:** Note any deprecation warnings. Do NOT proceed to scaffolding with pattern assumptions from older Next versions.

### Task 1: Verify environment + destination

**Step 1:** Confirm destination is empty:

```bash
ls -la "/Users/pat/Sites/pkthewriter/minimal/"
```

Expected: only `docs/plans/2026-04-16-chat-first-portfolio-v1.md` (and `.DS_Store`). If there are unexpected files, STOP and ask Pat.

**Step 2:** Check Node version:

```bash
node --version
```

Expected: v20.x or v22.x. Next 16 requires Node 20+.

**Step 3:** Confirm PI_site's Sanity projectId as a cross-check (we're reusing pkthewriter's, not PI_site's):

Read `/Users/pat/Sites/pkthewriter/v3/src/sanity.js`. Expected: `projectId: 'gz4qpupc'`. This is **pkthewriter's** Sanity, not PI_site's. Pat's live studio is at `https://pkthewriter.sanity.studio/`.

---

## Phase 1 — Scaffold

### Task 2: Initialize Next.js 16 project

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/` (populate)

**Step 1:** Run create-next-app in place:

```bash
cd "/Users/pat/Sites/pkthewriter/minimal" && \
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --turbopack --yes
```

**Step 2:** Verify it created the expected files:

```bash
ls /Users/pat/Sites/pkthewriter/minimal/
```

Expected: `app/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`.

**Step 3:** Confirm versions:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && cat package.json | grep -E '"(next|react|tailwindcss)"'
```

Expected: Next 16.x, React 19.x, Tailwind 4.x. If lower, stop and resolve.

**Step 4:** Commit the scaffold:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && \
git init && \
git add -A && \
git commit -m "chore: scaffold Next.js 16 + Tailwind 4 project"
```

### Task 3: Install dependencies

**Files:**
- Modify: `/Users/pat/Sites/pkthewriter/minimal/package.json`

**Step 1:** Install runtime deps:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && \
npm install next-sanity @portabletext/react motion resend @vercel/analytics @vercel/speed-insights lucide-react
```

**Step 2:** Verify typecheck still passes with zero source files:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

Expected: no errors.

**Step 3:** Commit:

```bash
git add package.json package-lock.json && \
git commit -m "chore: install portfolio runtime deps"
```

### Task 4: Add AGENTS.md and README

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/AGENTS.md`
- Create: `/Users/pat/Sites/pkthewriter/minimal/CLAUDE.md`
- Create: `/Users/pat/Sites/pkthewriter/minimal/README.md`

**Step 1:** Create `AGENTS.md`:

```markdown
# This is NOT the Next.js you know

This version (Next 16) has breaking changes — APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project

pkthewriter/minimal — Patrick's personal portfolio. Chat-first landing, full-canvas takeovers, content from pkthewriter's Sanity project (`gz4qpupc`).

See `docs/plans/2026-04-16-chat-first-portfolio-v1.md` for the active implementation plan.
See `/Users/pat/.claude/plans/sunny-bubbling-pine.md` for the approved design doc.

## Dev

- `npm run dev` — Turbopack dev server
- `npm run build` — production build (must pass before PRs)
- `npm run typecheck` — `tsc --noEmit`, strict
- `npm run lint`
```

**Step 2:** Create `CLAUDE.md`:

```markdown
@AGENTS.md
```

**Step 3:** Create `README.md`:

```markdown
# pkthewriter — minimal

Patrick's personal portfolio. Built with Next.js 16, Tailwind 4, and Sanity.

## Quickstart

    npm install
    cp .env.example .env.local  # fill in values
    npm run dev

Open http://localhost:3000.

## Content

Edit in the Sanity studio: https://pkthewriter.sanity.studio/

## Deploy

Vercel. Needs the env vars listed in `.env.example`.
```

**Step 4:** Update `package.json` scripts to match PI_site's conventions:

Open `/Users/pat/Sites/pkthewriter/minimal/package.json` and ensure scripts include:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "verify": "npm run typecheck && npm run lint"
}
```

**Step 5:** Commit:

```bash
git add AGENTS.md CLAUDE.md README.md package.json && \
git commit -m "docs: add AGENTS.md, CLAUDE.md, README; align scripts"
```

### Task 5: Define palette tokens + typography

**Files:**
- Modify: `/Users/pat/Sites/pkthewriter/minimal/app/globals.css`
- Modify: `/Users/pat/Sites/pkthewriter/minimal/app/layout.tsx`

**Step 1:** Replace `app/globals.css` with (Tailwind 4 uses `@theme` inline tokens):

```css
@import "tailwindcss";

@theme inline {
  /* Dark (landing) palette */
  --color-bg: #121214;
  --color-surface: #1A1A1D;
  --color-border: #2A2A2E;
  --color-text: #EAE8E3;
  --color-text-muted: #888888;
  --color-accent: #B0A38D;

  /* Light (canvas) palette */
  --color-paper: #F7F5EF;
  --color-paper-surface: #FFFFFF;
  --color-paper-border: #E4E0D6;
  --color-paper-text: #1A1A1D;
  --color-paper-text-muted: #6B6A64;

  --font-ui: var(--font-inter), system-ui, sans-serif;
  --font-voice: var(--font-space-mono), ui-monospace, monospace;
}

:root {
  color-scheme: dark;
}

html, body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-ui);
  min-height: 100vh;
}

body {
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* 14px floor per user preference */
.text-xs {
  font-size: 14px;
  line-height: 1.5;
}
```

**Step 2:** Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Patrick — Writer",
  description: "Copy. Stories. Screenplays. Ask me something.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Step 3:** Replace `app/page.tsx` with a temporary placeholder so dev server works:

```tsx
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="font-[var(--font-voice)] text-[var(--color-accent)]">scaffold online.</p>
    </main>
  );
}
```

**Step 4:** Smoke-test:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npm run dev
```

Use `preview_start` / `preview_snapshot` to confirm "scaffold online." renders in warm gold on dark. Stop the dev server when done.

**Step 5:** Commit:

```bash
git add app/globals.css app/layout.tsx app/page.tsx && \
git commit -m "feat: palette tokens, fonts, layout scaffold"
```

---

## Phase 2 — Sanity: client, types, queries

### Task 6: Env config

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/.env.example`
- Create: `/Users/pat/Sites/pkthewriter/minimal/.env.local`

**Step 1:** Write `.env.example`:

```
# Sanity (pkthewriter project)
NEXT_PUBLIC_SANITY_PROJECT_ID=gz4qpupc
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-01
SANITY_READ_TOKEN=

# Lead capture (Resend)
RESEND_API_KEY=
LEAD_TO_EMAIL=
LEAD_FROM_EMAIL=

# Deploy
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Step 2:** Copy to `.env.local`:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && cp .env.example .env.local
```

Pat: fill `.env.local` with real values (Resend API key, email addresses). Leave committed `.env.example` with blanks.

**Step 3:** Verify `.gitignore` includes `.env*.local`:

```bash
grep -E '\.env' /Users/pat/Sites/pkthewriter/minimal/.gitignore
```

Expected: entries including `.env*.local`. create-next-app sets this.

**Step 4:** Commit:

```bash
git add .env.example && git commit -m "chore: add .env.example"
```

### Task 7: Sanity env reader

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/sanity/env.ts`

**Step 1:** Create `lib/sanity/env.ts`:

```ts
export const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
export const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
export const readToken = process.env.SANITY_READ_TOKEN;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}
```

**Step 2:** Typecheck:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

Expected: no errors.

### Task 8: Sanity client

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/sanity/client.ts`

**Step 1:** Create:

```ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: false,
});

export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: readToken,
  stega: false,
});
```

**Step 2:** Typecheck:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

Expected: no errors.

### Task 9: Sanity types

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/sanity/types.ts`

**Step 1:** Create — these are TS types (separate from studio schema which lives in pkthewriter's Sanity repo):

```ts
import type { PortableTextBlock } from "@portabletext/react";

export type SanityImage = {
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
};

export type SanityFile = {
  asset: { _ref: string; url: string };
};

export type Project = {
  _id: string;
  _type: "project";
  title: string;
  slug: { current: string };
  brand?: string;
  role?: string;
  year?: string;
  type?: string;
  featured?: boolean;
  customLayout?: "standard" | "editorial-multimedia";
  heroImage?: SanityImage;
  mainImage?: SanityImage;
  context?: string;
  conflict?: PortableTextBlock[];
  resolution?: PortableTextBlock[];
  disciplines?: string[];
  deliverables?: string[];
  impact?: string[];
  videoLinks?: Array<{
    title: string;
    url: string;
    platform?: "vimeo" | "youtube";
    thumbnail?: SanityImage;
    description?: string;
    duration?: string;
  }>;
  gallery?: SanityImage[];
  editorialScreenshots?: Array<{
    image: SanityImage;
    label?: string;
    caption?: string;
    layoutType?: "full" | "split" | "grid-3" | "grid-4";
  }>;
  editorialSections?: Array<{
    sectionTitle?: string;
    copyBlock?: PortableTextBlock[];
    video?: { url: string; platform: "vimeo" | "youtube"; thumbnail?: SanityImage };
    images?: Array<{ image: SanityImage; caption?: string }>;
    backgroundColor?: "white" | "lightGray" | "beige" | "blue" | "dark";
  }>;
};

export type Story = {
  _id: string;
  _type: "story";
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: PortableTextBlock[];
  year?: string;
  coverImage?: SanityImage;
  featured?: boolean;
};

export type BlogPost = {
  _id: string;
  _type: "blogPost";
  title: string;
  outlet?: string;
  year?: string;
  url: string;
  excerpt?: string;
  coverImage?: SanityImage;
  featured?: boolean;
};

export type Screenplay = {
  _id: string;
  _type: "screenplay";
  title: string;
  logline?: string;
  genre?: string;
  status?: "spec" | "optioned" | "produced";
  year?: string;
  coverImage?: SanityImage;
  samplePdf?: SanityFile;
  externalUrl?: string;
};

export type AboutPage = {
  _id: string;
  _type: "aboutPage";
  bio?: PortableTextBlock[];
  photo?: SanityImage;
  resumePdf?: SanityFile;
  email?: string;
  socialLinks?: Array<{ label: string; url: string }>;
};

export type SuggestionItem =
  | ({ _kind: "project" } & Pick<Project, "_id" | "title" | "slug" | "year" | "brand" | "type" | "mainImage">)
  | ({ _kind: "story" } & Pick<Story, "_id" | "title" | "slug" | "year" | "coverImage" | "excerpt">)
  | ({ _kind: "blogPost" } & Pick<BlogPost, "_id" | "title" | "outlet" | "year" | "url" | "coverImage" | "excerpt">);

export type SuggestionSet = {
  _id: string;
  _type: "suggestionSet";
  items: SuggestionItem[];
};
```

**Step 2:** Typecheck:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

Expected: no errors.

### Task 10: GROQ queries

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/sanity/queries.ts`

**Step 1:** Create queries (use `coalesce` and null-safe guards — Pat's existing `project` schema has lots of optional fields):

```ts
export const suggestionSetQuery = /* groq */ `
  *[_type == "suggestionSet"][0]{
    _id,
    _type,
    "items": coalesce(items[]->{
      _id,
      _type,
      title,
      "slug": slug,
      year,
      brand,
      outlet,
      url,
      "excerpt": coalesce(excerpt, context),
      "coverImage": coalesce(coverImage, mainImage),
      "_kind": _type
    }, [])
  }
`;

export const featuredCaseStudiesQuery = /* groq */ `
  *[_type == "project" && featured == true] | order(year desc)[0...12]{
    _id,
    title,
    slug,
    brand,
    year,
    "mainImage": mainImage,
    "excerpt": context
  }
`;

export const caseStudyBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    ...,
    "videoLinks": videoLinks[]{
      title, url, platform, description, duration,
      "thumbnail": thumbnail
    },
    "gallery": gallery[]{
      "asset": asset
    }
  }
`;

export const featuredWritingQuery = /* groq */ `
  {
    "stories": *[_type == "story" && featured == true] | order(year desc)[0...12]{
      _id, _type, title, slug, year, excerpt, coverImage
    },
    "blogPosts": *[_type == "blogPost" && featured == true] | order(year desc)[0...12]{
      _id, _type, title, outlet, year, url, excerpt, coverImage
    }
  }
`;

export const storyBySlugQuery = /* groq */ `
  *[_type == "story" && slug.current == $slug][0]
`;

export const screenplaysQuery = /* groq */ `
  *[_type == "screenplay"] | order(year desc){
    _id, title, logline, genre, status, year,
    "coverImage": coverImage,
    "samplePdf": samplePdf{ "asset": asset-> },
    externalUrl
  }
`;

export const aboutPageQuery = /* groq */ `
  *[_type == "aboutPage"][0]{
    ...,
    "resumePdf": resumePdf{ "asset": asset-> }
  }
`;
```

**Step 2:** Typecheck:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

**Step 3:** Commit Sanity wiring:

```bash
git add lib/sanity/ && git commit -m "feat(sanity): env, client, types, queries"
```

### Task 11: Sanity image helper

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/sanity/image.ts`

**Step 1:** Add `@sanity/image-url`:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npm install @sanity/image-url
```

**Step 2:** Create `lib/sanity/image.ts`:

```ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./env";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
```

**Step 3:** Commit:

```bash
git add package.json package-lock.json lib/sanity/image.ts && \
git commit -m "feat(sanity): image-url builder"
```

---

## Phase 3 — Sanity studio schema additions (pkthewriter project)

### Task 12: Document schema additions in this repo

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/docs/sanity-schema-additions.md`

**Why:** The actual schemas live in pkthewriter's Sanity Studio repo (not this Next.js project). This doc tells Pat exactly what to add.

**Step 1:** Write the doc:

````markdown
# Sanity Schema Additions — pkthewriter (`gz4qpupc`)

Add the following document types to your Sanity Studio repo (likely `/Users/pat/Sites/pkthewriter/v3/studio/schemaTypes/` or wherever the deployed studio lives).

## story.ts

```ts
export default {
  name: 'story',
  title: 'Story',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R:any)=>R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R:any)=>R.required() },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
  ],
};
```

## blogPost.ts

```ts
export default {
  name: 'blogPost',
  title: 'Blog Post (external link)',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R:any)=>R.required() },
    { name: 'outlet', title: 'Outlet', type: 'string', description: 'e.g., Substack, Fast Company' },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'url', title: 'URL', type: 'url', validation: (R:any)=>R.required() },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Featured', type: 'boolean', initialValue: false },
  ],
};
```

## screenplay.ts

```ts
export default {
  name: 'screenplay',
  title: 'Screenplay',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R:any)=>R.required() },
    { name: 'logline', title: 'Logline', type: 'text', rows: 3 },
    { name: 'genre', title: 'Genre', type: 'string' },
    { name: 'status', title: 'Status', type: 'string', options: { list: [
      { title: 'Spec', value: 'spec' },
      { title: 'Optioned', value: 'optioned' },
      { title: 'Produced', value: 'produced' },
    ], layout: 'radio' } },
    { name: 'year', title: 'Year', type: 'string' },
    { name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'samplePdf', title: 'Sample PDF (first 10 pages)', type: 'file' },
    { name: 'externalUrl', title: 'External URL (Coverfly/BlackList/IMDb)', type: 'url' },
  ],
};
```

## aboutPage.ts (singleton)

```ts
export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'bio', title: 'Bio', type: 'array', of: [{ type: 'block' }] },
    { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
    { name: 'resumePdf', title: 'Resume PDF', type: 'file' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'socialLinks', title: 'Social Links', type: 'array', of: [{
      type: 'object',
      fields: [
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'url', title: 'URL', type: 'url' },
      ],
    }] },
  ],
};
```

Register as singleton in `structure.ts`:

```ts
S.listItem().title('About Page').id('aboutPage').child(
  S.document().schemaType('aboutPage').documentId('aboutPage')
)
```

## suggestionSet.ts (singleton)

```ts
export default {
  name: 'suggestionSet',
  title: 'Featured Suggestions (landing)',
  type: 'document',
  fields: [
    { name: 'items', title: 'Featured (3 items)', type: 'array',
      of: [{ type: 'reference', to: [
        { type: 'project' },
        { type: 'story' },
        { type: 'blogPost' },
      ] }],
      validation: (R:any)=>R.required().length(3),
    },
  ],
};
```

Register as singleton. Fix documentId: `suggestionSet`.

## Register all in index.ts

```ts
import project from './project';
import author from './author';
import story from './story';
import blogPost from './blogPost';
import screenplay from './screenplay';
import aboutPage from './aboutPage';
import suggestionSet from './suggestionSet';

export const schemaTypes = [project, author, story, blogPost, screenplay, aboutPage, suggestionSet];
```

## After deploying

1. Deploy the studio: `cd studio && npm run deploy`
2. Create at least: 1 `aboutPage`, 1 `suggestionSet` with 3 references, 1 `story`, 1 `blogPost`, 1 `screenplay`.
3. Mark 2+ existing `project` docs as `featured: true`.
````

**Step 2:** Commit:

```bash
git add docs/sanity-schema-additions.md && \
git commit -m "docs: sanity schema additions to add to pkthewriter studio"
```

---

## Phase 4 — Landing page

### Task 13: Prompt chip registry

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/chips.ts`

**Step 1:** Create chip definitions:

```ts
export type ChipId = "case-study" | "writing" | "resume" | "pi" | "screenwriter";

export type Chip = {
  id: ChipId;
  label: string;
  href?: string;
  kind: "internal" | "external" | "card";
};

export const CHIPS: Chip[] = [
  { id: "case-study", label: "Show me a case study", kind: "internal", href: "/work" },
  { id: "writing", label: "Read my writing", kind: "internal", href: "/writing" },
  { id: "resume", label: "Get my resume", kind: "internal", href: "/about" },
  { id: "pi", label: "Looking for Protagonist Ink?", kind: "card" },
  { id: "screenwriter", label: "Aren't you a screenwriter?", kind: "internal", href: "/screenwriting" },
];
```

### Task 14: Wordmark

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/landing/Wordmark.tsx`

```tsx
export function Wordmark() {
  return (
    <div className="fixed top-6 left-6 z-10">
      <span className="font-[var(--font-voice)] text-sm text-[var(--color-text-muted)] tracking-wide">
        patrick [lastname]
      </span>
    </div>
  );
}
```

(Note: placeholder `[lastname]`. Pat will replace.)

### Task 15: ContactLink (top-right)

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/landing/ContactLink.tsx`

```tsx
export function ContactLink({ email }: { email?: string }) {
  if (!email) return null;
  return (
    <a
      href={`mailto:${email}`}
      className="fixed top-6 right-6 z-10 font-[var(--font-voice)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
    >
      [@] contact
    </a>
  );
}
```

### Task 16: PromptChips

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/landing/PromptChips.tsx`

```tsx
"use client";

import Link from "next/link";
import { CHIPS } from "@/lib/chips";

export function PromptChips({ onCardChip }: { onCardChip?: (id: "pi") => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-[640px] mx-auto mt-4">
      {CHIPS.map((chip) => {
        if (chip.kind === "card") {
          return (
            <button
              key={chip.id}
              onClick={() => onCardChip?.("pi")}
              className="font-[var(--font-voice)] text-sm px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
            >
              {chip.label}
            </button>
          );
        }
        return (
          <Link
            key={chip.id}
            href={chip.href!}
            className="font-[var(--font-voice)] text-sm px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
```

### Task 17: SuggestionsList

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/landing/SuggestionsList.tsx`

```tsx
import Link from "next/link";
import type { SuggestionItem } from "@/lib/sanity/types";
import { FileText, BookOpen, Link2 } from "lucide-react";

function iconFor(kind: SuggestionItem["_kind"]) {
  if (kind === "project") return <FileText className="w-5 h-5 text-[var(--color-accent)]" />;
  if (kind === "story") return <BookOpen className="w-5 h-5 text-[var(--color-accent)]" />;
  return <Link2 className="w-5 h-5 text-[var(--color-accent)]" />;
}

function metaFor(item: SuggestionItem): string {
  if (item._kind === "project") return `CASE STUDY${item.year ? ` • ${item.year}` : ""}`;
  if (item._kind === "story") return `STORY${item.year ? ` • ${item.year}` : ""}`;
  return `BLOG${item.outlet ? ` • ${item.outlet.toUpperCase()}` : ""}`;
}

function hrefFor(item: SuggestionItem): string {
  if (item._kind === "project") return `/work/${item.slug.current}`;
  if (item._kind === "story") return `/story/${item.slug.current}`;
  return item.url;
}

export function SuggestionsList({ items }: { items: SuggestionItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="max-w-[640px] mx-auto mt-10 pt-6 border-t border-[var(--color-border)]">
      <div className="font-[var(--font-voice)] text-sm text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4">
        suggestions
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {items.map((item) => {
          const href = hrefFor(item);
          const external = item._kind === "blogPost";
          const classes = "flex items-start gap-4 py-5 group";
          const inner = (
            <>
              <div className="pt-0.5 shrink-0">{iconFor(item._kind)}</div>
              <div className="min-w-0">
                <div className="text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {item.title}
                </div>
                <div className="font-[var(--font-voice)] text-sm text-[var(--color-text-muted)] mt-1 tracking-wide">
                  {metaFor(item)}
                </div>
              </div>
            </>
          );
          return (
            <li key={item._id}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
                  {inner}
                </a>
              ) : (
                <Link href={href} className={classes}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

### Task 18: ChatBar

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/landing/ChatBar.tsx`

```tsx
"use client";

import { useState, useId } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ChatBar({
  onSubmit,
}: {
  onSubmit: (message: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [reply, setReply] = useState<string | null>(null);
  const honeypotId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || status === "sending") return;
    const msg = value.trim();
    setStatus("sending");
    setValue("");
    setReply("I wrote that down — you'll hear from me. Meanwhile, here's something close:");
    try {
      await onSubmit(msg);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[640px] mx-auto">
      <label htmlFor="chat" className="sr-only">Ask me something</label>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        id={honeypotId}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-0 h-0 opacity-0"
        aria-hidden="true"
      />
      <div className="flex gap-2 items-stretch bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-accent)] transition-colors">
        <input
          id="chat"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="So — what brings you here?"
          className="flex-1 bg-transparent px-5 py-4 outline-none font-[var(--font-voice)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
        />
        <button
          type="submit"
          disabled={!value.trim() || status === "sending"}
          className="px-4 text-[var(--color-accent)] font-[var(--font-voice)] disabled:opacity-40"
        >
          →
        </button>
      </div>
      {reply && (
        <div className="mt-4 font-[var(--font-voice)] text-sm text-[var(--color-text-muted)]">
          {reply}{" "}
          <a href="/work" className="text-[var(--color-accent)] hover:underline">show me a case study →</a>
          {status === "sent" && <span className="ml-2 text-[var(--color-accent)]">•</span>}
        </div>
      )}
    </form>
  );
}
```

### Task 19: Hero intro (one voice-beat above ChatBar)

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/landing/HeroIntro.tsx`

```tsx
export function HeroIntro() {
  return (
    <h1 className="font-[var(--font-voice)] text-[var(--color-text)] text-center text-xl sm:text-2xl mb-6 leading-snug">
      Hi. I'm Patrick.<br />
      <span className="text-[var(--color-text-muted)]">I write things for a living. Ask me something.</span>
    </h1>
  );
}
```

### Task 20: Assemble landing page

**Files:**
- Modify: `/Users/pat/Sites/pkthewriter/minimal/app/page.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/landing-client.tsx`

**Step 1:** Create `app/landing-client.tsx` (client wrapper, since ChatBar + PromptChips need state):

```tsx
"use client";

import { useState } from "react";
import { ChatBar } from "@/components/landing/ChatBar";
import { PromptChips } from "@/components/landing/PromptChips";
import { PICard } from "@/components/canvas/PICard";

export function LandingClient() {
  const [piOpen, setPiOpen] = useState(false);

  async function handleMessage(message: string) {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: "free-text" }),
    });
  }

  return (
    <>
      <ChatBar onSubmit={handleMessage} />
      <PromptChips onCardChip={() => setPiOpen(true)} />
      {piOpen && <PICard onClose={() => setPiOpen(false)} />}
    </>
  );
}
```

**Step 2:** Rewrite `app/page.tsx` as a server component that fetches the suggestion set + about email:

```tsx
import { sanityClient } from "@/lib/sanity/client";
import { suggestionSetQuery, aboutPageQuery } from "@/lib/sanity/queries";
import type { SuggestionSet, AboutPage } from "@/lib/sanity/types";
import { Wordmark } from "@/components/landing/Wordmark";
import { ContactLink } from "@/components/landing/ContactLink";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { SuggestionsList } from "@/components/landing/SuggestionsList";
import { LandingClient } from "./landing-client";

export const revalidate = 60;

export default async function Page() {
  const [suggestionSet, about] = await Promise.all([
    sanityClient.fetch<SuggestionSet | null>(suggestionSetQuery),
    sanityClient.fetch<AboutPage | null>(aboutPageQuery),
  ]);

  return (
    <>
      <Wordmark />
      <ContactLink email={about?.email} />
      <main className="min-h-screen flex flex-col justify-center items-center px-6 py-24">
        <div className="w-full">
          <HeroIntro />
          <LandingClient />
          <SuggestionsList items={suggestionSet?.items ?? []} />
        </div>
      </main>
    </>
  );
}
```

**Step 3:** Create placeholder `PICard` so the client compiles (we'll flesh it out in a later task):

```tsx
// components/canvas/PICard.tsx
"use client";
export function PICard({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md mx-auto p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-center"
      >
        <p className="font-[var(--font-voice)] text-[var(--color-text)] mb-6">
          Looking for a team instead of just me?
          <br />
          That&apos;s Protagonist Ink.
        </p>
        <a
          href="https://www.protagonist.ink"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-[var(--font-voice)] text-sm text-[var(--color-accent)] border border-[var(--color-accent)] px-4 py-2 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors"
        >
          open protagonist.ink →
        </a>
      </div>
    </div>
  );
}
```

**Step 4:** Verify typecheck + dev:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

Then `preview_start` in the project, `preview_snapshot` to confirm layout. Suggestions list will be empty if Sanity isn't seeded — that's fine.

**Step 5:** Commit:

```bash
git add lib/chips.ts components/ app/page.tsx app/landing-client.tsx && \
git commit -m "feat: landing page (hero, chat bar, chips, suggestions, PI card)"
```

---

## Phase 5 — Canvas takeover + routes

### Task 21: CanvasTakeover frame

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/canvas/CanvasTakeover.tsx`

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function CanvasTakeover({
  children,
  backHref = "/",
}: {
  children: React.ReactNode;
  backHref?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-h-screen bg-[var(--color-paper)] text-[var(--color-paper-text)]"
      style={{ colorScheme: "light" }}
    >
      <div className="sticky top-0 bg-[var(--color-paper)]/90 backdrop-blur border-b border-[var(--color-paper-border)] z-20">
        <div className="max-w-[820px] mx-auto px-6 py-4">
          <Link
            href={backHref}
            className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] hover:text-[var(--color-paper-text)] transition-colors"
          >
            ← back
          </Link>
        </div>
      </div>
      <div className="max-w-[820px] mx-auto px-6 py-12">{children}</div>
    </motion.div>
  );
}
```

### Task 22: /work — case study index (grid)

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/work/page.tsx`

```tsx
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { featuredCaseStudiesQuery } from "@/lib/sanity/queries";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";

export const revalidate = 60;

export const metadata = { title: "Case studies — Patrick" };

export default async function WorkIndex() {
  const projects = await sanityClient.fetch<Project[]>(featuredCaseStudiesQuery);

  return (
    <CanvasTakeover>
      <h1 className="font-[var(--font-voice)] text-3xl mb-8">Case studies</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((p) => (
          <li key={p._id}>
            <Link href={`/work/${p.slug.current}`} className="group block">
              {p.mainImage && (
                <div className="aspect-[4/3] bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)] overflow-hidden">
                  <img
                    src={urlForImage(p.mainImage).width(800).url()}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}
              <div className="mt-3">
                <div className="font-medium">{p.title}</div>
                <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)]">
                  {[p.brand, p.year].filter(Boolean).join(" • ")}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {projects.length === 0 && (
        <p className="font-[var(--font-voice)] text-[var(--color-paper-text-muted)]">
          No featured case studies yet. Mark some `project` docs as `featured: true` in Sanity.
        </p>
      )}
    </CanvasTakeover>
  );
}
```

### Task 23: /work/[slug] — case study detail

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/work/[slug]/page.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/canvas/CaseStudyView.tsx`

**Step 1:** Create `CaseStudyView.tsx`:

```tsx
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import type { Project } from "@/lib/sanity/types";

export function CaseStudyView({ project: p }: { project: Project }) {
  return (
    <article>
      <header className="mb-10">
        <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
          {[p.brand, p.year, p.type].filter(Boolean).join(" • ")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-medium mt-3">{p.title}</h1>
        {p.context && <p className="text-lg mt-4 text-[var(--color-paper-text-muted)]">{p.context}</p>}
      </header>

      {p.heroImage && (
        <div className="mb-10">
          <img
            src={urlForImage(p.heroImage).width(1600).url()}
            alt={p.title}
            className="w-full rounded border border-[var(--color-paper-border)]"
          />
        </div>
      )}

      {p.conflict && (
        <section className="mb-10 prose prose-neutral max-w-none">
          <h2 className="font-[var(--font-voice)] text-sm uppercase tracking-[0.2em] text-[var(--color-paper-text-muted)]">
            Conflict
          </h2>
          <PortableText value={p.conflict} />
        </section>
      )}

      {p.resolution && (
        <section className="mb-10 prose prose-neutral max-w-none">
          <h2 className="font-[var(--font-voice)] text-sm uppercase tracking-[0.2em] text-[var(--color-paper-text-muted)]">
            Resolution
          </h2>
          <PortableText value={p.resolution} />
        </section>
      )}

      {(p.disciplines?.length || p.deliverables?.length || p.impact?.length) && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-[var(--color-paper-border)]">
          {p.disciplines?.length ? (
            <MetaCol title="Disciplines" items={p.disciplines} />
          ) : null}
          {p.deliverables?.length ? (
            <MetaCol title="Deliverables" items={p.deliverables} />
          ) : null}
          {p.impact?.length ? (
            <MetaCol title="Impact" items={p.impact} />
          ) : null}
        </section>
      )}

      {p.gallery?.length ? (
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {p.gallery.map((img, i) => (
            <img
              key={i}
              src={urlForImage(img).width(1200).url()}
              alt=""
              className="w-full rounded border border-[var(--color-paper-border)]"
            />
          ))}
        </section>
      ) : null}
    </article>
  );
}

function MetaCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-[var(--font-voice)] text-sm uppercase tracking-[0.2em] text-[var(--color-paper-text-muted)] mb-2">
        {title}
      </div>
      <ul className="text-sm space-y-1">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 2:** Create `app/work/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { caseStudyBySlugQuery } from "@/lib/sanity/queries";
import type { Project } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { CaseStudyView } from "@/components/canvas/CaseStudyView";

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityClient.fetch<Project | null>(caseStudyBySlugQuery, { slug });
  if (!project) notFound();
  return (
    <CanvasTakeover backHref="/work">
      <CaseStudyView project={project} />
    </CanvasTakeover>
  );
}
```

**Step 3:** Typecheck + commit:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit && \
git add app/work/ components/canvas/ && \
git commit -m "feat: case study index + detail (canvas takeover)"
```

### Task 24: /writing (stories + blog grid) + /story/[slug]

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/writing/page.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/story/[slug]/page.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/canvas/StoryView.tsx`

**Step 1:** `/writing/page.tsx`:

```tsx
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { featuredWritingQuery } from "@/lib/sanity/queries";
import type { Story, BlogPost } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";

type Data = { stories: Story[]; blogPosts: BlogPost[] };

export const revalidate = 60;
export const metadata = { title: "Writing — Patrick" };

export default async function WritingIndex() {
  const data = await sanityClient.fetch<Data>(featuredWritingQuery);
  const items: Array<
    | ({ kind: "story" } & Story)
    | ({ kind: "blogPost" } & BlogPost)
  > = [
    ...data.stories.map((s) => ({ ...s, kind: "story" as const })),
    ...data.blogPosts.map((b) => ({ ...b, kind: "blogPost" as const })),
  ].sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));

  return (
    <CanvasTakeover>
      <h1 className="font-[var(--font-voice)] text-3xl mb-8">Writing</h1>
      <ul className="divide-y divide-[var(--color-paper-border)]">
        {items.map((it) => {
          const meta =
            it.kind === "blogPost"
              ? `BLOG${it.outlet ? ` • ${it.outlet}` : ""}${it.year ? ` • ${it.year}` : ""}`
              : `STORY${it.year ? ` • ${it.year}` : ""}`;
          if (it.kind === "blogPost") {
            return (
              <li key={it._id} className="py-5">
                <a href={it.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="group-hover:text-[var(--color-paper-text-muted)] transition-colors text-lg">
                    {it.title} <span className="text-[var(--color-paper-text-muted)]">↗</span>
                  </div>
                  <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] mt-1 uppercase tracking-[0.2em]">
                    {meta}
                  </div>
                  {it.excerpt && <p className="mt-2 text-[var(--color-paper-text-muted)]">{it.excerpt}</p>}
                </a>
              </li>
            );
          }
          return (
            <li key={it._id} className="py-5">
              <Link href={`/story/${it.slug.current}`} className="block group">
                <div className="group-hover:text-[var(--color-paper-text-muted)] transition-colors text-lg">
                  {it.title}
                </div>
                <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] mt-1 uppercase tracking-[0.2em]">
                  {meta}
                </div>
                {it.excerpt && <p className="mt-2 text-[var(--color-paper-text-muted)]">{it.excerpt}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
      {items.length === 0 && (
        <p className="font-[var(--font-voice)] text-[var(--color-paper-text-muted)]">
          No featured writing yet. Mark `story` or `blogPost` docs as `featured: true` in Sanity.
        </p>
      )}
    </CanvasTakeover>
  );
}
```

**Step 2:** `StoryView.tsx`:

```tsx
import { PortableText } from "@portabletext/react";
import type { Story } from "@/lib/sanity/types";

export function StoryView({ story }: { story: Story }) {
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em] not-prose">
        {story.year ? `STORY • ${story.year}` : "STORY"}
      </div>
      <h1 className="text-3xl sm:text-4xl font-medium mt-2">{story.title}</h1>
      {story.excerpt && (
        <p className="text-lg text-[var(--color-paper-text-muted)] not-prose mt-4 mb-8">{story.excerpt}</p>
      )}
      {story.body && <PortableText value={story.body} />}
    </article>
  );
}
```

**Step 3:** `app/story/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { storyBySlugQuery } from "@/lib/sanity/queries";
import type { Story } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { StoryView } from "@/components/canvas/StoryView";

export const revalidate = 60;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await sanityClient.fetch<Story | null>(storyBySlugQuery, { slug });
  if (!story) notFound();
  return (
    <CanvasTakeover backHref="/writing">
      <StoryView story={story} />
    </CanvasTakeover>
  );
}
```

**Step 4:** Typecheck + commit:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit && \
git add app/writing/ app/story/ components/canvas/StoryView.tsx && \
git commit -m "feat: writing index + story detail"
```

### Task 25: /about (bio + resume download)

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/about/page.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/canvas/AboutView.tsx`

**Step 1:** `AboutView.tsx`:

```tsx
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { AboutPage } from "@/lib/sanity/types";

export function AboutView({ about }: { about: AboutPage }) {
  const resumeUrl = about.resumePdf?.asset?.url;
  return (
    <article className="prose prose-neutral max-w-none">
      <div className="not-prose grid sm:grid-cols-[1fr_auto] gap-8 items-start mb-10">
        <div>
          <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
            about
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mt-2 mb-6">Patrick.</h1>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-[var(--font-voice)] text-sm border border-[var(--color-paper-text)] text-[var(--color-paper-text)] px-4 py-2 rounded-full hover:bg-[var(--color-paper-text)] hover:text-[var(--color-paper)] transition-colors"
            >
              download resume ↓
            </a>
          )}
        </div>
        {about.photo && (
          <img
            src={urlForImage(about.photo).width(320).url()}
            alt="Patrick"
            className="w-40 h-40 object-cover rounded-full border border-[var(--color-paper-border)]"
          />
        )}
      </div>
      {about.bio && <PortableText value={about.bio} />}
      {about.socialLinks?.length ? (
        <section className="not-prose mt-10 pt-8 border-t border-[var(--color-paper-border)]">
          <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em] mb-3">
            elsewhere
          </div>
          <ul className="flex flex-wrap gap-4">
            {about.socialLinks.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text)] hover:opacity-70"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
```

**Step 2:** `app/about/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { AboutView } from "@/components/canvas/AboutView";

export const revalidate = 60;
export const metadata = { title: "About — Patrick" };

export default async function Page() {
  const about = await sanityClient.fetch<AboutPage | null>(aboutPageQuery);
  if (!about) notFound();
  return (
    <CanvasTakeover>
      <AboutView about={about} />
    </CanvasTakeover>
  );
}
```

**Step 3:** Typecheck + commit.

### Task 26: /screenwriting (gallery)

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/screenwriting/page.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/canvas/ScreenplayGallery.tsx`
- Create: `/Users/pat/Sites/pkthewriter/minimal/components/canvas/RequestScriptForm.tsx`

**Step 1:** `ScreenplayGallery.tsx`:

```tsx
import { urlForImage } from "@/lib/sanity/image";
import type { Screenplay } from "@/lib/sanity/types";
import { RequestScriptForm } from "./RequestScriptForm";

export function ScreenplayGallery({ screenplays }: { screenplays: Screenplay[] }) {
  return (
    <div>
      <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
        aren&apos;t you a screenwriter?
      </div>
      <h1 className="text-3xl sm:text-4xl font-medium mt-2 mb-2">Screenplays.</h1>
      <p className="text-[var(--color-paper-text-muted)] mb-10 max-w-prose">
        Sample pages are downloadable. Full scripts on request.
      </p>
      <ul className="space-y-12">
        {screenplays.map((s) => {
          const meta = [s.genre, s.status?.toUpperCase(), s.year].filter(Boolean).join(" • ");
          const sampleUrl = s.samplePdf?.asset?.url;
          return (
            <li key={s._id} className="grid sm:grid-cols-[200px_1fr] gap-6 items-start">
              {s.coverImage ? (
                <img
                  src={urlForImage(s.coverImage).width(400).url()}
                  alt={s.title}
                  className="w-full aspect-[2/3] object-cover border border-[var(--color-paper-border)]"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)]" />
              )}
              <div>
                <div className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
                  {meta}
                </div>
                <h2 className="text-2xl font-medium mt-1">{s.title}</h2>
                {s.logline && <p className="mt-3 text-[var(--color-paper-text-muted)] max-w-prose">{s.logline}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  {sampleUrl && (
                    <a
                      href={sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[var(--font-voice)] text-sm border border-[var(--color-paper-text)] px-3 py-1.5 rounded-full hover:bg-[var(--color-paper-text)] hover:text-[var(--color-paper)] transition-colors"
                    >
                      download sample ↓
                    </a>
                  )}
                  <RequestScriptForm title={s.title} />
                  {s.externalUrl && (
                    <a
                      href={s.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)] hover:text-[var(--color-paper-text)]"
                    >
                      view on {hostnameOf(s.externalUrl)} ↗
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {screenplays.length === 0 && (
        <p className="font-[var(--font-voice)] text-[var(--color-paper-text-muted)]">No screenplays published yet.</p>
      )}
    </div>
  );
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "site";
  }
}
```

**Step 2:** `RequestScriptForm.tsx`:

```tsx
"use client";

import { useState } from "react";

export function RequestScriptForm({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "screenplay-request",
          message: `Script request: "${title}" from ${email}`,
        }),
      });
      if (!r.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-[var(--font-voice)] text-sm border border-[var(--color-paper-border)] text-[var(--color-paper-text)] px-3 py-1.5 rounded-full hover:border-[var(--color-paper-text)] transition-colors"
      >
        request full script →
      </button>
    );
  }

  if (status === "sent") {
    return <span className="font-[var(--font-voice)] text-sm text-[var(--color-paper-text-muted)]">thanks — you&apos;ll hear from me.</span>;
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input
        type="email"
        required
        placeholder="your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-[var(--font-voice)] text-sm border border-[var(--color-paper-border)] bg-transparent px-3 py-1.5 rounded-full outline-none focus:border-[var(--color-paper-text)]"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="font-[var(--font-voice)] text-sm border border-[var(--color-paper-text)] px-3 py-1.5 rounded-full hover:bg-[var(--color-paper-text)] hover:text-[var(--color-paper)] transition-colors disabled:opacity-50"
      >
        send →
      </button>
    </form>
  );
}
```

**Step 3:** `app/screenwriting/page.tsx`:

```tsx
import { sanityClient } from "@/lib/sanity/client";
import { screenplaysQuery } from "@/lib/sanity/queries";
import type { Screenplay } from "@/lib/sanity/types";
import { CanvasTakeover } from "@/components/canvas/CanvasTakeover";
import { ScreenplayGallery } from "@/components/canvas/ScreenplayGallery";

export const revalidate = 60;
export const metadata = { title: "Screenplays — Patrick" };

export default async function Page() {
  const screenplays = await sanityClient.fetch<Screenplay[]>(screenplaysQuery);
  return (
    <CanvasTakeover>
      <ScreenplayGallery screenplays={screenplays} />
    </CanvasTakeover>
  );
}
```

**Step 4:** Typecheck + commit:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit && \
git add app/about/ app/screenwriting/ components/canvas/ && \
git commit -m "feat: about page + screenwriting gallery + request-script form"
```

---

## Phase 6 — Free-text lead capture (/api/lead)

### Task 27: Resend helper

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/resend.ts`

```ts
import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  _resend = new Resend(key);
  return _resend;
}

export function leadConfig() {
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!to || !from) {
    throw new Error("Missing LEAD_TO_EMAIL or LEAD_FROM_EMAIL");
  }
  return { to, from };
}
```

### Task 28: Per-IP throttle

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/throttle.ts`

```ts
const bucket = new Map<string, number>();

export function allow(ip: string, minIntervalMs = 5000): boolean {
  const now = Date.now();
  const last = bucket.get(ip) ?? 0;
  if (now - last < minIntervalMs) return false;
  bucket.set(ip, now);
  // Simple GC
  if (bucket.size > 1000) {
    for (const [k, v] of bucket) {
      if (now - v > 60_000) bucket.delete(k);
    }
  }
  return true;
}
```

### Task 29: /api/lead — write failing test first

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/lead-validation.ts`
- Create: `/Users/pat/Sites/pkthewriter/minimal/lib/lead-validation.test.ts`

**Step 1:** Add vitest:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npm install -D vitest @vitest/ui
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 2:** Write the failing test `lead-validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateLeadPayload } from "./lead-validation";

describe("validateLeadPayload", () => {
  it("accepts a well-formed message", () => {
    expect(validateLeadPayload({ message: "hello there", context: "free-text" }).ok).toBe(true);
  });

  it("rejects missing message", () => {
    expect(validateLeadPayload({ context: "free-text" }).ok).toBe(false);
  });

  it("rejects messages longer than 4000 chars", () => {
    expect(validateLeadPayload({ message: "x".repeat(4001) }).ok).toBe(false);
  });

  it("rejects honeypot-tripped requests", () => {
    expect(validateLeadPayload({ message: "hi", website: "spam" }).ok).toBe(false);
  });

  it("accepts unknown context as undefined", () => {
    expect(validateLeadPayload({ message: "hi" }).ok).toBe(true);
  });
});
```

**Step 3:** Run test — should fail (module missing):

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx vitest run lib/lead-validation.test.ts
```

Expected: FAIL with "Cannot find module".

**Step 4:** Implement `lead-validation.ts`:

```ts
export type LeadPayload = {
  message?: unknown;
  context?: unknown;
  website?: unknown; // honeypot
};

export type ValidatedLead =
  | { ok: true; message: string; context?: "free-text" | "screenplay-request" | "contact" }
  | { ok: false; error: string };

const MAX = 4000;
const ALLOWED_CONTEXTS = new Set(["free-text", "screenplay-request", "contact"]);

export function validateLeadPayload(raw: LeadPayload): ValidatedLead {
  if (raw.website) return { ok: false, error: "honeypot" };
  if (typeof raw.message !== "string") return { ok: false, error: "message-required" };
  const msg = raw.message.trim();
  if (!msg) return { ok: false, error: "message-required" };
  if (msg.length > MAX) return { ok: false, error: "message-too-long" };
  let context: ValidatedLead extends { ok: true } ? never : undefined;
  context = undefined as any;
  const ctx =
    typeof raw.context === "string" && ALLOWED_CONTEXTS.has(raw.context)
      ? (raw.context as "free-text" | "screenplay-request" | "contact")
      : undefined;
  return { ok: true, message: msg, context: ctx };
}
```

**Step 5:** Run tests — should pass:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx vitest run lib/lead-validation.test.ts
```

Expected: 5 passing.

**Step 6:** Commit:

```bash
git add lib/resend.ts lib/throttle.ts lib/lead-validation.ts lib/lead-validation.test.ts package.json package-lock.json && \
git commit -m "feat(lead): validation, throttle, resend helper + tests"
```

### Task 30: /api/lead route

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/api/lead/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { validateLeadPayload } from "@/lib/lead-validation";
import { allow } from "@/lib/throttle";
import { getResend, leadConfig } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!allow(ip)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const parsed = validateLeadPayload(raw as any);
  if (!parsed.ok) {
    // honeypot → quietly 200 so bots don't learn
    if (parsed.error === "honeypot") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const { to, from } = leadConfig();
    const ua = req.headers.get("user-agent") ?? "unknown";
    const subject = `[pk] ${parsed.context ?? "lead"} — ${parsed.message.slice(0, 60)}`;
    await getResend().emails.send({
      from,
      to,
      subject,
      text: `From: ${ip}\nUA: ${ua}\nContext: ${parsed.context ?? "free-text"}\n\n${parsed.message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/lead] send failed", err);
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 500 });
  }
}
```

**Step 2:** Verify route compiles via typecheck:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npx tsc --noEmit
```

**Step 3:** Manual dev smoke test:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npm run dev
```

In another terminal:

```bash
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"message":"test message from curl","context":"free-text"}'
```

Expected: `{"ok":true}` and an email to `LEAD_TO_EMAIL` (requires Resend API key + verified sender in `.env.local`).

**Step 4:** Commit:

```bash
git add app/api/lead/ && git commit -m "feat(lead): POST /api/lead with Resend + throttle"
```

---

## Phase 7 — not-found + metadata + OG

### Task 31: not-found page

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/not-found.tsx`

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-[var(--font-voice)] text-2xl text-[var(--color-accent)] mb-2">404</h1>
        <p className="font-[var(--font-voice)] text-[var(--color-text-muted)] mb-6">
          That one&apos;s on the cutting room floor.
        </p>
        <Link href="/" className="font-[var(--font-voice)] text-sm border border-[var(--color-border)] px-4 py-2 rounded-full hover:border-[var(--color-accent)] transition-colors">
          ← back home
        </Link>
      </div>
    </main>
  );
}
```

### Task 32: robots + sitemap

**Files:**
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/robots.ts`
- Create: `/Users/pat/Sites/pkthewriter/minimal/app/sitemap.ts`

**Step 1:** `robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
```

**Step 2:** `sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [projects, stories] = await Promise.all([
    sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug }`
    ),
    sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "story" && defined(slug.current)]{ "slug": slug }`
    ),
  ]);
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/work", "/writing", "/about", "/screenwriting"].map(
    (r) => ({ url: `${base}${r}`, lastModified: new Date() })
  );
  const workRoutes = projects.map((p) => ({ url: `${base}/work/${p.slug.current}`, lastModified: new Date() }));
  const storyRoutes = stories.map((s) => ({ url: `${base}/story/${s.slug.current}`, lastModified: new Date() }));
  return [...staticRoutes, ...workRoutes, ...storyRoutes];
}
```

### Task 33: Richer root metadata + OG image

**Files:**
- Modify: `/Users/pat/Sites/pkthewriter/minimal/app/layout.tsx`

Replace `metadata`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Patrick — Writer", template: "%s — Patrick" },
  description: "Copy. Stories. Screenplays. Ask me something.",
  openGraph: {
    title: "Patrick — Writer",
    description: "Copy. Stories. Screenplays. Ask me something.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
```

Commit:

```bash
git add app/not-found.tsx app/robots.ts app/sitemap.ts app/layout.tsx && \
git commit -m "feat: 404, robots, sitemap, richer metadata"
```

---

## Phase 8 — Verification

### Task 34: Full verification

**Step 1:** Typecheck:

```bash
cd /Users/pat/Sites/pkthewriter/minimal && npm run typecheck
```

Expected: 0 errors.

**Step 2:** Lint:

```bash
npm run lint
```

Expected: 0 errors (warnings acceptable).

**Step 3:** Build:

```bash
npm run build
```

Expected: clean build, all routes listed in output.

**Step 4:** Unit tests:

```bash
npm test
```

Expected: all pass.

**Step 5:** Dev server + preview checks (requires `.env.local` with real Sanity + at least 1 `aboutPage` doc created):

```bash
npm run dev
```

Use preview tools:

- `preview_start` → open http://localhost:3000
- `preview_snapshot` → confirm: Wordmark (top-left), ContactLink (top-right if aboutPage.email set), HeroIntro, ChatBar, 5 chips, SuggestionsList (3 items if suggestionSet seeded).
- `preview_click` on each chip → confirm correct route:
  - "Show me a case study" → `/work` list loads
  - "Read my writing" → `/writing` list loads
  - "Get my resume" → `/about` loads with resume download button if PDF set
  - "Looking for Protagonist Ink?" → PI card modal
  - "Aren't you a screenwriter?" → `/screenwriting` gallery loads
- `preview_fill` chat input with "do you do CPG?" → submit → confirm inline reply appears + network log shows POST /api/lead 200.
- `preview_resize` to 375×812 → `preview_snapshot` → confirm mobile stack, chips wrap, touch-sized buttons.
- `preview_console_logs` → no errors.
- `preview_network` → all Sanity + API requests 200 (or 304 from CDN).

**Step 6:** Capture evidence:

- `preview_screenshot` landing (desktop)
- `preview_screenshot` landing (mobile via resize)
- `preview_screenshot` case study takeover
- `preview_screenshot` about page

**Step 7:** If anything fails, diagnose in source, fix, re-run verification from the failing step.

### Task 35: Final commit + tag

```bash
cd /Users/pat/Sites/pkthewriter/minimal && \
git log --oneline -20
```

Confirm the commit log reads as a clean sequence. Then tag V1:

```bash
git tag -a v0.1.0 -m "V1: chat-first portfolio landing + takeovers"
```

---

## Post-V1 — deferred

- LLM-powered chat (upgrade path).
- Smarter chip routing in FreeTextReply (LLM or keyword match instead of hard-coded "Show me a case study").
- Suggestion rotation.
- Sanity `lead` type for DB storage.
- Vercel deploy, domain setup, DNS.

---

## Quick reference — skills to reach for mid-implementation

- `superpowers:systematic-debugging` — when a route returns unexpected 404/500.
- `superpowers:test-driven-development` — when adding any non-trivial logic (e.g., smarter chip routing).
- `superpowers:verification-before-completion` — before marking each task complete, confirm it actually works end-to-end.
- `superpowers:requesting-code-review` — after Phase 5 and again after Phase 8.
