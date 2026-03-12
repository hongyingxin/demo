# Micro-App Demo

这是一个基于 [micro-app](https://github.com/micro-zoe/micro-app) 的微前端 Demo。

## 项目结构
- `main-app`: 基座应用 (Vue 3 + Vite)
- `sub-app`: 子应用 (Vue 3 + Vite)

## 如何运行

1. 分别进入 `main-app` 和 `sub-app` 目录执行 `npm install`。
2. 在两个终端分别运行 `npm run dev`。
   - `main-app` 运行在 `http://localhost:3000`
   - `sub-app` 运行在 `http://localhost:3001`
3. 访问 `http://localhost:3000` 查看效果。

## 注意事项
- 子应用已配置 CORS 跨域。
- 主应用通过 `<micro-app>` 标签加载子应用。
