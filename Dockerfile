# ── Stage 1: Build ──────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies first (cached unless package files change)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source
COPY . .

# Vite reads VITE_* vars from .env / .env.production at build time.
# No ARGs needed — .env files are the single source of truth.
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────
FROM nginx:stable-alpine

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our SPA-aware config and built assets
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
