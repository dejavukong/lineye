---
name: code-quality
description: 通过类型检查、linting 和测试验证代码质量。在提交前、修改后或修复错误时使用。
allowed-tools: Bash, Read
---

# 代码质量验证

## 快速检查

一次运行所有检查：

```bash
pnpm type-check && pnpm lint:fix && pnpm format && pnpm build
```

## 单独命令

| 命令 | 用途 |
|------|------|
| `pnpm type-check` | TypeScript 类型错误 |
| `pnpm lint` | ESLint 检查 |
| `pnpm lint:fix` | 自动修复 lint 问题 |
| `pnpm format` | Prettier 格式化 |
| `pnpm build` | 构建所有包 |
| `pnpm test` | 运行所有测试 |
| `pnpm clean` | 清理构建产物 |

## 包级别命令

```bash
# 仅 Web 应用
pnpm --filter @repo/web type-check
pnpm --filter @repo/web test

# 仅 API
pnpm --filter @repo/api type-check
pnpm --filter @repo/api test

# 单个测试文件
pnpm --filter @repo/web vitest run src/App.test.tsx
```

## 常见问题及修复

### 类型错误

**问题**：Cannot find module '@repo/xxx'
**解决**：检查 package.json exports，验证导入路径

**问题**：Property 'xxx' does not exist
**解决**：检查 `packages/database/src/schema/index.ts` 中的 schema 导出

### Lint 错误

**问题**：未使用的 imports/variables
**解决**：`pnpm lint:fix` 自动移除

**问题**：导入顺序问题
**解决**：`pnpm lint:fix` 自动排序

### 构建失败

**问题**：Module not found
**解决**：`pnpm clean && pnpm install`

**问题**：Turbo 缓存问题
**解决**：`pnpm clean` 然后重新构建

### 数据库错误

**问题**：迁移失败
**解决**：检查 schema 语法，先运行 `pnpm db:generate`

## 提交前清单

提交前：

- [ ] `pnpm type-check` 通过
- [ ] `pnpm lint` 通过
- [ ] `pnpm build` 成功
- [ ] `pnpm test` 通过（如果有测试）
- [ ] 代码中没有留下 console.log

## CI 流水线顺序

```bash
1. pnpm install
2. pnpm type-check
3. pnpm lint
4. pnpm build
5. pnpm test
```
