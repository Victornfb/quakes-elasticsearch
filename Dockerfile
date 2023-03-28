FROM node:16.14.0-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --production

COPY . .

RUN sleep 10

CMD ["pnpm", "start:prod"]
