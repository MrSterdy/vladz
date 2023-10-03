FROM oven/bun:1.0.3 as build

ARG DATABASE_URL
ARG TELEGRAM_BOT_TOKEN
ARG ADMIN_ID

ENV DATABASE_URL=$DATABASE_URL
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
ENV ADMIN_ID=$ADMIN_ID

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

RUN bun run prisma:generate

RUN bun run check
RUN bun run build

FROM oven/bun:1.0.3 as prod

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/bun.lockb .
COPY --from=build /app/build .

RUN bun install

EXPOSE 3000

CMD ["bun", "index.js"]