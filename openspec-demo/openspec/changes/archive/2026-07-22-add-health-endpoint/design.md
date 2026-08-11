## Context

`src/index.ts` 目前只有一行 `console.log` 占位代码。项目已配置 TypeScript + Vitest，但没有 HTTP 框架依赖。后续将在此基础上扩展 Todo API。

## Goals / Non-Goals

**Goals:**

- 启动最小可运行的 HTTP 服务
- 实现 `/health` 端点，供本地开发和部署探针使用
- 用 Vitest 覆盖核心行为

**Non-Goals:**

- 引入 Express/Fastify 等框架
- 实现 Todo CRUD
- 添加中间件、日志库、CORS 等

## Decisions

### Decision 1: 使用 Node.js 内置 `http` 模块

**选择：** `node:http` 原生模块

**理由：** 健康检查只需处理单个路由，无需框架开销。保持依赖最少，后续 Todo API 可再评估是否引入框架。

**备选方案：** Express — 功能更丰富，但对当前任务过重。

### Decision 2: 端口通过环境变量配置

**选择：** 读取 `process.env.PORT`，默认 `3000`

**理由：** 符合 12-factor 惯例，便于 Docker / k8s 部署。

### Decision 3: 路由匹配精确路径

**选择：** 仅匹配 `req.method === 'GET' && req.url === '/health'`

**理由：** 简单明确，避免误匹配。后续 Todo 路由可扩展为路由表。

## Risks / Trade-offs

- [原生 http 路由扩展性有限] → 当前仅 1 个端点，Todo API 阶段再重构
- [无 graceful shutdown] → 开发阶段可接受，生产部署时再补充
