FROM node:18-alpine AS base
ARG APP_NAME=app

FROM base AS source
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=$APP_NAME --docker


# install
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=source /app/out/json/ .
COPY --from=source /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=source /app/turbo.json ./turbo.json
RUN corepack enable
RUN pnpm install --frozen-lockfile

# build
COPY --from=source /app/out/full/ .
RUN pnpm dlx turbo run build --filter=$APP_NAME


FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/$APP_NAME/next.config.js .
COPY --from=installer /app/apps/$APP_NAME/package.json .
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/static ./apps/$APP_NAME/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/public ./apps/$APP_NAME/public

EXPOSE 8080
ENV PORT 8080
ENV APP_NAME=$APP_NAME

CMD node apps/${APP_NAME}/server.js