# This Dockerfile uses `serve` npm package to serve the static files with node process.
# You can find the Dockerfile for nginx in the following link:
# https://github.com/refinedev/dockerfiles/blob/main/vite/Dockerfile.nginx
FROM refinedev/node:20 AS base

FROM base AS deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder

ENV NODE_ENV=production

COPY --from=deps /app/refine/node_modules ./node_modules

COPY . .

# Pridane argumenty pre build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

# Tieto premenne musia byt dostupne pocas buildu
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production

# Pin version and expose port explicitly
RUN npm install -g serve@14

COPY --from=builder /app/refine/dist ./

USER refine

EXPOSE 3000

# Added -s for SPA routing (rewrites to index.html on 404)
# Added -l 3000 to be explicit about port
CMD ["serve", "-s", ".", "-l", "3000"]
