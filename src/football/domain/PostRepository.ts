import { BriefPost, Post } from "./Post";

export interface PostRepository {
  storeBriefPosts(posts: BriefPost[]): Promise<void>;
  latestNews(): Promise<BriefPost[]>;
  postDetail(postUrl: string | BriefPost): Promise<Post>;
}
