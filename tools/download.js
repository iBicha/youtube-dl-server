const fs = require('fs')
const request = require("request");

const isWin = process.platform === "win32";
const destFolder = './tools/bin'

const tools = [{
    url: 'https://yt-dl.org/downloads/latest/youtube-dl' + (isWin ? '.exe' : ''),
    destFile:  destFolder + '/youtube-dl' + (isWin ? '.exe' : '')
}, {
    url: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp' + (isWin ? '.exe' : ''),
    destFile:  destFolder + '/yt-dlp' + (isWin ? '.exe' : '')
}]

async function download(url, dest) {
    await new Promise((resolve, reject) => {
        request(url, function (err) {
            if (err){
                reject(err);
                return;
            }
            resolve();
        }).pipe(fs.createWriteStream(dest))
    })
}

fs.mkdirSync(destFolder, {recursive: true});

(async () => {
    try {
        for (let i=0; i<tools.length; i++){
            const tool = tools[i];
            await download(tool.url, tool.destFile);
            if(!isWin) {
                fs.chmodSync(tool.destFile, '755');
            }
            console.log(`Successfully downloaded "${tool.url}" to "${tool.destFile}"`);
        }
    } catch (e) {
        console.error(e);
        process.abort()
    }
})();
