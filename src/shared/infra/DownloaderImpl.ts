import axios from "axios";
import * as retry from "retry";
import * as fs from "fs";
import chunk from "lodash/chunk";
import { Downloader, DownloadItem } from "../domain/Downloader";

export class DownloaderImpl implements Downloader {
  private batch = 10;
  async downloadItem(item: DownloadItem): Promise<void> {
    await this.downloadAudio(item.output, item.url);
  }

  async downloadItems(items: DownloadItem[]): Promise<void> {
    const batches = chunk(items, this.batch);

    for (const items of batches) {
      await Promise.all(
        items.map((item) => this.downloadAudio(item.output, item.url)),
      );
    }
  }

  private async downloadAudio(outputPath: string, url: string): Promise<void> {
    const operation = retry.operation({
      retries: 5,
      factor: 3,
      minTimeout: 1 * 1000,
      maxTimeout: 60 * 1000,
      randomize: true,
    });

    return new Promise((resolve, reject) => {
      operation.attempt(async function (currentAttempt) {
        if (currentAttempt > 1) {
          console.warn(`*** download currentAttempt ${currentAttempt}\n`);
        }

        const writer = fs.createWriteStream(outputPath);
        try {
          const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
          });

          const stream: any = response.data;
          stream.pipe(writer);
          writer.on("error", (err) => operation.retry(err));
          writer.on("finish", resolve);
        } catch (err) {
          operation.retry(err);
        }
      });
    });
  }
}
