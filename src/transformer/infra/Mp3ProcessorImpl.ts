import { Mp3Processor } from "../domain/Mp3Processor";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import * as audioconcat from "audioconcat";
export class Mp3ProcessorImpl implements Mp3Processor {
  constructor() {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  merge(songs: string[], outputFile: string): Promise<string> {
    return new Promise((resolve, reject) => {
      audioconcat(songs)
        .concat(outputFile)
        .on("end", function (output: string) {
          console.log("Audio created in:", output);
          resolve(output);
        });
    });
  }
}
