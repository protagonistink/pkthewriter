# Sanity wiring + audit pass — design

## Problem

Two threads have converged into one pass:

1. **Sanity isn't wired.** The `portfolio` dataset holds eight real project documents (Airtable, BP, Verizon Techsure, Verizon *Biggest Little Monsters*, Chevron, Warner Brothers, AT&T Wireless, Motion Picture Association) with hero imagery, PortableText copy, Vimeo embeds, disciplines, deliverables, and impact stats — but every document has `slug.current == null`. So `*[_type == "project" && slug.current == $slug]` returns nothing, and the case-study pages render from `lib/static-case-studies.ts` fallbacks that assume Verizon/Apple/Mercedes — a set that only partially overlaps reality.

2. **Design audit surfaced a handful of targeted improvements.** A skimmer-readable landing, a case-study page that opens on content instead of a void, and metadata (client/role/year/impact) pulled up from the foot of the page so an HR scout sees them above the scroll. The audit assumed cold HR discovery; in practice most traffic arrives pre-qualified from LinkedIn or a resume, which changes the hero calculus.

## Decisions

### Sanity

**Slugs.** Mostly brand-only kebab; two exceptions because there are two Verizon projects:

| Brand | Title | Slug |
|---|---|---|
| Airtable | This is How | `airtable` |
| BP | Team USA | `bp` |
| Verizon Techsure | Your Tech Should Work | `techsure` |
| Verizon | Biggest Little Monsters | `verizon-up` |
| Chevron | Rebranding a Giant | `chevron` |
| Warner Brothers | Steve Jobs | `warnerbros` |
| AT&T Wireless | Lily's Gift Decider | `att` |
| Motion Picture Association | What Comes Next? | `mpa` |

A one-off Node script using `SANITY_READ_TOKEN` + the mutate API patches each document with its `slug.current`.

**Static fallback deleted.** Once Sanity has slugs, `lib/static-case-studies.ts` and its import in `app/work/[slug]/page.tsx` both go away. Sanity is the only source.

### Feature map

`lib/feature-static.ts` loses `apple` and `mercedes` and picks up the real eight brand slugs. `lib/intent-router.ts` routes each brand keyword to its matching feature. The `FeatureKey` type becomes the union of the eight slugs plus `writing`, `screenwriting`, `resume`, and the conversational keys below.

### Conversational keyword routing

| Keyword | Behavior |
|---|---|
| `best ad` | Random from `{warnerbros, airtable, verizon-up, att}` |
| `surprise me` | Random from all Sanity projects |
| `what's your favorite` | Random from `{att, warnerbros, mpa}` |
| `say hi` | Acknowledgement card + inline lead form + "Or did you want to talk about something else?" fallback |
| `contact` | Same as `say hi`, plus a LinkedIn link in the acknowledgement |
| `resume` | External link to `/resume` (redirect route — see below), opens in new tab |

Intent router gains a new `{ kind: "random"; from: FeatureKey[] }` variant (or equivalent) so the landing client resolves the random pick at render time. `say hi` / `contact` share a new `{ kind: "say-hi" | "contact" }` variant that surfaces the same inline-form card with a tiny content delta.

### Resume shortlink

New file: `app/resume/route.ts`. Returns a 302 to the Google Drive URL. The Drive URL lives only in this one file (read from an env var `RESUME_PDF_URL`). No other reference to the URL anywhere in the codebase, no `<meta>` tag, no OpenGraph, no visible text. `/resume` is safe to share on its own.

Any existing Drive URL in the codebase gets replaced with `/resume`.

### Landing UX

- `HeroIntro.tsx` stays exactly as it is. No tenure line, no client strip — LinkedIn pre-qualification makes the hero's single-line stance work. The existing Watermark (5 inline SVG marks at 0.22 opacity) does ambient proof duty.
- `ChatBar.tsx` placeholder gains an animated ghost-text rotation: types → holds → erases → next. Pool: `work`, `resume`, `contact`, `about`, `say hi`, `surprise me`, `what's your favorite`, `best ad`. Rotates through 4–5 picks, lands on `surprise me` as the resting placeholder. Stops on focus, on input, or when `prefers-reduced-motion: reduce` is set (reduced-motion users see the resting placeholder directly).
- `Rail.tsx` stays collapsed by default; chevron toggles expansion; labels visible when expanded. Notion-/Asana-style. No change needed.

### Case-study page

Single biggest layout change is the top of the page.

