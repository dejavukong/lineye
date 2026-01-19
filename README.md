# MVP Starter

> Full-stack monorepo: Vite + React, Fastify + tRPC, Drizzle + SQLite

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui |
| Backend | Fastify, tRPC |
| Database | Drizzle ORM, SQLite |
| Tooling | pnpm, Turborepo, TypeScript, ESLint, Vitest |

## Structure

```
apps/
  web/          # React SPA (port 3000)
  api/          # Fastify API (port 3001)
packages/
  ui/           # shadcn/ui components
  database/     # Drizzle ORM + schema
  trpc/         # tRPC router definitions
  shared/       # Shared types & utils
```

## Commands

```bash
pnpm install        # Install deps
pnpm dev            # Start all apps
pnpm build          # Build all
pnpm test           # Run tests
pnpm db:studio      # Open Drizzle Studio
```

## Package Dependencies

```
web  → ui, trpc, shared
api  → database, trpc, shared
trpc → database, shared
```
