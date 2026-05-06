FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "pnpm exec prisma generate && pnpm exec prisma db push && pnpm exec tsx watch src/app/index.ts"]
