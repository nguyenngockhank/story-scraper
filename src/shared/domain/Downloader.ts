export type DownloadItem = {
  output: string;
  url: string;
};

export interface Downloader {
  downloadItem(item: DownloadItem): Promise<void>;
  downloadItems(items: DownloadItem[]): Promise<void>;
}
