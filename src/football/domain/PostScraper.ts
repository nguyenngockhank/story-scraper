import { BriefPost, Post } from "./Post";

export interface PostScraper {
  fetchLatestNews(): Promise<BriefPost[]>;
  fetchPost(post: BriefPost): Promise<Post>;
}

export type PostScraperList = Array<PostScraper>;
