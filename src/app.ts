import express from 'express';
const cors = require('cors');
const compression = require('compression')

import {YoutubeDl} from "./YoutubeDl";

const app = express();
const port = process.env.PORT || 3000;

app.use(compression())
app.use(cors())

app.get('/v1/video', async (req, res) => {
    try {
        const url = req.query.url as string;
        const options = req.query.options as string;
        if(!url){
            res.status(400);
            res.send('Missing url');
            return;
        }
        let schema = req.query.schema as string[];
        let metadata = await YoutubeDl.getVideoMetadata(url, options, schema);
        res.json(metadata);
    } catch (e) {
        console.error(e)
        res.status(500);
        res.send(e);
    }
});

app.get('/watch', async (req, res) => {
    try {
        const v = req.query.v as string;
        const options = req.query.options as string;
        if(!v){
            res.status(400);
            res.send('Missing video id!');
            return;
        }
        let metadata = await YoutubeDl.getVideoMetadata(v, options, ['url']);
        res.redirect(metadata.url);
    } catch (e) {
        console.error(e)
        res.status(500);
        res.send(e);
    }
});

if (process.env.ENABLE_STREAMING) {
    app.get('/v1/stream/audio', async (req, res) => {
        try {
            const url = req.query.url as string;
            const input = req.query.input as string;
            const output = req.query.output as string;
            if(!url){
                res.status(400);
                res.send('Missing url');
                return;
            }
            YoutubeDl.sendAudioStream(url, res, input, output);
        } catch (e) {
            console.error(e)
            res.status(500);
            res.send(e);
        }
    });
}
else
{
    app.get('/v1/stream/audio', async (req, res) => {
        res.status(403);
        res.send("Streaming is disabled on this server. Use ENABLE_STREAMING environment variable to enable this feature.");
    });
}

app.listen(port, () => {
    return console.log(`server is listening on http://localhost:${port}`);
});
