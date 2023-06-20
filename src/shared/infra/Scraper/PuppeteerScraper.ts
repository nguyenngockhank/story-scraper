/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "../../domain/AppContainer";
import { Scraper, ScraperOptions } from "../../domain/Scraper";
import * as retry from "retry";
import cheerio, { CheerioAPI } from "cheerio";
import { Operation } from "retry";
// import * as puppeteer from "puppeteer";
// import * as puppeteer from "puppeteer-core";
const puppeteer = require("puppeteer");

@Injectable()
export class PuppeteerScraper implements Scraper {
  fetch(url: string, options?: ScraperOptions): Promise<string> {
    const operation = this.getRetryOperation(options);

    return new Promise((resolve, reject) => {
      operation.attempt(async function (currentAttempt) {
        console.log(`attempt ${currentAttempt} get url: ${url}`);

        const browser = await puppeteer.launch({});
        const page = await browser.newPage();
        try {
          await page.goto(url, { waitUntil: "domcontentloaded" });
          const content = await page.content();
          resolve(content);
        } catch (err) {
          const canRetry = operation.retry(err);
          if (!canRetry) {
            reject(err);
          }
        } finally {
          await browser.close();
        }
      });
    });
  }

  async fetchWrappedDOM(
    url: string,
    options?: ScraperOptions,
  ): Promise<CheerioAPI> {
    const html = await this.fetch(url, options);
    return cheerio.load(html);
  }

  private getRetryOperation(options?: ScraperOptions): Operation {
    const operation = retry.operation({
      retries: options?.retryAttempt || 5,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 60 * 1000,
      randomize: true,
    });
    return operation;
  }
}
