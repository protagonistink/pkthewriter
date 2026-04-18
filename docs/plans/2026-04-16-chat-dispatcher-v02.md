# v0.2 — Chat Bar as Dispatcher

**Status:** Draft
**Author:** Pat + Claude
**Scope:** 1–2 days
**Parent:** `2026-04-16-chat-first-portfolio-v1.md` (v0.1.0 shipped)

---

## Problem

The chat bar is dumb. Every input becomes a lead — including "show me the work," "case studies," and "hi" — which means:

1. **Pat's inbox fills with junk.** Navigational intent gets emailed as if it were an inquiry.
2. **Users hit a dead end.** Someone who typed "case studies" expecting to be taken somewhere instead sees "I wrote that down." That's a broken promise — the bar invited them to *ask something*, and it didn't answer.
3. **The chat bar isn't doing any work.** It's a disguised lead-capture form. It should be a dispatcher — read intent, route to the right place, and only treat genuine inquiries as leads.

## Non-goals

- ❌ Live-filter search / Raycast clone
- ❌ Thumbnail grid as search results
- ❌ LLM-powered query understanding (overkill, API cost, latency)
- ❌ Rebuild the hero or the voice
- ❌ Logo wall / client marquee on landing

## Strategy

**The chat bar becomes an intent dispatcher with three outcomes:**

| Intent | Example input | Behavior |
|---|---|---|
| **Navigate** | "show me the work" / "case studies" / "screenplays" / "writing" / "about you" | Resolve route → show "→ opening [page]" → `router.push()` after 300ms |
| **Lead** | "do you write for B2B SaaS?" / "we need a brand voice for a launch" / any prose ≥ 3 words that doesn't match navigation | Fire `/api/lead` → show existing "I wrote that down" reply |
| **Clarify** | "hi" / "hello" / single unmatched word / empty-ish | Show 3 suggested prompts as ghost chips under the bar: *show me the work · do you write screenplays? · how do we work together?* |

**Routing is keyword-based, client-side, zero-latency, zero-cost.** No API. No LLM. A pure function that returns `{ kind: "navigate" | "lead" | "clarify", to?: string }` given a string.

**Why not LLM:** For 95% of queries, keyword matching is indistinguishable from an LLM. The 5% edge cases aren't worth the API key, cost, rate limits, latency, or privacy surface. If this proves too brittle in the wild, we can add a Haiku fallback in v0.3.

## Intent map

Keyword → route. Case-insensitive. Matched anywhere in the string. Order matters (first hit wins).

```
screenplay | screenplays | script | scripts  → /screenwriting
work       | case study | case studies | portfolio | ad | ads | campaign | campaigns | brand work  → /work
writing    | essay | essays | clip | clips   → /writing
about      | who are you | your resume | bio → /about
resume                                        → /about#resume (or anchor)
protagonist | pi | studio | agency           → open PI card (on landing only)
contact    | email | reach | hire            → mailto via contact link
```

