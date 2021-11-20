import {
  appItems,
  Injectable,
  Inject,
} from "../../../shared/domain/AppContainer";
import { Scraper } from "../../../shared/domain/Scraper";
import { BriefPost, Post } from "../../domain/Post";
import { PostScraper } from "../../domain/PostScraper";
import { extractBriefPosts } from "./extractBriefPosts";

@Injectable()
export class Twenty4hPostScraper implements PostScraper {
  constructor(@Inject(appItems.Scraper) private scraper: Scraper) {}

  async fetchLatestNews(): Promise<BriefPost[]> {
    const $ = await this.scraper.fetchWrappedDOM(
      "https://www.24h.com.vn/bong-da-c48.html",
    );

    const hightlightPosts: BriefPost[] = extractBriefPosts($, {
      listContainer: ".cate-24h-foot-box-news-hightl article",
      title: "h3",
      url: "a",
    });

    const latestPosts: BriefPost[] = extractBriefPosts($, {
      listContainer: ".cate-24h-foot-home-latest-list article",
      title: "h3",
      url: "a",
      summary: ".description",
    });

    return [...hightlightPosts, ...latestPosts];
  }

  fetchPost(post: BriefPost): Promise<Post> {
    throw new Error("Method not implemented.");
  }
}
