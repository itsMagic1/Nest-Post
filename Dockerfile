FROM node:24.1.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main" ]

