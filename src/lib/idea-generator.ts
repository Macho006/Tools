import type { ContentStyle, GeneratedIdea } from "@/types/title";
import { hashStringToInt, makeId, mulberry32, titleCase } from "./utils";
import { scoreIdea } from "./score";

type StyleKey = Exclude<ContentStyle, "all">;

const TITLE_TEMPLATES: Record<StyleKey, string[]> = {
  tutorial: [
    "How to Master {topic} (Step-by-Step)",
    "{topic} in 10 Minutes: The Cleanest Workflow",
    "Build {topic} From Scratch (No Fluff)",
    "{topic} Tutorial: The Only Setup You Need",
    "Stop Struggling — Do {topic} Like This",
  ],
  listicle: [
    "7 {topic} Tips I Wish I Knew Earlier",
    "10 Mistakes Everyone Makes With {topic}",
    "5 Tools That Make {topic} 10x Easier",
    "12 {topic} Tricks That Feel Illegal",
    "9 Things Pros Do Differently in {topic}",
  ],
  story: [
    "I Tried {topic} for 30 Days — Here’s What Happened",
    "I Quit {topic}… Then Everything Changed",
    "The {topic} Decision That Saved Me Months",
    "I Thought {topic} Was Easy… I Was Wrong",
    "My Biggest {topic} Mistake (So You Don’t Repeat It)",
  ],
  clickbait: [
    "This {topic} Trick Is Going Viral (Try It Now)",
    "Nobody Told You This About {topic}…",
    "I Can’t Believe {topic} Works Like This",
    "Do NOT Start {topic} Before Watching This",
    "This Changed How I Do {topic} Forever",
  ],
  negative: [
    "Why {topic} Is Overrated (And What to Do Instead)",
    "Stop Doing {topic} Like This (It’s Hurting You)",
    "The Ugly Truth About {topic}",
    "{topic} Is Wasting Your Time — Here’s Why",
    "Avoid This {topic} Trap at All Costs",
  ],
  comparison: [
    "{topic} vs {topic} — Which One Wins?",
    "I Tested 2 Ways of {topic} — The Winner Surprised Me",
    "Best {topic} Setup: Cheap vs Expensive",
    "{topic} Beginner vs Pro Approach (Huge Difference)",
    "Which {topic} Method Is Actually Faster?",
  ],
  question: [
    "Is {topic} Still Worth It in 2026?",
    "Why Is {topic} So Hard? (Real Fix)",
    "What Nobody Explains About {topic}?",
    "Can You Learn {topic} in 7 Days?",
    "Should You Quit {topic} or Push Through?",
  ],
};

const DESC_TEMPLATES: Record<StyleKey, string[]> = {
  tutorial: [
    "In this video, I break down {topic} step-by-step with a clean workflow you can copy today. No fluff—just the exact process.",
    "Follow along as we set up {topic} from zero, fix common mistakes, and ship a solid result fast.",
  ],
  listicle: [
    "Here are the most practical {topic} tips—each one is quick to apply and actually moves the needle. Save this for later.",
    "These {topic} mistakes cost people weeks. I’ll show you how to avoid them and level up immediately.",
  ],
  story: [
    "I challenged myself with {topic} and documented the real results—wins, failures, and what I’d do differently.",
    "This is the honest story behind my {topic} journey—and the lesson that made the biggest difference.",
  ],
  clickbait: [
    "This is the fastest way I’ve found to improve {topic}. Try it once and you’ll understand why it’s trending.",
    "Before you do anything else with {topic}, watch this—one small change can massively boost results.",
  ],
  negative: [
    "Most people do {topic} wrong and don’t even realize it. Here’s what’s broken—and the better alternative.",
    "Let’s be real about {topic}: what works, what doesn’t, and how to avoid wasting time.",
  ],
  comparison: [
    "I compare two popular approaches to {topic} with real pros/cons, so you can pick the best one for your goal.",
    "Here’s the side-by-side breakdown for {topic}—speed, quality, cost, and which one I’d choose today.",
  ],
  question: [
    "Let’s answer the biggest question about {topic} with real examples and a simple decision framework.",
    "If you’re stuck on {topic}, this will clarify what to do next and how to move faster.",
  ],
};

function pick<T>(arr: T[], rand: () => number) {
  return arr[Math.floor(rand() * arr.length)];
}

function fill(template: string, topic: string) {
  return template.replaceAll("{topic}", topic);
}

export function generateIdeas(params: {
  topic: string;
  style: ContentStyle;
  count?: number;
}): GeneratedIdea[] {
  const cleanTopic = titleCase(params.topic);
  const count = params.count ?? 10;

  const seed = hashStringToInt(`${cleanTopic}::${params.style}`);
  const rand = mulberry32(seed);

  const styles: StyleKey[] =
    params.style === "all"
      ? (["tutorial", "listicle", "story", "clickbait", "negative", "comparison", "question"] as StyleKey[])
      : ([params.style] as StyleKey[]);

  const ideas: GeneratedIdea[] = [];

  for (let i = 0; i < count; i++) {
    const style = styles[Math.floor(rand() * styles.length)];
    const title = fill(pick(TITLE_TEMPLATES[style], rand), cleanTopic);
    const description = fill(pick(DESC_TEMPLATES[style], rand), cleanTopic);

    const score = scoreIdea(title, description, rand);

    ideas.push({
      id: makeId("idea"),
      title,
      description,
      score,
      style,
    });
  }

  ideas.sort((a, b) => b.score - a.score);
  return ideas;
}
