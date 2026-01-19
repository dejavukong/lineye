# @repo/database

> Drizzle ORM with SQLite

## Tech

Drizzle ORM, better-sqlite3, SQLite

## Structure

```
src/
  client.ts      # createDatabase()
  schema/        # Table definitions
    users.ts
migrations/      # SQL migrations
data/sqlite.db   # Database file
```

## Schema: users

| Column | Type | Note |
|--------|------|------|
| id | integer | PK auto |
| email | text | unique |
| name | text | |
| createdAt | integer | timestamp |
| updatedAt | integer | timestamp |

## Commands

```bash
pnpm db:generate  # Generate migration
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio
```

## Usage

```typescript
import { createDatabase, users, User, NewUser } from '@repo/database';
const db = createDatabase('./data/sqlite.db');
```
