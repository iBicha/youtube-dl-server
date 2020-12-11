const fs = require('fs')
const request = require("request");

const url = 'https://yt-dl.org/downloads/latest/youtube-dl'
const destFolder = './tools/bin'
const destFile = destFolder + '/youtube-dl'

function download(url, dest, cb) {
    request(url, cb).pipe(fs.createWriteStream(dest))
}

fs.mkdirSync(destFolder, {recursive: true});
download(url, destFile, function (err) {
    if(err) {
        throw err;
    }
    fs.chmodSync(destFile, '755');
})
