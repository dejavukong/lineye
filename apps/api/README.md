# @repo/api

> Fastify server with tRPC

## Tech

Fastify 5, tRPC server, @repo/database, @repo/trpc

## Structure

```
src/
  main.ts        # Server entry (port 3001)
```

## Endpoints

| Path | Description |
|------|-------------|
| `/trpc/*` | tRPC API |
| `/health` | Health check |

## Commands

```bash
pnpm dev         # Dev server :3001
pnpm build       # Compile TypeScript
```
