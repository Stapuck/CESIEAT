FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json ./
COPY src ./src/

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Créer le répertoire uploads avec les bonnes permissions
RUN mkdir -p /app/uploads && \
    chown -R hono:nodejs /app/uploads && \
    chmod -R 755 /app/uploads

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

# Exposer le port 3002 (correspondant à PORT dans index.ts)
EXPOSE 3002

# Configurer le volume pour persister les données
VOLUME ["/app/uploads"]

USER hono

CMD ["node", "/app/dist/index.js"]