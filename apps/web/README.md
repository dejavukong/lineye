# @repo/web

> React SPA with tRPC client

## Tech

React 19, Vite, Tailwind CSS 4, @tanstack/react-query, tRPC, @repo/ui

## Structure

```
src/
  main.tsx       # Entry point
  App.tsx        # Root component
  lib/trpc.ts    # tRPC client
```

## Commands

```bash
pnpm dev         # Dev server :3000
pnpm build       # Production build
```

## Usage

```typescript
// tRPC
import { trpc } from '@/lib/trpc';
const { data } = trpc.user.list.useQuery();

// UI Components (subpath imports)
import { Button } from '@repo/ui/components/button';
import { Card, CardHeader } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
```
