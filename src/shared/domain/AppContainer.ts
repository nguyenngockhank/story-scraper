import { Injectable, Inject, Global } from "@nestjs/common";

export { Injectable, Inject, Global };

export const appItems = {
  Scraper: Symbol("Scraper"),
  Downloader: Symbol("Downloader"),
  Mp3Processor: Symbol("Mp3Processor"),
};
