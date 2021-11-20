import { CheerioAPI, Cheerio, Node } from "cheerio";

export type WrappedDOM = CheerioAPI;
export type WrappedNode = Cheerio<Node>;

export interface Scraper {
  fetch(url: string): Promise<string>;
  fetchWrappedDOM(url: string): Promise<WrappedDOM>;
}
