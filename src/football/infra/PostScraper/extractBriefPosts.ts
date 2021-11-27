import { WrappedDOM, WrappedNode } from "../../../Shared/domain/Scraper";
import { BriefPost } from "../../domain/Post";

export type SelectorOptions = {
  listContainer: string;
  title: string;
  url: string;
  summary?: string;
};

export function getStringValue($el: WrappedNode, selector?: string): string {
  if (!selector) {
    return "";
  }
  return $el.find(selector).text().trim();
}

export function extractBriefPosts(
  $: WrappedDOM,
  selectors: SelectorOptions,
): BriefPost[] {
  const $container = $(selectors.listContainer);
  const posts: BriefPost[] = [];
  $container.each((index, postEl) => {
    const $el = $(postEl);

    const rawPost: BriefPost = {
      title: getStringValue($el, selectors.title),
      url: $el.find(selectors.url).attr("href"),
      summary: getStringValue($el, selectors.summary),
    };
    if (validPost(rawPost)) {
      posts.push(rawPost);
    }
  });

  return posts;
}

export function validPost(rawPost: BriefPost): boolean {
  return !!rawPost.title && !!rawPost.url;
}
