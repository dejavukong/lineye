---
name: backend-developer
description: 实现带有适当验证的 tRPC API 端点。用于创建后端路由、实现业务逻辑或添加 API 功能。
allowed-tools: Read, Write, Edit, Bash
---

# 后端开发

## 位置
`packages/trpc/src/router.ts`

## 实现模式

### 1. 添加 Router

```typescript
import { posts } from '@repo/database';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  // ... existing routes

  post: router({
    // List all
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(posts);
    }),

    // Get by ID
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id));
        return result[0] ?? null;
      }),

    // Create
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().optional(),
        userId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db
          .insert(posts)
          .values(input)
          .returning();
        return result[0];
      }),

    // Update
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const result = await ctx.db
          .update(posts)
          .set(data)
          .where(eq(posts.id, id))
          .returning();
        return result[0] ?? null;
      }),

    // Delete
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db
          .delete(posts)
          .where(eq(posts.id, input.id))
          .returning();
        return result[0] ?? null;
      }),
  }),
});
```

### 2. 验证

```bash
pnpm type-check
```

## 错误处理

```typescript
import { TRPCError } from '@trpc/server';

if (!result) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Resource not found',
  });
}
```

## 常见错误码

| Code | 使用场景 |
|------|----------|
| `NOT_FOUND` | 资源不存在 |
| `BAD_REQUEST` | 无效输入 |
| `UNAUTHORIZED` | 未认证 |
| `FORBIDDEN` | 无权限 |
| `INTERNAL_SERVER_ERROR` | 服务器错误 |
