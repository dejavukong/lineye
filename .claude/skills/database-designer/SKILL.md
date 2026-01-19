---
name: database-designer
description: 根据需求设计 Drizzle ORM schemas。用于创建新数据库表、定义关系或规划数据模型。
allowed-tools: Read, Write, Edit, Bash
---

# 数据库设计

## 位置
`packages/database/src/schema/`

## 设计流程

### 1. 分析需求
- 从 PRD 中识别实体
- 为每个实体定义属性
- 确定关系（1:1, 1:N, N:M）

### 2. 创建 Schema

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const posts = sqliteTable('posts', {
  // Primary key with UUID
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

  // Required fields
  title: text('title').notNull(),

  // Optional fields
  content: text('content'),

  // Foreign keys
  userId: text('user_id').notNull().references(() => users.id),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Type exports
export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
```

### 3. 导出 Schema

更新 `packages/database/src/schema/index.ts`：
```typescript
export * from './posts';
```

### 4. 生成迁移

```bash
pnpm db:generate
pnpm db:migrate
```

## 约定
- 表名：复数形式，snake_case
- 列名：snake_case
- 始终包含 id, createdAt, updatedAt
- ID 使用 text（UUID）
- 日期使用 integer 配合 mode: 'timestamp'
