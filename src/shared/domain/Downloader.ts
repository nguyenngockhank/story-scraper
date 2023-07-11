export type DownloadedItem = {
  output: string;
  url: string;
};

export interface Downloader {
  downloadItem(item: DownloadedItem): Promise<void>;
  downloadItems(items: DownloadedItem[]): Promise<void>;
}
