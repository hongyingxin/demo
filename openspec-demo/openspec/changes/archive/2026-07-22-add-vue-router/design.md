## 背景

项目当前为单页 Todo 应用：`App.vue` 直接渲染 Todo 组件，无路由。本次引入 Vue Router，拆分 Home 与 Todo 页面，并添加全局导航。

## 目标 / 非目标

**目标：**

- `/` 显示 Home 页，`/todos` 显示 Todo 应用
- 全局顶部导航支持 Home ↔ Todo 切换
- Todo 组件与 `useTodos` 逻辑复用，不重复实现

**非目标：**

- 404、路由守卫、懒加载优化
- 修改 `todo-ui` 行为

## 决策

### 决策 1：使用 Vue Router 4（与 Vue 3 配套）

**选择：** `vue-router` + `createWebHistory`

**理由：** Vue 3 官方路由方案，History 模式适合 Vite SPA。

### 决策 2：页面与布局拆分

**选择：**

```
App.vue           ← 布局：nav + <router-view>
views/HomePage.vue
views/TodoPage.vue  ← 原 App.vue 的 Todo 内容
router/index.ts
```

**理由：** `App.vue` 只做壳，页面逻辑放 `views/`，符合 Vue 惯例。

### 决策 3：路由表

| 路径 | 组件 | 说明 |
|---|---|---|
| `/` | `HomePage` | 欢迎页 + 进入 Todo 链接 |
| `/todos` | `TodoPage` | 现有 Todo 功能 |

### 决策 4：导航实现

**选择：** `App.vue` 内 `<nav>` + `<router-link to="/">` / `<router-link to="/todos">`

**理由：** 仅两个链接，无需独立 Nav 组件。

### 决策 5：测试策略

- `TodoPage.test.ts`：从原 `App.test.ts` 迁移 Todo 相关测试
- `App.test.ts` 或 `router.test.ts`：测导航切换、Home/Todo 路由渲染
- `useTodos.test.ts`：不变

## 风险与权衡

- [测试需注入 router] → 使用 `@vue/test-utils` 的 `global.plugins: [router]`
- [直接访问 /todos 书签] → History 模式需 Vite dev server 支持，默认已支持
