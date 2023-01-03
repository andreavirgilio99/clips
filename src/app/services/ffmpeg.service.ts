import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {

  isReady = false;
  isCommandRunning = false;

  private ffmpeg: FFmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (!this.isReady) {
      await this.ffmpeg.load(); //downloads the webAssembly file
      this.isReady = true;
    }
  }

  async getScreenshots(video: File) {
    this.isCommandRunning = true;

    const data = await fetchFile(video);
    this.ffmpeg.FS('writeFile', video.name, data); //FS = file system

    const seconds = [1, 2, 3];
    const commands: string[] = []

    seconds.forEach(sec => {
      commands.push(
        //input
        '-i', video.name,
        //output options
        '-ss', '00:00:0' + sec,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',
        //output
        'output_0'+ sec + '.png'
      )
    })

    await this.ffmpeg.run(
      ...commands
    );

    const screenshots : string[] = [];

    seconds.forEach(sec => {
      const screenshotFile = this.ffmpeg.FS('readFile', 'output_0'+ sec + '.png');
      screenshots.push('data:image/png;base64,' + this.toBase64(screenshotFile));
    })

    this.isCommandRunning = false;

    return screenshots;
  }

  toBase64(bytes: Uint8Array): string{
  let binary = '';
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa( binary );
  }

}
