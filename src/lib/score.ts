import { clamp } from "./utils";

const POWER_WORDS = [
  "secret",
  "mistake",
  "shocking",
  "insane",
  "ultimate",
  "simple",
  "fast",
  "stop",
  "avoid",
  "truth",
  "why",
  "how",
  "best",
  "worst",
];

export function scoreIdea(title: string, description: string, rand: () => number) {
  const t = title.trim();
  const d = description.trim();

  let score = 70;

  const len = t.length;
  if (len >= 35 && len <= 70) score += 10;
  else score += clamp(8 - Math.abs(52 - len) / 4, -10, 8);

  if (/\b\d+\b/.test(t)) score += 6;

  if (/\?/.test(t)) score += 4;

  const low = t.toLowerCase();
  const hits = POWER_WORDS.filter((w) => low.includes(w)).length;
  score += clamp(hits * 2, 0, 10);

  if (d.length >= 90) score += 4;
  else score -= 2;

  score += Math.round((rand() - 0.5) * 8);

  return clamp(Math.round(score), 0, 100);
}
