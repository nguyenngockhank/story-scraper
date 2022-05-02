import { Injectable, Inject, Global } from "@nestjs/common";

export { Injectable, Inject, Global };

export const appItems = {
  Scraper: Symbol("Scraper"),
  PuppeteerScraper: Symbol("PuppeteerScraper"),
  AxiosScraper: Symbol("AxiosScraper"),
  Downloader: Symbol("Downloader"),
  Mp3Processor: Symbol("Mp3Processor"),
};
