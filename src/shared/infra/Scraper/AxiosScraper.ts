import { Injectable } from "../../domain/AppContainer";
import { Scraper } from "../../domain/Scraper";
import * as retry from "retry";
import * as axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { Operation } from "retry";

@Injectable()
export class AxiosScraper implements Scraper {
  fetch(url: string): Promise<string> {
    const operation = this.getRetryOperation();

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
          });

          const data = <string>response.data;
          resolve(data);
        } catch (err) {
          operation.retry(err);
        }
      });
    });
  }

  async fetchWrappedDOM(url: string): Promise<CheerioAPI> {
    const html = await this.fetch(url);
    return cheerio.load(html);
  }

  private getRetryOperation(): Operation {
    const operation = retry.operation({
      retries: 5,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 60 * 1000,
      randomize: true,
    });
    return operation;
  }
}
