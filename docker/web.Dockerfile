FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY . .
RUN pnpm i --frozen-lockfile
CMD ["pnpm","dev","--host"]