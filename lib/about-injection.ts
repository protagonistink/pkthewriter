const INJECTION_PATTERNS = [
  /ignore (all |your )?(previous|prior|above) (instruction|prompt)/i,
  /pretend (you are|to be)/i,
  /system prompt/i,
  /you are now/i,
  /forget (your|everything|all)/i,
  /disregard (all |the )?(previous|prior|instructions)/i,
  /act as (a |an )?(ai|assistant|chatbot|bot|language model)/i,
  /jailbreak/i,
  /dan mode/i,
  /bypass (your )?(filter|restriction|guideline)/i,
];

export function detectInjection(input: string): boolean {
  const t = input.trim();
  if (!t) return false;
  return INJECTION_PATTERNS.some((rx) => rx.test(t));
}
