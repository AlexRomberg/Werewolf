FROM node:26-alpine AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY server/src/protocol.ts /app/server/src/protocol.ts
COPY frontend/ ./
# Keep `ng build`'s memory bounded. Each worker thread gets its own V8 heap of
# this size, so also cut the worker count. The floor is set by @lucide/angular:
# its single 11.5 MB bundle goes through Babel in one worker, which runs out of
# heap at 768 MB. Override with `--build-arg BUILD_MEMORY_MB=...`.
# The deploy server does not build this image; CI does (see docker-compose.yml).
ARG BUILD_MEMORY_MB=2048
ENV NODE_OPTIONS=--max-old-space-size=${BUILD_MEMORY_MB} \
    NG_BUILD_MAX_WORKERS=1 \
    NG_BUILD_PARALLEL_TS=0 \
    GOMEMLIMIT=256MiB
RUN npx ng build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/frontend/dist/frontend/browser /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
