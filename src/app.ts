import express from 'express';
const cors = require('cors');
import {YoutubeDl} from "./YoutubeDl";
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

app.get('/v1/video/stream', async (req, res) => {
    try {
        if (process.env.STREAMING_DISABLED){
            res.status(403);
            res.send('STREAMING_DISABLED');
            return;
        }
        const url = req.query.url as string;
        const options = req.query.options as string;
        if(!url){
            res.status(400);
            res.send('Missing url');
            return;
        }
        const metadata = await YoutubeDl.getVideoMetadata(url, options);
        fetch(metadata.url).then(response => {
            res.status(response.status);
            response.headers.forEach((value, key) => {
                res.set(key, value);
            });
            response.body.pipe(res);
        })
    } catch (e) {
        console.error(e)
        res.status(500);
        res.send(e);
    }
});

app.get('/v1/video', async (req, res) => {
    try {
        const url = req.query.url as string;
        const options = req.query.options as string;
        if(!url){
            res.status(400);
            res.send('Missing url');
            return;
        }
        const metadata = await YoutubeDl.getVideoMetadata(url, options);
        res.json(metadata);
    } catch (e) {
        console.error(e)
        res.status(500);
        res.send(e);
    }
});

app.listen(port, () => {
    return console.log(`server is listening on http://localhost:${port}`);
});
