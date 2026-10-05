# ---- Stage 1: build the static frontend ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps first for cache efficiency
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci

# Copy source
COPY apps/web/ ./

# Nuxt reads NUXT_PUBLIC_* at build time, but our runtime uses
# relative /api paths, so no secrets are baked into the bundle.
ENV NUXT_PUBLIC_USE_MOCKS=false
RUN npm run generate

# ---- Stage 2: serve with Nginx ----
FROM nginx:1.27-alpine

# Remove entrypoint script that rewrites listen directives
RUN rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Copy generated static site
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Copy Nginx config
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]