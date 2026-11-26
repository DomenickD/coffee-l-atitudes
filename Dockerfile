# Multi-stage production Dockerfile for Coffee Latitudes on Railway
FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Generate Prisma client and build standalone Next.js app
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Minimal production runtime
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema/migrations and the full node_modules for startup `prisma migrate
# deploy` — the Prisma CLI has transitive deps (e.g. `effect`) hoisted to the top level
# of node_modules, not nested under node_modules/prisma or node_modules/@prisma.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000

# Invoke Prisma's entry file directly: copying node_modules/.bin/prisma (a symlink)
# across build stages dereferences it into a flat file, which breaks its __dirname-relative
# lookup of the WASM schema engine.
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
