import {ExecException} from "child_process";
const fs = require('fs');
const https = require('https');

const { exec } = require("child_process");
export class YoutubeDl {
    public static async getVideoMetadata(url: string, options?: string) {
        await this.downloadTools();
        options = options ||  '-f \'best\'';
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

    public static async downloadTools(forceUpdate = false) {
        if(!forceUpdate && fs.existsSync('tools/bin/youtube-dl')) {
            return;
        }
        fs.mkdirSync('tools/bin', {recursive: true});
        await this.downloadFile('https://yt-dl.org/downloads/latest/youtube-dl', 'tools/bin/youtube-dl');
        fs.chmodSync('tools/bin/youtube-dl', '755');
    }

    private static async downloadFile(url: string, dest: string) {
        return new Promise<void>((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            file.on('open', (fd: any) => {
                https.get(url, function (response: { pipe: (arg0: any) => void; }) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close();
                        resolve();
                    });
                }).on('error', function (err: { message: any; }) {
                    fs.unlinkSync(dest);
                    reject(err.message);
                });
            })
        });
    }
}
