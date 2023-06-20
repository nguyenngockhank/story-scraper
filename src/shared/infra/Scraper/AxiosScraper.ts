import { Injectable } from "../../domain/AppContainer";
import { Scraper, ScraperOptions } from "../../domain/Scraper";
import * as retry from "retry";
import * as axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { Operation } from "retry";

@Injectable()
export class AxiosScraper implements Scraper {
  fetch(url: string, options?: ScraperOptions): Promise<string> {
    const operation = this.getRetryOperation(options);

    return new Promise((resolve, reject) => {
      operation.attempt(async function (currentAttempt) {
        if (currentAttempt > 1) {
          console.log(`attempt ${currentAttempt} get url: ${url}`);
        }

        try {
          const response = await axios.default({
            method: "get",
            url,
            responseType: "text",
            headers: {
              "user-agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36`,
            },
          });

          const data = <string>response.data;
          resolve(data);
        } catch (err) {
          const canRetry = operation.retry(err);
          if (!canRetry) {
            reject(err);
          }
        }
      });
    });
  }

  async fetchWrappedDOM(
    url: string,
    options?: ScraperOptions,
  ): Promise<CheerioAPI> {
    console.log(">>> fetch url ", url, options);
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
