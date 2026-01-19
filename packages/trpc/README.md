# @repo/trpc

> tRPC router definitions

## Tech

tRPC server, Zod, @repo/database

## Structure

```
src/
  trpc.ts        # tRPC init
  context.ts     # Request context ({ db })
  router.ts      # API routes
  index.ts       # Exports
```

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `health` | query | Health check |
| `user.list` | query | Get all users |
| `user.getById` | query | Get user by ID |
| `user.create` | mutation | Create user |
| `user.delete` | mutation | Delete user |

## Usage

```typescript
// Server
import { appRouter, createContext } from '@repo/trpc';

// Client type
import type { AppRouter } from '@repo/trpc';
```
