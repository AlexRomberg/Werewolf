FROM node:26-alpine AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY server/src/protocol.ts /app/server/src/protocol.ts
COPY frontend/ ./
RUN npx ng build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/frontend/dist/frontend/browser /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
