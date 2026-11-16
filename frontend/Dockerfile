# Built from the repository root (see docker-compose.yml): the app imports the socket protocol
# from server/src/protocol.ts.

# Build stage: the Angular app as static files.
FROM node:26-alpine AS build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY server/src/protocol.ts /app/server/src/protocol.ts
COPY frontend/ ./
RUN npx ng build

# Run stage: nginx serves the app and proxies the room server.
FROM nginx:1.29-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
