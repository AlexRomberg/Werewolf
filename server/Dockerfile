# Build stage
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Run stage
FROM node:26-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:26-alpine
ENV NODE_ENV=production
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
  /opt/yarn* /usr/local/bin/yarn /usr/local/bin/yarnpkg
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/health >/dev/null || exit 1
CMD ["node", "dist/main.js"]
