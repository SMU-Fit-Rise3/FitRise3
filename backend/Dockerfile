FROM node:20.12.0-alpine

WORKDIR app/nodejs

COPY . .

RUN npm install --production

EXPOSE 8083

CMD ["node", "server.js"]