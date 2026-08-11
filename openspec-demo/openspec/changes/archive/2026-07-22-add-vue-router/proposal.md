## 背景与动机

当前 Todo 应用是单页结构，打开即显示 Todo，缺少 Home 页和多页面导航。引入 Vue Router 后，可按 URL 区分 Home 与 Todo，为后续扩展更多页面打基础。

## 变更内容

- 安装并配置 `vue-router`
- 新增 Home 页（`/`）和 Todo 页（`/todos`）
- 新增全局顶部导航（Home | Todo）
- 将现有 Todo 逻辑从 `App.vue` 迁移到 `TodoPage.vue`
- `App.vue` 改为布局壳（导航 + `<router-view>`）
- 更新相关测试

## 目标

- 用户可通过 `/` 访问 Home 页，通过 `/todos` 访问 Todo 应用
- 顶部导航可在页面间切换
- Todo 现有行为（`todo-ui` spec）保持不变

## 范围

### 包含

- Vue Router 集成
- Home 页、Todo 页、顶部导航
- 路由与导航相关测试

### 不包含

- 路由守卫、登录鉴权
- 404 页面（可后续添加）
- 嵌套路由、动态路由
- 修改 Todo 业务逻辑（`todo-ui` 不变）

## Capabilities

### 新增能力

- `app-routing`：应用路由、Home/Todo 页面访问与顶部导航行为

### 修改能力

（无——`todo-ui` 行为不变，仅迁移到 `/todos` 路由）

## 影响

- 新增依赖：`vue-router`
- 新增：`src/router/index.ts`、`src/views/HomePage.vue`、`src/views/TodoPage.vue`
- 修改：`src/App.vue`、`src/main.ts`、`src/__tests__/App.test.ts`
