type ImageUrl = string;
export type Post = {
  url: string;
  title: string;
  content: string;
  summary: string;
  thumbnail?: ImageUrl;
  createdAt?: string;
};

export type BriefPost = Omit<Post, "content">;

type PostScraperOptions = {
  baseUrl: string;
  latestNewsUrl: string;
};
