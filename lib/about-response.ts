export type AboutFollowup = {
  id: string;
  prompt: string;
  answer: string;
};

export const ABOUT_FOLLOWUPS: AboutFollowup[] = [
  {
    id: "actual-work",
    prompt: "what do you actually do?",
    answer:
      "I write the line, the argument under the line, and the deck that gets the line out of a conference room alive. Some days that means campaign concepts and copy. Some days it means positioning, founder narrative, naming, launch language, or pulling a messy brief apart until the real problem admits it exists.",
  },
  {
    id: "working-style",
    prompt: "what's it like working with you?",
    answer:
      "Direct, collaborative, and allergic to theater. I like a clear owner, a strong point of view, and enough room to make the first draft useful instead of decorative. I will push back when the brief is ducking the real question, and I will take a good note fast.",
  },
  {
    id: "why-both",
    prompt: "copywriter or creative director?",
    answer:
      "Both, because the sentence and the room around the sentence are usually the same problem. The writer in me cares whether the language is alive. The creative director in me cares whether it can survive the politics, timing, taste, and fear around it.",
  },
  {
    id: "availability",
    prompt: "are you taking projects?",
    answer:
      "Yes, selectively. I am best for founders, arts organizations, mission-driven brands, and agencies that need senior thinking without turning the assignment into a procurement ritual. Email works better than a form.",
  },
];

export function resolveAboutFollowup(
  prompt: string,
  remaining: AboutFollowup[]
): AboutFollowup {
  const normalized = prompt.toLowerCase();
  const direct = remaining.find((followup) => followup.prompt === prompt);
  if (direct) return direct;

  const keywordMatch = remaining.find((followup) => {
    if (followup.id === "actual-work") {
      return /\b(actually|do|day|work|job|make)\b/.test(normalized);
    }
    if (followup.id === "working-style") {
      return /\b(working|collaborat|process|feedback|like|partner)\b/.test(normalized);
    }
    if (followup.id === "why-both") {
      return /\b(copywriter|creative director|both|role|writer)\b/.test(normalized);
    }
    if (followup.id === "availability") {
      return /\b(available|availability|hire|project|freelance|taking|free)\b/.test(normalized);
    }
    return false;
  });
  if (keywordMatch) return { ...keywordMatch, prompt };

  return {
    id: "full-about",
    prompt,
    answer:
      "That is probably a real answer, not a doorway answer. The full about page has more room; this little exchange should know when to stop pretending it is a person.",
  };
}
