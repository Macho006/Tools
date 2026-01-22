export type Platform =
  | "facebook"
  | "twitter"
  | "linkedin"
  | "telegram"
  | "instagram"
  | "bluesky";

export type Meta = {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
};

export type Manual = {
  title: string;
  description: string;
  image: string;
};
