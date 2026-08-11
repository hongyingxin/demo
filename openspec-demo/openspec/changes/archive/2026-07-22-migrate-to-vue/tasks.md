## 1. 工程脚手架

- [x] 1.1 安装 Vue/Vite 依赖（`vue`、`vite`、`@vitejs/plugin-vue`、`@vue/test-utils`、`happy-dom`、`vue-tsc`）
- [x] 1.2 创建 `index.html`、`vite.config.ts`、`env.d.ts`，调整 `tsconfig.json`
- [x] 1.3 更新 `package.json` scripts（`dev`、`build`、`test`），移除 `tsx`/`@types/node`
- [x] 1.4 创建 `src/main.ts` 和 `src/App.vue` 入口骨架，确认 `npm run dev` 可启动

## 2. Todo 核心逻辑

- [x] 2.1 实现 `src/composables/useTodos.ts`（数据模型 `{ id, text, completed }`）
- [x] 2.2 实现添加 Todo（非空校验、清空输入框）
- [x] 2.3 实现切换完成状态和删除 Todo
- [x] 2.4 实现 localStorage 读写（key: `openspec-demo:todos`），操作后自动保存

## 3. UI 组件

- [x] 3.1 创建 `TodoForm.vue`（输入框 + 添加按钮）
- [x] 3.2 创建 `TodoItem.vue`（checkbox + 文本 + 删除按钮，完成态样式）
- [x] 3.3 创建 `TodoList.vue`（列表容器，空列表提示）
- [x] 3.4 在 `App.vue` 中组装组件，联通 `useTodos`

## 4. 测试

- [x] 4.1 配置 Vitest 使用 `happy-dom` 环境
- [x] 4.2 创建 `useTodos` 单元测试（添加、拒绝空内容、切换完成、删除、持久化）
- [x] 4.3 创建 `App.vue` 集成测试（空列表提示、添加后渲染）
- [x] 4.4 运行 `npm test` 确保全部通过

## 5. 清理与文档

- [x] 5.1 删除 `src/index.ts` 和 `src/__tests__/health.test.ts`
- [x] 5.2 更新 `README.md`（Vue 前端项目说明、开发命令）
- [x] 5.3 更新 `openspec/config.yaml` 技术栈为 Vue 3 + Vite

## 6. 验证

- [x] 6.1 运行 `npm run build` 确保构建成功
- [x] 6.2 手动验证：添加、完成、删除、刷新后数据保留
