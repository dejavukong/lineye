---
paths:
  - "packages/trpc/**/*.ts"
---

# tRPC 代码规范

- 使用 Zod 验证所有输入
- Query 用于读取，Mutation 用于写入
- 使用 TRPCError 抛出错误
- 将复杂查询拆分为 sub-routers
- 保持 procedures 职责单一
