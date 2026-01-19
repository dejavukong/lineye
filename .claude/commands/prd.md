---
description: 从 PRD 文档开始开发。分析需求并指导架构、数据库、后端、前端开发。
argument-hint: PRD 文档路径
---

# PRD 驱动开发

你正在帮助开发者根据 PRD 文档实现功能。遵循系统化方法：深入分析 PRD，理解代码库，澄清所有模糊点，设计架构，然后逐层实现。

## Core Principles

- **PRD 理解优先**: 深入分析 PRD，提取所有功能需求、用户故事和验收标准
- **主动澄清问题**: 识别 PRD 中的模糊点、边界情况和未定义行为，在设计前解决
- **理解先于行动**: 探索代码库，理解现有模式和架构
- **读取 agents 返回的文件**: 读取 agents 返回的关键文件列表，构建详细上下文
- **简洁优雅**: 优先考虑可读、可维护、架构合理的代码
- **使用 TodoWrite**: 全程跟踪进度

---

## Phase 1: PRD 分析

**Goal**: 深入理解 PRD 文档，提取所有开发需求

PRD 文档路径: $ARGUMENTS

**Actions**:
1. 创建包含所有阶段的 todo 列表
2. 仔细阅读并分析 PRD 文档
3. 提取并整理：
   - 核心功能和特性
   - 用户故事和用例
   - 验收标准
   - 非功能性需求（性能、安全等）
   - 技术约束
4. 向用户展示需求摘要，使用 AskUserQuestion 确认理解是否正确

---

## Phase 2: Codebase Exploration

**Goal**: 理解相关的现有代码、模式和架构

**Actions**:
1. 并行启动 2-3 个 code-explorer agents，每个 agent 应：
   - 专注于与 PRD 需求相关的不同方面
   - 全面追踪代码流程
   - 返回 5-10 个关键文件列表

   **Example agent prompts**:
   - "查找与 [PRD 功能] 类似的功能，追踪其实现"
   - "映射 [受影响区域: database/trpc/web] 的架构，关注模式"
   - "分析现有的 [组件/API/schema] 实现作为参考"

2. 读取 agents 识别的所有文件，建立深入理解
3. 向用户展示发现的模式和受影响的代码区域

---

## Phase 3: Clarifying Questions

**Goal**: 在设计架构前解决所有模糊点

**CRITICAL**: 这是最重要的阶段之一，不要跳过。

**Actions**:
1. 审查 PRD、代码库发现和提取的需求
2. 识别未明确的方面：
   - PRD 未涵盖的边界情况
   - 错误处理要求
   - 数据验证规则
   - 未指定的 UI/UX 细节
   - API 契约细节
   - 性能预期
   - 向后兼容性问题
3. **使用 AskUserQuestion 以清晰、有组织的形式向用户提出所有问题**
4. **等待答案后再进行架构设计**

如果用户说"你觉得怎样就怎样"，提供你的建议并获得明确确认。

---

## Phase 4: Architecture Design

**Goal**: 设计多种实现方案，明确权衡取舍

**Actions**:
1. 并行启动 2-3 个 code-architect agents，关注不同方向：
   - 最小改动方案（最小变更，最大复用）
   - 整洁架构方案（可维护性，优雅抽象）
   - 务实平衡方案（速度 + 质量）

2. 每个 agent 应提供：
   - 数据库 schema 变更
   - tRPC API 设计
   - 前端组件结构
   - 数据流图（文本形式）

3. 审查所有方案并形成你的建议
4. 向用户展示：每种方案的简要总结、权衡对比表、**你的建议及理由**
5. **使用 AskUserQuestion 询问用户偏好哪种方案**

---

## Phase 5: Implementation

**Goal**: 按 database → backend → frontend 顺序实现功能

**DO NOT START WITHOUT USER APPROVAL**

**Actions**:

### 5.1 Database Layer
1. 在 `packages/database/src/schema/` 中设计 Drizzle schemas
2. 遵循现有模式（参考 `users.ts`）
3. 定义表关系和索引
4. 从 `index.ts` 导出
5. 运行迁移：`pnpm db:generate && pnpm db:migrate`
6. 验证迁移成功

### 5.2 Backend Layer
1. 在 `packages/trpc/src/router.ts` 中添加 tRPC 路由
2. 实现 Zod 验证 schemas
3. 遵循现有路由模式
4. 实现业务逻辑

### 5.3 Frontend Layer
1. 在 `apps/web/src/` 中创建 React 组件
2. 从 `@repo/ui/components/*` 使用 shadcn/ui
3. 集成 tRPC hooks 进行数据获取
4. 实现 UI 交互和状态管理
5. 遵循现有组件模式

### 5.4 Integration Verification
1. 运行完整验证：`pnpm type-check && pnpm lint && pnpm build`
2. 手动测试完整功能流程
3. 验证 PRD 中的所有验收标准是否满足
4. 修复发现的任何集成问题
5. 更新 todos

---

## Phase 6: Quality Review

**Goal**: 确保代码质量、正确性和规范一致性

**Actions**:
1. 并行启动 3 个 code-reviewer agents，关注不同方面：
   - 简洁性、DRY 原则和代码优雅度
   - Bug、边界情况和功能正确性
   - 项目规范和架构一致性

2. 整合发现并识别最高优先级问题
3. **使用 AskUserQuestion 向用户展示发现并询问如何处理**：
   - 立即修复关键问题
   - 为次要问题创建后续任务
   - 按现状继续
4. 根据用户决定处理问题

---

## Phase 7: Summary

**Goal**: 记录完成的工作

**Actions**:
1. 将所有 todos 标记为完成
2. 总结：
   - 实现的功能（映射到 PRD 需求）
   - 做出的关键架构决策
   - 创建/修改的文件
   - 已知限制或延迟项
   - 建议的后续步骤或改进

---
