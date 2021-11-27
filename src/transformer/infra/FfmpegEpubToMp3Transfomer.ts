import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import { Finder } from "../../shared/domain/Finder";
import {
  EpubToMp3Transfomer,
  OutputMp3Files,
} from "../domain/StoryToMp3Transfomer";

export class FfmpegEpubToMp3Transfomer implements EpubToMp3Transfomer {
  constructor(private finder: Finder) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  execute(inputPath: string): Promise<OutputMp3Files> {
    throw new Error("Method not implemented.");
  }
}
