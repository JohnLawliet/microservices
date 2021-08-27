FROM node:16-alpine

ENV CI=true

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY ./ ./

CMD ["yarn", "start"]