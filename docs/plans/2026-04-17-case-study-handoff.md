# Case-study handoff implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an end-of-case-study handoff block (curated "Next —" + mono escape-hatch row) that mirrors the landing's "feature + alts" grammar, and wire `/?ask=1` to auto-focus the landing prompt.

**Architecture:** Pure next-piece resolver in `lib/case-study-next.ts` (tested), presentational `CaseStudyHandoff` component rendered at the bottom of `CaseStudyView`. Landing-side focus is a new `autoFocus` prop on `ChatBar` driven by a `useEffect` in `LandingClient` that reads `?ask=1` from the URL and scrubs it via `history.replaceState`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, Vitest.

**Design source:** [docs/plans/2026-04-17-case-study-handoff-design.md](docs/plans/2026-04-17-case-study-handoff-design.md).

---

### Task 1: Next-piece resolver (TDD)

**Files:**
- Test: `lib/case-study-next.test.ts`
- Create: `lib/case-study-next.ts`

**Step 1: Write the failing tests**

```ts
// lib/case-study-next.test.ts
import { describe, it, expect } from "vitest";
import { nextCaseStudy } from "./case-study-next";

describe("nextCaseStudy", () => {
  it("verizon → Apple", () => {
    expect(nextCaseStudy("verizon")).toEqual({
      slug: "apple",
      title: "Apple",
      kicker: "UX writing & product voice · 2021–2023",
    });
  });

  it("apple → Verizon", () => {
    expect(nextCaseStudy("apple")).toEqual({
      slug: "verizon",
      title: "Verizon",
      kicker: "Brand identity & campaign · 2017–2024",
    });
  });

  it("mercedes → Verizon", () => {
    expect(nextCaseStudy("mercedes")).toEqual({
      slug: "verizon",
      title: "Verizon",
      kicker: "Brand identity & campaign · 2017–2024",
    });
  });

  it("returns null for non-case-study keys (writing)", () => {
    expect(nextCaseStudy("writing")).toBeNull();
  });

  it("returns null for unknown slugs", () => {
    expect(nextCaseStudy("something-else")).toBeNull();
  });
});
```

**Step 2: Run — expect FAIL (module missing)**

```
npm run test -- lib/case-study-next
```

**Step 3: Minimal implementation**

```ts
// lib/case-study-next.ts
import { ALTS, STATIC_FEATURES, type FeatureKey } from "./feature-static";

export type NextCaseStudy = {
  slug: string;
  title: string;
  kicker: string;
};

const CASE_STUDY_KEYS = ["verizon", "apple", "mercedes"] as const satisfies readonly FeatureKey[];
type CaseStudyKey = (typeof CASE_STUDY_KEYS)[number];

function isCaseStudyKey(x: string): x is CaseStudyKey {
  return (CASE_STUDY_KEYS as readonly string[]).includes(x);
}

export function nextCaseStudy(currentSlug: string): NextCaseStudy | null {
  if (!isCaseStudyKey(currentSlug)) return null;
  const alts = ALTS[currentSlug];
  const nextAlt = alts.find((a) => a.key !== "work" && isCaseStudyKey(a.key as string));
  if (!nextAlt) return null;
  const feature = STATIC_FEATURES[nextAlt.key as FeatureKey];
  return {
    slug: nextAlt.key as string,
    title: feature.title,
    kicker: feature.kicker,
  };
}
```

**Step 4: Run — expect PASS**

```
npm run test -- lib/case-study-next
```

**Step 5: Commit**

```bash
git add lib/case-study-next.ts lib/case-study-next.test.ts
git commit -m "feat(case-study): next-piece resolver using ALTS map"
```

---

### Task 2: CaseStudyHandoff component

**Files:**
- Create: `components/canvas/CaseStudyHandoff.tsx`

**Step 1: Implementation**

```tsx
// components/canvas/CaseStudyHandoff.tsx
import Link from "next/link";
import { nextCaseStudy } from "@/lib/case-study-next";

export function CaseStudyHandoff({ currentSlug }: { currentSlug: string }) {
  const next = nextCaseStudy(currentSlug);

  return (
    <section className="px-[60px] pt-[140px] pb-[120px] max-[820px]:px-[24px] max-[820px]:pt-[100px] max-[820px]:pb-[80px]">
      <div className="max-w-[1200px] mx-auto">
        {next && (
          <Link
            href={`/work/${next.slug}`}
            className="block group mb-[70px] max-[820px]:mb-[52px]"
          >
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] mb-[22px]">
              NEXT —
            </div>
            <h2 className="font-[family-name:var(--font-serif)] font-normal text-[clamp(42px,5vw,72px)] leading-[1] tracking-[-0.015em] m-0 mb-[18px] text-[var(--color-ink)] transition-transform duration-200 group-hover:translate-x-[6px]">
              {next.title}
              <span className="inline-block ml-[14px] text-[var(--color-ink-soft)] transition-colors duration-200 group-hover:text-[var(--color-accent)]">
                →
              </span>
            </h2>
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-soft)]">
              {next.kicker}
            </div>
          </Link>
        )}

        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[12px] font-[family-name:var(--font-mono)] text-[13px] text-[var(--color-ink-soft)] max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-y-[10px]">
          <Link
            href="/?ask=1"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            Or ask for something specific →
          </Link>
          <span className="text-[var(--color-ink-faint)] max-[820px]:hidden">·</span>
          <Link
            href="/work"
            className="hover:text-[var(--color-ink)] transition-colors"
          >
            See all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/canvas/CaseStudyHandoff.tsx
git commit -m "feat(case-study): add CaseStudyHandoff footer block"
```

