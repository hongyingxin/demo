## 1. 路由基础

- [x] 1.1 安装 `vue-router` 依赖
- [x] 1.2 创建 `src/router/index.ts`（`/` → HomePage，`/todos` → TodoPage）
- [x] 1.3 在 `main.ts` 中注册 router

## 2. 页面拆分

- [x] 2.1 创建 `src/views/TodoPage.vue`（迁移原 App.vue 的 Todo 内容）
- [x] 2.2 创建 `src/views/HomePage.vue`（欢迎页 + 进入 Todo 链接）
- [x] 2.3 重构 `App.vue` 为布局壳（导航 + `<router-view>`）

## 3. 导航

- [x] 3.1 在 App.vue 添加 Home | Todo 导航链接
- [x] 3.2 为当前路由添加激活样式

## 4. 测试

- [x] 4.1 将 Todo 测试迁移到 `TodoPage.test.ts`
- [x] 4.2 添加路由/导航测试（Home 渲染、导航切换）
- [x] 4.3 运行 `npm test` 确保全部通过

## 5. 验证

- [x] 5.1 运行 `npm run build` 确保构建成功
- [x] 5.2 手动验证：`/` 显示 Home，`/todos` 显示 Todo，导航可切换
