import { Mp3Processor } from "../../domain/Mp3Processor";
import { Injectable } from "../../domain/AppContainer";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import * as audioconcat from "audioconcat";

@Injectable()
export class Mp3ProcessorImpl implements Mp3Processor {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  createFromHtml(html: string, outputFile: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  merge(songs: string[], outputFile: string): Promise<string> {
    return new Promise((resolve) => {
      audioconcat(songs)
        .concat(outputFile)
        .on("end", function (output: string) {
          console.log("Audio created in:", output);
          resolve(output);
        });
    });
  }
}
