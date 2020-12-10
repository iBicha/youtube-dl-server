import {ExecException} from "child_process";

const { exec } = require("child_process");
export class YoutubeDl {
    public static async getVideoMetadata(url: string, options = '-f \'best\'') {
        const command = `youtube-dl ${options} --dump-json ${url}`;
        return await new Promise<any>((resolve, reject) => {
            exec(command, {cwd:'tools/bin'},(error: ExecException | null, stdout: string, stderr: string) => {
                if(error) {
                    reject(error);
                    return
                }
                try {
                    resolve(JSON.parse(stdout));
                } catch (e) {
                    reject('youtube-dl did not respond with valid json: ' + stdout);
                }
            });
        });
    }
}
