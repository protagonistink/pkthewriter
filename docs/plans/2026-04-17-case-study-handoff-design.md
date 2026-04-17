# Case-study handoff — "Next" + escape hatch

## Problem

After reading a case study, a visitor has no clean way to return to the request-first experience. `← back to work` breaks the concept (the work isn't a grid — it's a conversation), and visitors arriving directly from LinkedIn / search / a shared link have never seen the landing prompt. We need a pattern that ends every case study by delivering the next move.

## Decision

Mirror the landing's "feature + alts" pattern at the foot of every case study. One large editorial curated gesture ("Next — Apple"), followed by one thin mono row that offers open-ended and grid-based alternatives. Same grammar, both scopes.

The whole block lives inside the dark scope. No palette transition, no animation between scopes — the navigation itself is the handoff.

## The block

Placed after the credits strip, before the page ends. Generous top padding (~120px). Dark scope (ivory on `#0f0e0c`).

### Curated "Next" (one large editorial gesture)

```
NEXT —
Apple
UX writing & product voice · 2021–2023
```

- `NEXT —` in mono 11px, `--color-accent` (terracotta), `tracking-[0.22em]` uppercase.
- Title in Newsreader, `clamp(42px, 5vw, 72px)`, ivory (`--color-ink`). Normal weight, tight leading.
- Kicker in mono small caps, `--color-ink-soft`, with the same `brand · year · type` shape used at the top of the piece.
- The entire block is a single `<Link>` target. Hover shifts the title 2px right; a chevron arrow appears trailing the title.
- No card chrome, no border, no background — purely typographic.

### Escape hatch (mono row, two links)

Below the curated block, 60–80px of air, one row:

```
Or ask for something specific →   ·   See all work →
```

- Mono 13px, `--color-ink-soft`. Hover → `--color-ink`.
- Middot separator in `--color-ink-faint`.
- On `<820px` the two links stack with a 12px gap.
- Left → `/?ask=1` (returns to landing with the prompt auto-focused).
- Right → `/work`.

## Picking "next"

Source of truth is [lib/feature-static.ts](lib/feature-static.ts) — the existing `ALTS` map. For any case study whose slug matches a `FeatureKey` (`verizon`, `apple`, `mercedes`):

1. Look up `ALTS[currentKey]`.
2. Take the first entry whose `key` is not `"work"`.
3. That key's `STATIC_FEATURES[key]` provides title + kicker. If a Sanity project exists at the matching slug, prefer its fields (future-proofing for when real projects land).

For case studies whose slug does **not** match a feature key, fall back: pick the most recent other case study by `year`. If no peer exists, omit the "Next" block entirely and let the escape-hatch row do the work on its own.

Returns `null` when no next piece is known. The component handles both render paths.

## Return-to-landing behavior

On the landing page, `LandingClient` checks `window.location` on mount:

- If `?ask=1` is present (or `#ask` hash), auto-focus the chat input via the existing `inputRef`.
- Scrub the param via `history.replaceState` immediately after, so a reload doesn't re-focus.
- Hero and subhead stay in their normal idle state — no canned content, no pre-filled input.

No cross-palette transition. Next.js handles the hard navigation; the paper scope paints naturally when the new page mounts.

## Non-goals

- No second alts row on the case study. One curated pick, one row of lesser alternatives.
- No chat input inside the dark scope — the dark scope stays editorial, no app chrome.
- No animated dark→paper transition. Ambition cost exceeds the benefit.
- No "You were reading Verizon" return banner on the landing. The visitor's memory is sufficient.

## Files affected

- **New**: `components/canvas/CaseStudyHandoff.tsx` — the footer block.
- **New**: `lib/case-study-next.ts` — pure function that, given `currentSlug` + optional project list, returns `{ title, kicker, href } | null`.
- **Edit**: [components/canvas/CaseStudyView.tsx](components/canvas/CaseStudyView.tsx) — render the handoff after the credits strip.
- **Edit**: [app/landing-client.tsx](app/landing-client.tsx) — on mount, if `?ask=1` or `#ask`, focus `#chat` and clean the URL.

## Verification

1. `/work/verizon` → scroll to bottom → see *NEXT — Apple* + *Or ask for something specific → · See all work →*.
2. Click *Apple* → lands on `/work/apple`.
3. Click *Or ask for something specific* → lands on `/` with the chat input focused (cursor blinking in the prompt).
4. Click *See all work* → lands on `/work` grid.
5. Resize to <820px: the mono row stacks.
6. `/work/apple` → *NEXT — Verizon*.
7. `/work/mercedes` → *NEXT — Verizon*.
8. `npm run typecheck && npm run lint && npm run test && npm run build` all pass.
