import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper } from "../../../Shared/domain/Scraper";
import { BriefPost, Post } from "../../domain/Post";
import { PostScraper } from "../../domain/PostScraper";
import { extractBriefPosts } from "./extractBriefPosts";

@Injectable()
export class VnexpressPostScraper implements PostScraper {
  constructor(@Inject(appItems.Scraper) private scraper: Scraper) {}

  async fetchLatestNews(): Promise<BriefPost[]> {
    const $ = await this.scraper.fetchWrappedDOM(
      "https://vnexpress.net/bong-da",
    );

    return extractBriefPosts($, {
      listContainer: ".col-left-subfolder article",
      title: "h2",
      summary: ".description",
      url: "a",
    });
  }

  fetchPost(post: BriefPost): Promise<Post> {
    throw new Error("Method not implemented.");
  }
}