**Lead heuristics** (everything that didn't match navigation):
- `len(words) ≥ 3` → lead
- `contains("?")` → lead (it's a question)
- `len(chars) ≥ 20` → lead
- Otherwise → clarify

## Tasks

Each task is self-contained and testable. `[T]` = TDD candidate, `[M]` = manual check.

### 1. `[T]` Write intent router

**File:** `lib/intent-router.ts` + `lib/intent-router.test.ts`

```ts
export type Intent =
  | { kind: "navigate"; to: string; label: string }   // e.g. { to: "/work", label: "case studies" }
  | { kind: "card"; id: "pi" }
  | { kind: "lead" }
  | { kind: "clarify" };

export function routeIntent(input: string): Intent
```

Unit tests cover:
- Every keyword in the map routes correctly
- Case-insensitive
- "show me the work" → `{ kind: "navigate", to: "/work" }`
- "do you write screenplays?" → `{ kind: "navigate", to: "/screenwriting" }` (keyword wins, even though there's a `?`)
- "hi" → `{ kind: "clarify" }`
- "we need a brand voice for a fintech launch" → `{ kind: "lead" }` (no keyword, 8 words)
- "tell me about protagonist ink" → `{ kind: "card", id: "pi" }`
- Honeypot / empty string → `{ kind: "clarify" }`
- `"????"` → `{ kind: "clarify" }` (question mark only isn't enough)

### 2. `[T]` Wire router into `ChatBar`

**File:** `components/landing/ChatBar.tsx`

- Accept new `onNavigate(to: string, label: string)` and `onCard(id: string)` props
- On submit: call `routeIntent(value)`
- Branches:
  - `navigate`: set reply to `→ opening ${label}…`, call `onNavigate(to, label)` after 300ms
  - `card`: call `onCard(id)` immediately, close after animation
  - `lead`: existing behavior — call `onSubmit(message)` + show "I wrote that down" reply
  - `clarify`: set `mode: "clarify"` → render 3 suggested-prompt chips beneath the bar (clickable, populate + auto-submit)

No tests required for the JSX; tests live on `routeIntent`.

### 3. `[M]` Landing client wires navigation

**File:** `app/landing-client.tsx`

- Use `useRouter` from `next/navigation`
- Pass `onNavigate={(to) => router.push(to)}` and `onCard={(id) => setPiOpen(id === "pi")}` to `ChatBar`

### 4. `[M]` Clarify-mode suggestions

**File:** `components/landing/ChatBar.tsx` (inside)

Suggested prompts in clarify mode (hardcoded — this is the "voice" of the bar):

```
show me your best ad
do you write screenplays?
how do we work together?
```

Style: same as chips but muted, borderless, tap-to-fill-and-submit.

### 5. `[T]` Tighten lead validation

**File:** `lib/lead-validation.ts` + existing test file

Add a minimum-message guard:
- Trim, count words (split on whitespace)
- Reject if `words.length < 3 && !message.includes("?")`
- New error code: `"message-too-short"`
- Client should never hit this — dispatcher catches it first — but defense in depth

### 6. `[M]` Chip copy pass

**File:** `lib/chips.ts`

Replace default chip copy with sharper versions:

```
case-study:   "Show me your best ad"      (was: Show me a case study)
writing:      "Read something short"       (was: Read my writing)
screenwriter: "Are you really a screenwriter?"  (was: Aren't you a screenwriter?)
resume:       "Get the resume"             (was: Get my resume)
pi:           "Protagonist Ink?"           (was: Looking for Protagonist Ink?)
```

### 7. `[M]` Resume link in header

**File:** `components/landing/ContactLink.tsx` → rename to `HeaderLinks.tsx`

Two-item nav top-right, `·` separator:
```
resume · contact
```

Resume links to `/about#resume` (scroll anchor). Contact is mailto.

### 8. `[M]` Protagonist Ink on /about

**File:** `app/about/page.tsx` or a one-liner in the `AboutView` component

Under the bio, a single sentence:

> *I consult independently and through my studio, [Protagonist Ink](https://protagonistink.com).*

No section. No logo. One link.

### 9. `[M]` Selected clients on /work

**File:** `app/work/page.tsx`

One line above the grid, same visual weight as a meta label:

```
SELECTED — Airtable · Verizon · Chevron · [etc, pulled from featured projects]
```

Pull distinct `brand` values from the featured projects GROQ. Not a logo wall. Not a marquee. A list.

### 10. `[M]` Smoke test

- Type "show me the work" → navigates to /work
- Type "hi" → clarify chips appear
- Type "do you write B2B work?" → lead captured (no keyword matches, long enough)
- Type "screenplay" → navigates to /screenwriting
- Email still arrives for real leads
- Resume link in header hits /about

### 11. `[M]` Commit + tag v0.2.0

```
git commit -m "v0.2: chat bar as dispatcher"
git tag v0.2.0
```

## What we explicitly deferred

These came up in the critique but aren't in v0.2. If they prove necessary later:

- **LLM-powered intent** — add Haiku fallback when `routeIntent` returns `clarify` with a prose input
- **Ghost tags on focus (pre-submit)** — show suggestions even before you type. Feels good on desktop, annoying on mobile. Punt.
- **Thumbnail grid as chat results** — fundamentally changes the landing thesis. Not happening.
- **Hover preview pane** — no.
- **Client logo marquee** — no.
- **Hero rewrite to "Creative Director & Copywriter"** — resume-speak. Current line holds.

## Success signal

After 1 week of v0.2:
- Inbox junk drops (no more single-word or navigational "leads")
- Users who type concrete things actually land on pages
- Real inquiries still arrive
- No one complains about the chat bar being slow or broken

If any of those fail, revisit.
