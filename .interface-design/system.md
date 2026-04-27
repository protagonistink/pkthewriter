# pkthewriter/minimal Interface Patterns

## Direction

This portfolio is chat-first, but not fake-chat. The landing experience should feel like a writer answering a prompt in the room: direct, restrained, and specific. Avoid layouts that read as generated transcripts, demo conversations, or generic feature cards when the user asked a human question.

## Conversational Responses

- Use progressive call-and-response: one user prompt, one answer, then an affordance to ask one more thing.
- Do not reveal a prewritten multi-turn transcript all at once.
- For conversational/about-style responses, the landing prompt starts in the hero position. Once an answer exists, that same prompt becomes the bottom composer for follow-ups, following the LLM/chat convention.
- Work, writing, resume, screenwriting, and other destination/card intents should not become bottom-composer conversations; they should keep their card/handoff behavior.
- Follow-up prompts can be suggested, but typed follow-ups should also work for nearby intent territory.
- Suggested follow-up chips should append the chip text as the next prompt, then type the answer in.
- The first answer should type in too; do not render the initial response as static prose.
- Clear navigation/card commands typed mid-conversation should route normally rather than being swallowed as follow-ups.
- After five answers total, stop the doorway conversation and point to the full page or appropriate next action.
- Preserve the user's actual typed prompt when rendering the first exchange.

## Depth

Use the existing paper/ink system with border-led structure. Keep boundaries quiet: a single left rule or low-contrast border is enough for conversational structure. Avoid card shells, decorative image wells, and heavy containers for text-first answers.

## Typography

The prompt/question voice uses the mono face. Patrick's answer uses the serif face. The contrast is the interaction: prompt as input, answer as prose. Do not over-label turns with "visitor" / "patrick" unless there is a specific accessibility or comprehension reason.

## Spacing

Keep conversation rhythm open but not theatrical: roughly 22-30px between exchange units, 10-14px between prompt and answer, and max line length around 66ch for prose answers.

## Reusable Pattern

Inline about-style responses should render as:

1. Intro line only if it helps orient the answer.
2. One visible exchange.
3. Bottom composer for typed follow-ups plus 2-3 suggested prompt chips in the response.
4. One appended exchange per follow-up.
5. Hand-off CTA after the small conversation has done enough.
