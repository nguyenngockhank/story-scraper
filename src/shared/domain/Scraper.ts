import { CheerioAPI, Cheerio, Node } from "cheerio";

export type WrappedDOM = CheerioAPI;
export type WrappedNode = Cheerio<Node>;

export type ScraperOptions = {
  retryAttempt: number;
};

export interface Scraper {
  fetch(url: string, options?: ScraperOptions): Promise<string>;
  fetchWrappedDOM(url: string, options?: ScraperOptions): Promise<WrappedDOM>;
}
