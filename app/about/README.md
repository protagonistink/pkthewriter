# /about — Conversational Page

The /about page is a stateless, client-side conversation. No LLM, no API,
no runtime services. Everything ships as static JSON + a Fuse.js matcher.

## File map
- `data/about-intents.json` — intent bank (~20 intents) + email/resume/work links
- `data/about-opening.json` — the 5-exchange opening thread
- `data/about-fallbacks.json` — fallback replies when nothing matches
- `lib/about-matcher.ts` — pure matcher (Fuse.js + mood + rotation)
- `lib/about-session.ts` — sessionStorage helpers (visited this session only)
- `lib/about-injection.ts` — prompt-injection regex detector
- `components/about/*` — UI

## How to add an intent
1. Pick a category: essentials | character | oddball | escape.
2. Pick a kebab-case id that doesn't collide.
3. Add an entry to `data/about-intents.json` with:
   - `triggers`: 3–8 phrases, written how a visitor would actually ask.
     First trigger is the "canonical" one — shown in placeholder rotation
     and as ghost-text completion.
   - `replies`: 1–5 reply variants. Include `mood: "playful"` for wink
     answers served when input is ALL CAPS or exclamation-heavy. Include
     `mood: "formal"` for long measured input. Omit `mood` for the default.
   - `followups`: 2–4 sibling intent ids to surface as chips after this reply.
4. Run `npm test` — a schema assertion in the matcher tests verifies the
   file shape.

## How rotation works
- Intent replies: `pickReply()` prefers unseen variants matching the mood
  of the visitor's input. Falls back to any unseen variant. Loops when all
  are seen.
- Fallbacks: `pickFallback()` rotates through `about-fallbacks.json` in
  order; loops when all are seen.
- "Seen" is per-session (`sessionStorage`, key `pkw:about:v1`). Cleared on
  tab close.

## How to tune the match threshold
Fuse.js uses a lower-is-better score. Threshold lives at the top of
`lib/about-matcher.ts`:

```ts
const FUSE_OPTIONS = { threshold: 0.4, ... };
```

- Lower (0.2–0.3) → stricter matching, more fallbacks served.
- Higher (0.5–0.6) → looser matching, intents served on tangential queries.
- 0.4 is the tested default. If you change it, re-run
  `npm test -- lib/about-matcher.test.ts` and update the test expectations
  if fixture cases cross the threshold.

## How to write a good reply
Length guidance by category:
- **essentials** (what-i-do, brands, availability, rate): 2–3 sentences.
  Concrete, declarative, no hedging.
- **character** (process, feedback, beliefs): 3–5 sentences. Specific, not
  aspirational. Name one real thing you do; name one thing you don't.
- **oddball** (real-person-check, favourites, secrets): 1–3 sentences. A
  wink. Write it at 11pm, edit it at noon.
- **escape** (email, resume, more-work): one sentence + a link.

Voice rules:
- First person, lowercase starts only if intentional.
- No corporate voice. If it sounds like a LinkedIn headline, rewrite.
- The `nice-try` reply for prompt injection is humour, not scolding.
- Every fallback ends with a nudge toward email — visitors who hit fallbacks
  are the ones asking something interesting enough that you'd want to hear it.
