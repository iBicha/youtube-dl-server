import { ExecException } from "child_process";
const { exec } = require("child_process");
const path = require('path');

const isWin = process.platform === "win32";
const bin = path.resolve('tools/bin/youtube-dl' +(isWin ? '.exe' : ''));

export class YoutubeDl {
    public static async getVideoMetadata(url: string, options?: string) {
        options = options ||  '-f \"best\"';
        const command = `${bin} ${options} --dump-json ${url}`;
        return await new Promise<any>((resolve, reject) => {
            exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
                if(error) {
                    reject({error: error.message, stderr, stdout});
                    return
                }
                try {
                    resolve(JSON.parse(stdout));
                } catch (e) {
                    reject({error: e, stderr, stdout});
                }
            });
        });
    }
}
