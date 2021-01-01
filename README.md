# youtube-dl-server
A youtube-dl web server, powered by youtube-dl.

Intended to provide raw video url and other metadata as a json payload, not as a streaming server.

## Getting started
```
npm install
npm start
```

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## API

```
GET /v1/video?url=YOUTUBE_URL_HERE
```
