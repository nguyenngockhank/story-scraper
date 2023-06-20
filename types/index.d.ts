declare module "html-to-text" {
  type ConvertOptions = {
    ignoreImage?: boolean;
    wordwrap: number;
  };
  interface HtmlToText {
    convert(html: string, options?: ConvertOptions): string;
  }
  const htmlToText: HtmlToText;
  export = htmlToText;
}

declare module "retry" {
  type AttemptCallback = (currentAttempt: number) => void;

  export type Operation = {
    attempt(callback: AttemptCallback): void;
    retry(err: Error): boolean;
  };

  type RetryOperationOptions = {
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
    randomize: boolean;
  };

  type RetryLib = {
    operation(options: RetryOperationOptions): Operation;
  };

  const retryInstance: RetryLib;
  export = retryInstance;
}
