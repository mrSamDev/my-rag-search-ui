FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Update packages for security patches
RUN apk update && apk upgrade

# Copy package files
COPY package.json bun.lock ./

# Install ALL dependencies (including dev) for building
RUN bun install --frozen-lockfile

# Copy source & build
COPY . .
RUN bun run build

# ---------- Runtime ----------
FROM nginx:alpine

# Update packages for security patches
RUN apk update && apk upgrade --no-cache

# Create custom nginx config for port 3003
RUN echo 'server { \
    listen 3003; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache"; \
    } \
    \
    location /assets { \
        try_files $uri =404; \
        expires 1y; \
        add_header Cache-Control "public"; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3003
CMD ["nginx", "-g", "daemon off;"]