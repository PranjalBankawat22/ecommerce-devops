FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# NEXT_PUBLIC_ vars are baked in at build time — pass them as build args
ARG NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:4001
ARG NEXT_PUBLIC_CART_SERVICE_URL=http://localhost:4002
ENV NEXT_PUBLIC_PRODUCT_SERVICE_URL=$NEXT_PUBLIC_PRODUCT_SERVICE_URL
ENV NEXT_PUBLIC_CART_SERVICE_URL=$NEXT_PUBLIC_CART_SERVICE_URL

COPY . .
RUN npm run build

# ---- runner ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
