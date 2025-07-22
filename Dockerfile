FROM node:22-alpine

WORKDIR /usr/src/app

COPY build /usr/src/app/build
COPY package.json /usr/src/app
COPY pnpm-lock.yaml /usr/src/app

RUN npm install -g pnpm
RUN pnpm install

ENV BODY_SIZE_LIMIT=Infinity

EXPOSE 3000

CMD ["node", "build"]