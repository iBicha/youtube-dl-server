import express from 'express';
import { ExecException } from "child_process";
const { exec } = require("child_process");
const { spawn } = require("child_process");
const path = require('path');

const isWin = process.platform === "win32";
const youtubeDlBin = path.resolve('tools/bin/youtube-dl' +(isWin ? '.exe' : ''));
const ffmpegBin = 'ffmpeg';

export class YoutubeDl {
    public static async getVideoMetadata(url: string, options?: string) {
        options = options ||  '-f \"best\"';
        const command = `${youtubeDlBin} ${options} --dump-json ${url}`;
        return await new Promise<any>((resolve, reject) => {
            exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
                if(error) {
                    reject(error);
                    return
                }
                try {
                    resolve(JSON.parse(stdout));
                } catch (e) {
                    console.log(error)
                    console.log(stdout)
                    console.log(stderr)
                    reject('youtube-dl did not respond with valid json: ' + stdout + stderr);
                }
            });
        });
    }

    public static sendAudioStream(url: string, res: express.Response, inputFormat: string = "bestaudio", outputFormat: string = 'mp3') {
        const command = `${youtubeDlBin} -f "${inputFormat}" -o - ${url} | ${ffmpegBin} -i - -f ${outputFormat} -`;
        const proc = spawn('sh', ['-c', command]);
        proc.stdout.pipe(res)
    }
}
