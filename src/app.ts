import express from 'express';
import {YoutubeDl} from "./YoutubeDl";

const app = express();
const port = 3000;

app.get('/*', async (req, res) => {
    try {
        const url = req.originalUrl.substr(1);
        const metadata = await YoutubeDl.getVideoMetadata(url);
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