- **Hero** unchanged when imagery exists: full-bleed `heroImage`/`mainImage`, gradient overlay, kicker (`BRAND · YEAR · TYPE`) + title + role bottom-left. All eight Sanity projects have imagery, so the empty-panel fallback becomes unreachable in practice — but it stays in the code for safety.
- **New overture section, replacing both the current `§ Overture` block and the foot credits strip.** Two-column grid under the hero:
  - **Left column** (metadata stack): stacked label/value pairs in the order `Client`, `Role`, `Year`, `Type`, a thin horizontal rule, then `Disciplines`, `Deliverables`, `Impact`. Labels are mono caps (`--color-ink-soft`), values are serif (same family as body). One column, left-aligned, generous vertical breathing room. Reference: the Bose case-study screenshot you shared — not the wider 4-column grid, just the single stacked block.
  - **Right column**: the `context` paragraph in large display serif (roughly `clamp(28px, 3.4vw, 44px)` to match the reference's scale), with a subtle fade-out at the bottom to imply "there's more below." No pull-quote, no attribution mark — the context *is* the opener.
- **Numbered moments** continue as they do now: `§ 01 / § 02 / § 03` headers, sticky mono counter, serif title, PortableText body, images intercut. Unchanged.
- **Foot credits strip removed.** Everything previously in the bottom Disciplines/Deliverables/Impact triptych now lives in the top-of-page metadata column. Scouts see it above the scroll.
- **Handoff block** (from the parallel session) remains at the very foot. Unchanged by this pass.

The `§` editorial system survives for narrative sections; metadata uses plain mono caps labels (`CLIENT`, `ROLE`, `IMPACT`) — no word-eyebrow vocabulary (`THE CONTEXT`) is introduced.

## Surfaces affected

- **New:** `app/resume/route.ts`, `scripts/backfill-sanity-slugs.ts` (one-off, runnable via `npx tsx`)
- **Rewrite:** `lib/feature-static.ts`, `lib/intent-router.ts`, `components/canvas/CaseStudyView.tsx`
- **Edit:** `components/landing/ChatBar.tsx` (animated placeholder), `app/landing-client.tsx` (random-intent resolution, say-hi/contact card wiring)
- **Delete:** `lib/static-case-studies.ts`, the `?? staticCaseStudy(slug)` fallback in `app/work/[slug]/page.tsx`
- **Env:** add `RESUME_PDF_URL` to `.env.local` and `.env.example`

## Open / parked

- **Stupid-input state.** When someone types gibberish (`aaaa`, `asdfasdf`, single insults) we'd currently fall through to `clarify` or `lead`. The bit Patrick has in mind — bouncing to a curated YouTube / Reddit link as a dry joke — is deferred to a separate task. The likely shape when picked up: a new `{ kind: "bounce" }` intent that renders a card ("Ah, a classic non sequitur.") with a click-out link plus the existing clarify alts row. Not an auto-redirect.
- **Type-on animation** for the response interpretation line. Deferred.
- **Sticky § TOC rail** inside dark case studies. Deferred.
- **Persistent ⌘K** across the dark scope. Deferred.

## Verification

1. `/work/airtable`, `/work/bp`, `/work/techsure`, `/work/verizon-up`, `/work/chevron`, `/work/warnerbros`, `/work/att`, `/work/mpa` all render with real Sanity imagery and copy. No 404s.
2. The metadata column under each hero shows `Client / Role / Year / Type` followed by `Disciplines / Deliverables / Impact`. The big serif context paragraph sits on the right with a fade-out bottom.
3. Landing prompt's placeholder rotates through examples and lands on `/ surprise me`.
4. `best ad` typed four times lands on four different anchor projects roughly uniformly.
5. `surprise me` lands on any of the eight projects.
6. `what's your favorite` lands on one of `{att, warnerbros, mpa}`.
7. `say hi` renders an acknowledgement card with a working inline lead form and a "something else" fallback link. `contact` does the same with a LinkedIn link visible.
8. `/resume` returns a 302 to the Drive URL. `view-source:` on the homepage and case studies shows no Drive URL anywhere. The resume link's visible text is `Resume ↗` or similar — never a URL.
9. `/work` grid lists all eight projects and links to the correct slugs.
10. `npm run typecheck && npm run lint && npm run test && npm run build` all pass.

## Non-goals (don't do these)

- No schema changes in Sanity Studio beyond the one-off slug backfill.
- No new Sanity content types (no `suggestionSet`, no `aboutPage`, no `writingClip` in this pass).
- No additions to `HeroIntro.tsx`. The hero stays spare.
- No redesign of the numbered `§` moments. They already work.
- No new rail entries. Existing Home / Work / Writing / About / Contact is enough; `/writing` and `/about` continue to be thin pages until they get their own passes.
