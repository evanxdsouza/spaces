# TEST ONLY: runs the API as a long-lived server (migrations and the
# auto-stop job run on start, see src/index.js). Build from the repo root.
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY src ./src
COPY migrations ./migrations
COPY in-space.md knexfile.js ./
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "src/index.js"]
