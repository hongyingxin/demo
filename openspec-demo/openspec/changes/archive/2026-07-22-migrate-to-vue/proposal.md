## Why

项目当前是 Node.js HTTP 后端 demo，与 Todo 应用方向不符。改为纯 Vue 前端 SPA，更适合用 OpenSpec 规范 UI 行为，同时去掉不必要的后端复杂度。

## What Changes

- **BREAKING** 删除 Node HTTP 服务（`src/index.ts`）及 health 测试
- **BREAKING** 归档并移除 `openspec/specs/health/` 规范
- 搭建 Vite + Vue 3 + TypeScript 前端工程
- 实现 Todo UI：添加、标记完成、删除、localStorage 持久化
- 更新 `package.json`、`README.md`、`openspec/config.yaml`

## Goals

- 建立可运行的 Vue 前端项目骨架
- 用 OpenSpec 规范 Todo UI 交互行为
- 保留 Vitest，改用 `@vue/test-utils` 做组件测试

## Scope

### In Scope

- Vite + Vue 3 + TypeScript 脚手架
- Todo 列表 CRUD（前端 + localStorage）
- 组件测试
- 清理旧后端代码与 health spec

### Out of Scope

- 后端 API、数据库
- Vue Router、Pinia
- UI 组件库与复杂样式

## Capabilities

### New Capabilities

- `todo-ui`: Todo 前端应用的 UI 交互与 localStorage 持久化行为

### Modified Capabilities

（无——`health` 为后端能力，整体移除而非修改）

## Impact

- `src/` 重写为 Vue 结构（`main.ts`、`App.vue`、components、composables）
- 新增依赖：`vue`、`vite`、`@vitejs/plugin-vue`、`@vue/test-utils`、`vue-tsc`
- 移除依赖：`tsx`、`@types/node`
- 脚本改为 `vite dev`、`vite build`、`vitest`