---

### Task 3: Wire handoff into CaseStudyView

**Files:**
- Modify: `components/canvas/CaseStudyView.tsx`

**Step 1: Add import and render after the page content**

At the top of the file, add:

```ts
import { CaseStudyHandoff } from "./CaseStudyHandoff";
```

At the **very end** of the returned `<article>`, after the existing Portable-Text fallback `<section>` (the closing `)}` of the `moments.length === 0 && (p.conflict || p.resolution)` block), add:

```tsx
<CaseStudyHandoff currentSlug={p.slug.current} />
```

So the final few lines of the returned JSX look like:

```tsx
      {moments.length === 0 && (p.conflict || p.resolution) && (
        <section ...>...</section>
      )}

      <CaseStudyHandoff currentSlug={p.slug.current} />
    </article>
  );
}
```

**Step 2: Verify visually**

```
npm run dev
# Open http://localhost:3000/work/verizon — scroll to bottom
# Expect: "NEXT —  Apple  UX writing & product voice · 2021–2023"
#         followed by "Or ask for something specific →  ·  See all work →"
```

**Step 3: Commit**

```bash
git add components/canvas/CaseStudyView.tsx
git commit -m "feat(case-study): render handoff block at the foot of the view"
```

---

### Task 4: Add `autoFocus` prop to ChatBar

**Files:**
- Modify: `components/landing/ChatBar.tsx`

**Step 1: Extend props**

Update the `Props` type and destructure:

```ts
type Props = {
  onLead: (message: string) => Promise<void>;
  onNavigate: (to: string) => void;
  onCard: (id: "pi") => void;
  onFeature: (key: FeatureKey, raw: string) => void;
  inResponse: boolean;
  onReset: () => void;
  /** When true, focus the chat input after mount (e.g. arriving via /?ask=1). */
  autoFocus?: boolean;
};
```

Add `autoFocus` to the destructured args.

**Step 2: Focus on mount**

Add a new `useEffect` near the existing keydown effect:

```ts
useEffect(() => {
  if (autoFocus) {
    // Wait for paint so iOS Safari accepts the focus.
    requestAnimationFrame(() => inputRef.current?.focus());
  }
}, [autoFocus]);
```

**Step 3: Commit**

```bash
git add components/landing/ChatBar.tsx
git commit -m "feat(chat): add autoFocus prop for deep-link focus"
```

---

### Task 5: LandingClient reads `?ask=1` and scrubs it

**Files:**
- Modify: `app/landing-client.tsx`

**Step 1: Add the effect**

At the top, import `useEffect` (add to the existing `useState` import):

```ts
import { useEffect, useState } from "react";
```

Inside `LandingClient`, alongside the other state:

```ts
const [autoFocus, setAutoFocus] = useState(false);

useEffect(() => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const askParam = url.searchParams.get("ask") === "1";
  const askHash = window.location.hash === "#ask";
  if (askParam || askHash) {
    setAutoFocus(true);
    if (askParam) url.searchParams.delete("ask");
    const clean =
      url.pathname +
      (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "") +
      (askHash ? "" : window.location.hash);
    window.history.replaceState({}, "", clean);
  }
}, []);
```

**Step 2: Pass the prop to ChatBar**

Change the `<ChatBar ... />` element to include `autoFocus={autoFocus}`:

```tsx
<ChatBar
  onLead={handleLead}
  onNavigate={handleNavigate}
  onCard={(id) => id === "pi" && setPiOpen(true)}
  onFeature={(key) => handleFeature(key)}
  inResponse={inResponse}
  onReset={handleReset}
  autoFocus={autoFocus}
/>
```

**Step 3: Commit**

```bash
git add app/landing-client.tsx
git commit -m "feat(landing): focus prompt when arriving with ?ask=1"
```

---

### Task 6: Verify end-to-end + full check suite

**Step 1: Dev-server walkthrough**

```
npm run dev
```

Visit each in turn, confirm:

1. `/work/verizon` — scroll to the bottom. See `NEXT —` (mono, terracotta), large `Apple` serif with trailing `→`, mono kicker `UX writing & product voice · 2021–2023`. Below it, two links: `Or ask for something specific →  ·  See all work →`.
2. Click the `Apple` block → lands on `/work/apple`. The handoff there shows `NEXT — Verizon`.
3. `/work/mercedes` → handoff shows `NEXT — Verizon`.
4. On any case study, click `Or ask for something specific →` → URL becomes `/` (the `?ask=1` is scrubbed by `replaceState`), and the chat input on the landing is focused (cursor blinking inside it).
5. Click `See all work →` → lands on `/work`.
6. Resize the viewport to 800px — the mono row stacks vertically; the middot hides.
7. Hover the `Apple` block — title shifts 6px right and the arrow turns terracotta.

**Step 2: Static checks**

```
npm run typecheck
npm run lint
npm run test
npm run build
```

All four must pass. Lint `<img>` warnings in unrelated files are pre-existing and acceptable.

**Step 3: Final commit (only if anything was adjusted during verification)**

Otherwise nothing to commit — prior commits are enough.

---

### Non-goals (don't do these)

- No cross-palette transition, no animated paper↔dark fade.
- No dark-palette chat input inside the case study.
- No "You were reading X" banner on the landing.
- No second alts row under the handoff. One curated piece, one mono row, done.
- Don't bother making the next-piece resolver fetch from Sanity. It reads statically from `ALTS` + `STATIC_FEATURES` and that's sufficient for the three case-study slugs we have.
