FROM node:20-alpine as base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY . .
RUN pnpm i --frozen-lockfile && pnpm prisma generate && pnpm build
CMD ["node","dist/server.js"]