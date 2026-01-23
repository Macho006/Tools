export type ContentStyle =
  | "all"
  | "tutorial"
  | "listicle"
  | "story"
  | "clickbait"
  | "negative"
  | "comparison"
  | "question";

export type GeneratedIdea = {
  id: string;
  title: string;
  description: string;
  score: number; // 0..100
  style: Exclude<ContentStyle, "all">;
};
