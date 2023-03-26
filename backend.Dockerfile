FROM node:19-alpine AS builder

WORKDIR /app

COPY prisma/ src/ package*.json tsconfig.json ./

RUN npm install && npx tsc

# --------------

FROM node:19-alpine

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build/ ./build
COPY prisma/ ./prisma

RUN npm install --omit=dev

# --------------

EXPOSE 4000

CMD ["npm", "run", "prod"]
