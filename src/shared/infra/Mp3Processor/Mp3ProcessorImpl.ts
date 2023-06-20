import { Mp3Processor } from "../../domain/Mp3Processor";
import { Injectable } from "../../domain/AppContainer";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import * as audioconcat from "audioconcat";
import { Finder } from "../../domain/Finder";

@Injectable()
export class Mp3ProcessorImpl implements Mp3Processor {
  constructor(private finder: Finder) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }
  increaseTempo(
    inputFile: string,
    outputFile: string,
    tempo: number,
  ): Promise<boolean> {
    const fName = this.finder.fileName(outputFile, false);
    return new Promise((resolve) => {
      const command = ffmpeg();
      command
        .input(inputFile)
        .audioFilters(`atempo=${tempo}`)
        .on("start", (commandLine) => {
          console.log(`Spawned Ffmpeg with command: ${commandLine}`);
        })
        .on("end", () => {
          console.log(`\nFile name: ${fName} at Finished`);
          resolve(true);
        })
        .save(outputFile);
    });
  }

  merge(
    songs: string[],
    outputFile: string,
    tempoInput?: number,
  ): Promise<string> {
    const tempo = tempoInput === 1 ? 0 : tempoInput;

    const fName = this.finder.fileName(outputFile, false);
    const dName = this.finder.dirName(outputFile);
    const midName = tempo ? `-temp` : "";
    const tempoOutput = `${dName}/${fName}${midName}.mp3`;

    return new Promise((resolve) => {
      audioconcat(songs)
        .concat(tempoOutput)
        .on("end", async () => {
          if (tempo) {
            await this.increaseTempo(tempoOutput, outputFile, tempo);
            await this.finder.deleteFile(tempoOutput);
          }
          resolve(outputFile);
        });
    });
  }
}
