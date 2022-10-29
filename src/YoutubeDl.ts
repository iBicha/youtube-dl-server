import { ExecException } from "child_process";
const { exec } = require("child_process");
const path = require('path');

const isWin = process.platform === "win32";

export class YoutubeDl {
    public static async getVideoMetadata(url: string, options?: { cli?: "youtube-dl" | "yt-dlp", cliOptions?: string },
                                         schema?: string[]) {
        options = options || {};
        options.cli = options.cli || "youtube-dl";
        options.cliOptions = options.cliOptions || '-f \"best\"';

        const bin = path.resolve(__dirname, '../tools/bin/' + options.cli +(isWin ? '.exe' : ''));
        const command = `${bin} ${options.cliOptions} --dump-single-json --no-warnings ${url}`;
        return await new Promise<any>((resolve, reject) => {
            exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
                if(error) {
                    reject({error: error.message, stderr, stdout});
                    return
                }
                try {
                    let resultObject = JSON.parse(stdout);
                    if(schema) {
                        resultObject = YoutubeDl.filterKeys(resultObject, schema);
                    }
                    resolve(resultObject);
                } catch (e) {
                    reject({error: e, stderr, stdout});
                }
            });
        });
    }

    private static filterKeys(obj: { [name: string]: any }, keys: string[]){
        if(!Array.isArray(keys)) {
            keys = [keys];
        }
        const reducer = function(accumulator: { [name: string]: any }, currentValue: string) {
            if(obj[currentValue]) {
                accumulator[currentValue] = obj[currentValue];
            }
            return accumulator;
        };
        return keys.reduce((reducer), {});
    }
}
