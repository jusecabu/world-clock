# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Raíz Horaria — imagen de producción (Astro SSR + @astrojs/node standalone)
# Dokploy construye esta imagen con el tipo de build "Dockerfile".
# ---------------------------------------------------------------------------

ARG NODE_VERSION=24-alpine
ARG PNPM_VERSION=12.4.2

# ---- Base: Node + pnpm ------------------------------------------------------
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app

# ---- Dependencias de producción (solo lo que necesita el servidor) ---------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ---- Build -------------------------------------------------------------------
FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
# URL pública: la usan canonical, Open Graph y el sitemap (se fija en el build).
ARG SITE_URL
ENV SITE_URL=${SITE_URL}
ENV ASTRO_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Runtime -----------------------------------------------------------------
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node
EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
