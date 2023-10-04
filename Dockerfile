FROM node:18.16.1-alpine3.17 as build

ARG DATABASE_URL
ARG TELEGRAM_BOT_TOKEN
ARG ADMIN_ID

ENV DATABASE_URL=$DATABASE_URL
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
ENV ADMIN_ID=$ADMIN_ID

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run check
RUN npm run build

FROM node:18.16.1-alpine3.17 as prod

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/build .

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "index.js"]