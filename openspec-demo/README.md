# OpenSpec Demo

用一个小型 **Todo 前端应用** 练习 [OpenSpec](https://github.com/openspec-cn/openspec) 规范驱动开发（Spec-Driven Development）。

核心理念：**先对齐规范，再写代码** — 人和 AI 在编码前就「做什么」达成一致。

## 前置条件

- Node.js >= 20.19
- OpenSpec CLI（已全局安装：`npm install -g @openspeccn/openspec@latest`）

## 项目结构

```
openspec-demo/
├── index.html
├── vite.config.ts
├── openspec/
│   ├── specs/          # 单一事实来源 — 系统当前行为
│   ├── changes/        # 进行中的变更（每个功能一个文件夹）
│   └── config.yaml     # 项目上下文与规则
├── .cursor/
│   ├── commands/       # /opsx:* 斜杠命令
│   └── skills/         # OpenSpec 技能文件
└── src/                # Vue 前端代码（由 OpenSpec 工作流驱动编写）
    ├── App.vue
    ├── components/
    ├── composables/
    └── __tests__/
```

## 快速开始

### 方式一：引导式入门（推荐首次使用）

在 Cursor 聊天中输入：

```
/opsx:onboard
```

AI 会带你完整走一遍：选题 → 提案 → 规范 → 设计 → 任务 → 实现 → 归档。

### 方式二：直接开始一个变更

```
/opsx:new my-feature
```

然后按提示依次创建工件：

| 命令 | 作用 |
|------|------|
| `/opsx:continue` | 逐步创建下一个工件 |
| `/opsx:ff` | 快进 — 一次性生成 proposal + specs + design + tasks |
| `/opsx:apply` | 按 tasks.md 逐任务实现代码 |
| `/opsx:verify` | 验证实现与规范的一致性 |
| `/opsx:archive` | 归档变更，合并 spec 到主规范 |

## CLI 常用命令

```bash
openspec list                    # 查看活跃变更
openspec status --change <name>  # 查看工件进度
openspec validate --all          # 校验规范格式
openspec show <name>             # 查看变更详情
openspec archive <name>          # 归档已完成变更
```

## 开发

```bash
npm install
npm run dev      # 启动 Vite 开发服务器
npm run build    # 构建生产版本
npm test         # 运行测试
```

## 工作流示意

```
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
  创建变更      生成工件       实现代码        验证一致性        合并规范
```

## 参考

- [OpenSpec 快速开始](https://github.com/openspec-cn/openspec/blob/main/docs/getting-started.md)
- [OpenSpec 实战指南](https://github.com/ForceInjection/OpenSpec-practise/blob/main/docs/openspec-practical-guide.md)
