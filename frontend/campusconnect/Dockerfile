# ─── Stage 1: Build ─────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2: Serve with Nginx ──────────────────────────────
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add rate limiting zone (referenced in nginx.conf)
RUN echo 'limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;' > /etc/nginx/conf.d/rate-limit.conf

# Non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
