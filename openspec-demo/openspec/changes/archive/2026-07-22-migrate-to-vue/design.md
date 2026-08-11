## Context

项目当前为 Node.js HTTP 后端（`src/index.ts` 提供 `/health`），配套 Vitest 集成测试。OpenSpec 主规范中有 `health` capability，与即将转向的前端 Todo 应用方向不符。本次变更将整个 `src/` 重写为纯 Vue 3 SPA，无后端依赖。

## Goals / Non-Goals

**Goals:**

- 用 Vite + Vue 3 + TypeScript 搭建可运行的前端工程
- 实现 Todo UI（添加、完成、删除）及 localStorage 持久化
- 用 `@vue/test-utils` + Vitest 覆盖核心 UI 行为
- 清理旧后端代码，更新项目配置与文档

**Non-Goals:**

- 后端 API、数据库、用户认证
- Vue Router、Pinia、UI 组件库
- SSR / SSG（Nuxt）
- 复杂样式与响应式布局

## Decisions

### Decision 1: 使用 Vite + Vue 3（Composition API + `<script setup>`）

**选择：** Vite 作为构建工具，Vue 3 Composition API

**理由：** Vite 是 Vue 生态官方推荐方案，HMR 快、配置少；Composition API 便于将 Todo 逻辑抽离到 composable，测试友好。

**备选方案：** Nuxt 3 — 全栈能力强，但对纯 SPA demo 过重；Webpack — 配置复杂，无优势。

### Decision 2: 状态管理用 composable + localStorage

**选择：** `useTodos()` composable 管理 todos 数组，读写 `localStorage`（key: `openspec-demo:todos`）

**理由：** 无需 Pinia 等额外依赖；数据模型简单（`{ id, text, completed }`）；刷新页面后数据保留，满足持久化需求。

**备选方案：** Pinia — 状态可扩展性好，但当前仅一个 feature，引入成本不必要；内存存储 — 无法实现持久化 spec 要求。

### Decision 3: 组件拆分

**选择：**

```
App.vue
├── TodoForm.vue    — 输入 + 添加按钮
├── TodoList.vue    — 列表容器
└── TodoItem.vue    — 单项（checkbox + 文本 + 删除）
```

**理由：** 职责清晰，便于单独测试 TodoForm（添加）和 TodoItem（完成/删除）。

### Decision 4: 测试策略

**选择：** Vitest + `@vue/test-utils` + `happy-dom` 环境

**理由：** 延续项目已有 Vitest 习惯；组件测试覆盖 spec 中的 UI 场景；happy-dom 轻量，无需真实浏览器。

**测试范围：**
- `useTodos` composable：添加、切换完成、删除、localStorage 读写
- `App.vue` 集成：空列表提示、添加后渲染

### Decision 5: 项目文件布局

**选择：**

```
openspec-demo/
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json
├── env.d.ts
└── src/
    ├── main.ts
    ├── App.vue
    ├── components/
    ├── composables/useTodos.ts
    └── __tests__/
```

**理由：** 标准 Vite+Vue 结构，与 OpenSpec 约定（代码在 `src/`，测试在 `src/__tests__/`）一致。

## Risks / Trade-offs

- [localStorage 不可用（隐私模式）] → 降级为内存存储，不阻塞 UI；测试中 mock localStorage
- [删除后端后 health spec 失效] → 归档变更时移除 `openspec/specs/health/`
- [config.yaml 仍写 Node.js 技术栈] → 实施阶段同步更新为 Vue 技术栈
- [无 UI 库，界面较朴素] → 符合 Non-Goals，后续变更可加

## Migration Plan

1. 安装 Vue/Vite 依赖，新增 `index.html`、`vite.config.ts` 等配置文件
2. 创建 Vue 入口与 Todo 组件/composable
3. 编写组件测试，验证通过
4. 删除 `src/index.ts`、`src/__tests__/health.test.ts`
5. 更新 `package.json` scripts、移除 `tsx`/`@types/node`
6. 更新 `README.md`、`openspec/config.yaml`
7. 归档变更时移除 `health` spec，合并 `todo-ui` spec

**Rollback：** Git revert 即可恢复 Node 后端版本；localStorage 数据独立于代码。

## Open Questions

（无——探索阶段已确认纯 Vue SPA + localStorage 方案）
