# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

全栈 TypeScript monorepo：Vite + React 前端，Fastify + tRPC 后端，Drizzle ORM + SQLite 数据库。

## 常用命令

```bash
# 开发
pnpm dev                    # 启动所有应用 (web:3000, api:3001)
pnpm build                  # 构建所有包
pnpm clean                  # 清理 node_modules, dist, .turbo

# 测试
pnpm test                   # 运行所有测试
pnpm --filter @repo/web test          # 单独运行 web 测试
pnpm --filter @repo/api test          # 单独运行 api 测试
pnpm --filter @repo/web vitest run src/App.test.tsx  # 运行单个测试文件

# 代码质量
pnpm lint                   # ESLint 检查
pnpm lint:fix               # ESLint 自动修复
pnpm format                 # Prettier 格式化
pnpm type-check             # TypeScript 类型检查

# 数据库
pnpm db:generate            # 生成 Drizzle 迁移
pnpm db:migrate             # 执行迁移
pnpm db:studio              # 打开 Drizzle Studio
```

## 架构

### 包依赖关系

```
web  → ui, trpc, shared
api  → database, trpc, shared
trpc → database, shared
```

### tRPC 全栈类型流

1. `packages/database/src/schema/` - Drizzle schema 定义表结构和类型
2. `packages/trpc/src/router.ts` - tRPC 路由使用 Zod 验证，引用 database schema
3. `apps/api/src/main.ts` - Fastify 挂载 tRPC 路由，注入数据库连接
4. `apps/web/src/lib/trpc.ts` - React Query 封装的 tRPC 客户端
5. 前端组件直接调用 `trpc.user.list.useQuery()` 获得完整类型推导

### UI 组件导入

使用 subpath 导入（不是 barrel 导出）：

```typescript
// Correct
import { Button } from '@repo/ui/components/button';
import { Card, CardHeader } from '@repo/ui/components/card';
import { cn } from '@repo/ui/lib/utils';

// Wrong - no barrel export
import { Button } from '@repo/ui';
```

添加新组件：`cd packages/ui && npx shadcn@latest add [component]`

### 路由端点

| 端点 | 类型 | 说明 |
|------|------|------|
| `health` | Query | API 健康检查 |
| `user.list` | Query | 获取所有用户 |
| `user.getById` | Query | 按 ID 获取用户 |
| `user.create` | Mutation | 创建用户 |
| `user.delete` | Mutation | 删除用户 |

## 关键文件

| 文件 | 用途 |
|------|------|
| `apps/web/src/App.tsx` | 前端主组件 |
| `apps/web/src/lib/trpc.ts` | tRPC 客户端配置 |
| `apps/api/src/main.ts` | Fastify 服务器入口 |
| `packages/trpc/src/router.ts` | tRPC 路由定义 |
| `packages/database/src/schema/` | 数据库表定义 |
| `packages/ui/src/components/` | shadcn/ui 组件 |

## 环境变量

```bash
# api/.env
PORT=3001
DATABASE_URL=./data/sqlite.db
CORS_ORIGIN=http://localhost:3000

# web/.env
VITE_API_URL=http://localhost:3001
```

## 添加新功能流程

### 添加新数据表

1. `packages/database/src/schema/` 创建表定义文件
2. 在 `packages/database/src/schema/index.ts` 导出
3. `pnpm db:generate` 生成迁移
4. `pnpm db:migrate` 执行迁移

### 添加新 API 端点

1. `packages/trpc/src/router.ts` 添加路由
2. 使用 Zod 定义输入验证
3. 前端自动获得类型推导

### 添加新页面/组件

1. `apps/web/src/` 创建组件
2. 使用 `@repo/ui/components/*` 导入 UI 组件
3. 使用 `trpc.xxx.useQuery()` 调用 API

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| 类型错误 | `pnpm type-check` 定位，确保 schema 导出正确 |
| 构建失败 | `pnpm clean && pnpm install && pnpm build` |
| UI 导入报错 | 使用 subpath: `@repo/ui/components/button` |
| 数据库连接失败 | 检查 `DATABASE_URL`，执行 `pnpm db:migrate` |

## 代码规范

- **导入顺序**: React → 外部库 → @repo/* → 相对路径
- **组件命名**: PascalCase
- **文件命名**: kebab-case（组件除外）
- **类型导出**: 使用 `export type` 而非 `export`
