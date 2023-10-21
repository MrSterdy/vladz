FROM node:18.16.1-alpine3.17 as build

ARG DATABASE_URL
ARG TELEGRAM_BOT_TOKEN
ARG ADMIN_ID
ARG MINIO_ENDPOINT
ARG MINIO_PORT
ARG MINIO_SSL
ARG MINIO_ACCESS_KEY
ARG MINIO_SECRET_KEY
ARG PUBLIC_MAX_FILES
ARG PUBLIC_MAX_FILE_SIZE
ARG ORIGIN
ARG BODY_SIZE_LIMIT

ENV DATABASE_URL=$DATABASE_URL
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
ENV ADMIN_ID=$ADMIN_ID
ENV MINIO_ENDPOINT=$MINIO_ENDPOINT
ENV MINIO_PORT=$MINIO_PORT
ENV MINIO_SSL=$MINIO_SSL
ENV MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
ENV MINIO_SECRET_KEY=$MINIO_SECRET_KEY
ENV PUBLIC_MAX_FILES=$PUBLIC_MAX_FILES
ENV PUBLIC_MAX_FILE_SIZE=$PUBLIC_MAX_FILE_SIZE
ENV ORIGIN=$ORIGIN
ENV BODY_SIZE_LIMIT=$BODY_SIZE_LIMIT

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run check
RUN npm run build

FROM node:18.16.1-alpine3.17 as prod

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/build .

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "index.js"]