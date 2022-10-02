FROM node:18-alpine3.15

WORKDIR /usr/src/app

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

COPY . .

RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]