# ------------------------------------------------------
# Stage 1: Install Dependencies
# ------------------------------------------------------
FROM node:22-alpine AS base

ENV PNPM_VERSION=10.10.0

# Declare build arguments at the top level
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && apk upgrade
RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm@$PNPM_VERSION
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store \
  pnpm install --frozen-lockfile

# ------------------------------------------------------
# Stage 2: Build the application
# ------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Re-declare build arguments in this stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/pnpm-lock.yaml ./
COPY --from=deps /app/prisma ./prisma/

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN pnpm tsc --project tsconfig.json
RUN pnpm prisma generate --no-hints

RUN --mount=type=secret,id=EMAIL_SERVER_PASSWORD \
  --mount=type=secret,id=AUTH_GOOGLE_SECRET \  
  echo "EMAIL_SERVER_PASSWORD=$(cat /run/secrets/EMAIL_SERVER_PASSWORD)" >> .env.local && \
  echo "AUTH_GOOGLE_SECRET=$(cat /run/secrets/AUTH_GOOGLE_SECRET)" >> .env.local && \
  pnpm run build

# ------------------------------------------------------
# Stage 3: Run the production container
# ------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

# Install curl for healthchecks
RUN apk update && apk upgrade 
RUN apk add --no-cache curl

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.env.local ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

COPY --chmod=755 docker-entrypoint.sh ./entrypoint.sh

# Install Prisma CLI globally
RUN npm install -g @prisma/client prisma tsx prisma-json-types-generator

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ENV PORT=3000
EXPOSE $PORT
ENV HOSTNAME=0.0.0.0 

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]