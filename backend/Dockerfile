FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src

CMD npm start



