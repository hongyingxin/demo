## Why

项目目前只有占位入口，无法验证服务是否在运行。添加 `GET /health` 端点可以启动最小 HTTP 服务，并为后续 Todo API 提供可探测的基础。

## What Changes

- 用 Node.js 内置 `http` 模块替换 `src/index.ts` 中的占位代码
- 新增 `GET /health`，返回 `{ "status": "ok" }`
- 服务监听可配置端口（默认 3000）
- 补充对应测试

## Goals

- 本地 `npm run dev` 后可访问 `http://localhost:3000/health`
- 响应时间 < 10ms（内存响应，无外部依赖）

## Scope

**In Scope：** HTTP 服务启动、健康检查端点、基础测试

**Out of Scope：** Todo CRUD、数据库、认证、Express 等框架

## Capabilities

### New Capabilities

- `health`: 服务健康状态探测

### Modified Capabilities

（无）

## Impact

- `src/index.ts`：从占位代码改为 HTTP 服务入口
- `src/__tests__/health.test.ts`：新增
