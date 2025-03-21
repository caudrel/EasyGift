FROM node:20.9.0-alpine3.17

WORKDIR /app
COPY package*.json ./
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN node -e "require('events').EventEmitter.defaultMaxListeners = 20"
RUN npm i
COPY tsconfig.json tsconfig.json
COPY tailwind.config.ts tailwind.config.ts
# COPY next-env.d.ts next-env.d.ts
COPY postcss.config.js postcss.config.js
COPY next.config.mjs next.config.mjs
COPY components.json components.json
COPY public public
COPY src src

CMD npm run dev
