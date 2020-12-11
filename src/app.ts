import express from 'express';
const cors = require('cors');
import {YoutubeDl} from "./YoutubeDl";

const app = express();
const port = process.env.PORT || 3000;

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
