## 1. HTTP 服务

- [x] 1.1 在 `src/index.ts` 中用 `node:http` 创建 HTTP 服务器
- [x] 1.2 实现 `GET /health` 路由，返回 `{ "status": "ok" }` 和 200 状态码
- [x] 1.3 对未知路径返回 404
- [x] 1.4 支持 `PORT` 环境变量，默认 3000

## 2. 测试

- [x] 2.1 创建 `src/__tests__/health.test.ts`
- [x] 2.2 测试 `GET /health` 返回 200 和正确 JSON
- [x] 2.3 测试未知路径返回 404

## 3. 验证

- [x] 3.1 运行 `npm test` 确保全部通过
