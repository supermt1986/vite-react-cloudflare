# Vite + React + Hono + Cloudflare Workers 模板项目说明文档

## 项目概述

这是一个使用 React、Vite、Hono 和 Cloudflare Workers 构建的全栈 Web 应用模板。该模板提供了一个最小化的设置，用于快速开发和部署现代 Web 应用程序到 Cloudflare 的全球网络。

项目特点：
- 使用 React 19.0.0 构建用户界面
- 利用 Vite 6.0.0 提供快速的开发体验
- 通过 Hono 4.8.2 实现后端 API 路由
- 部署到 Cloudflare Workers 实现全球边缘计算

## 技术栈

- **前端框架**: React 19.0.0
- **构建工具**: Vite 6.0.0
- **后端框架**: Hono 4.8.2
- **部署平台**: Cloudflare Workers
- **语言**: TypeScript 5.8.3

## 项目结构

```
.
├── src/
│   ├── react-app/           # React 前端应用
│   │   ├── assets/          # 静态资源文件
│   │   ├── App.css          # 应用样式
│   │   ├── App.tsx          # 主应用组件
│   │   ├── main.tsx         # 应用入口文件
│   │   └── vite-env.d.ts    # Vite 环境声明文件
│   └── worker/              # Cloudflare Worker 后端服务
│       └── index.ts         # Hono 后端路由
├── public/                  # 静态公共资源目录
├── dist/                    # 构建输出目录
├── index.html               # 主 HTML 文件
├── vite.config.ts           # Vite 配置文件
├── wrangler.json            # Cloudflare Workers 配置文件
├── package.json             # 项目依赖和脚本配置
└── README.md                # 项目说明文件
```

## 核心功能

### 前端功能

前端应用基于 React 构建，在 [App.tsx](file:///Users/song.chen/AI/lingma/vite-react-cloudflare/src/react-app/App.tsx) 中实现了以下功能：

1. 计数器功能 - 演示状态管理
2. API 数据获取 - 从后端获取数据并展示
3. 多 Logo 展示 - 展示技术栈相关链接

### 后端功能

后端使用 Hono 框架实现，在 [src/worker/index.ts](file:///Users/song.chen/AI/lingma/vite-react-cloudflare/src/worker/index.ts) 中定义了简单的 API 路由：

```typescript
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));
```

该路由返回一个包含 name 字段的 JSON 对象。

## 开发指南

### 环境要求

- Node.js >= 18
- npm 或 pnpm 包管理器

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 上可用。

### 构建生产版本

```bash
npm run build
```

### 本地预览构建

```bash
npm run preview
```

### 部署到 Cloudflare Workers

```bash
npm run build && npm run deploy
```

## 配置文件说明

### Vite 配置 ([vite.config.ts](file:///Users/song.chen/AI/lingma/vite-react-cloudflare/vite.config.ts))

使用了两个主要插件：
1. `@vitejs/plugin-react` - React 支持
2. `@cloudflare/vite-plugin` - Cloudflare 集成

### Cloudflare Workers 配置 ([wrangler.json](file:///Users/song.chen/AI/lingma/vite-react-cloudflare/wrangler.json))

定义了项目名称、入口文件、兼容性设置和静态资源目录等配置。

## 开发流程

1. 前端开发：修改 [src/react-app/](file:///Users/song.chen/AI/lingma/vite-react-cloudflare/src/react-app) 目录下的文件
2. 后端开发：修改 [src/worker/index.ts](file:///Users/song.chen/AI/lingma/vite-react-cloudflare/src/worker/index.ts) 文件添加 API 路由
3. 实时预览：运行 `npm run dev` 进行实时开发和调试
4. 构建部署：运行 `npm run build && npm run deploy` 部署到 Cloudflare

## 扩展建议

1. 添加更多 API 路由以处理复杂业务逻辑
2. 集成数据库（如 Cloudflare D1）
3. 添加身份验证和授权机制
4. 实现服务端渲染（SSR）或静态站点生成（SSG）
5. 添加测试框架确保代码质量

## 相关文档

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)