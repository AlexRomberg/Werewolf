FROM node:26-alpine AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY server/src/protocol.ts /app/server/src/protocol.ts
COPY frontend/ ./
# Keep `ng build` inside a small server's RAM. Each worker thread gets its own
# V8 heap, so cap the heap size and cut the worker count rather than only one.
# Raise BUILD_MEMORY_MB with `--build-arg BUILD_MEMORY_MB=...` if the build OOMs inside node.
ARG BUILD_MEMORY_MB=768
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
