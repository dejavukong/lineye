---
paths:
  - "apps/web/**/*.tsx"
---

# React 代码规范

- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- 从 `@repo/ui/components/*` 导入 UI 组件
- 通过 React Query（经由 tRPC）管理状态
- 避免过度使用 useEffect
- 优先使用组合而非 prop drilling
