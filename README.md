# JS-Webs

JavaScript-Web 开发实践

## 📁 项目结构

本项目采用**四个独立子项目**的结构，分别用于前端（React/Vue）、后端和基础语法练习。

```
JS-Webs/
├── language-basics/         📚 JavaScript/TypeScript 基础语法学习
├── frontend-react/          ⚛️  前端 React 实战项目（React 18 + Vite）
├── frontend-vue/            🖖 前端 Vue 实战项目（Vue 3 + Vite）
├── backend/                 🔧 后端实战项目（Node.js + Express）
├── .gitignore
└── README.md
```

## 🎯 各子项目概述

### 1. `language-basics` - 基础语法练习

**用途**: 学习 JavaScript/TypeScript 的核心语法、数据类型、函数、异步编程等。

**进入方式**:
```bash
cd language-basics
npm install
npm run dev          # 启动 TypeScript Watch 模式，监听文件变化
npm run build        # 编译 TypeScript 到 dist/
npm run type-check   # 检查类型
```

**项目特点**:
- 纯粹的语法练习，不依赖前后端框架
- 编译输出到 `dist/` 目录
- 支持路径别名 `@/*` → `src/*`

---

### 2. `frontend-react` - 前端 React 实战项目

**用途**: 学习 React 组件、状态管理、路由、页面交互等前端开发技能。

**进入方式**:
```bash
cd frontend-react
npm install
npm run dev          # 启动 Vite 开发服务器（默认 http://localhost:5173）
npm run build        # 构建生产版本
npm run preview      # 预览构建后的站点
npm run type-check   # 检查 TypeScript 类型
```

**项目特点**:
- 基于 Vite + React 18，开发体验好
- 支持热更新（HMR）
- 支持路径别名 `@/*`, `@components/*`, `@pages/*` 等
- 开启 TypeScript 严格模式

---

### 3. `frontend-vue` - 前端 Vue 实战项目

**用途**: 学习 Vue 3 组件、Composition API、路由、状态管理等。

**进入方式**:
```bash
cd frontend-vue
npm install
npm run dev          # 启动 Vite 开发服务器（默认 http://localhost:5174）
npm run build        # 构建生产版本
npm run preview      # 预览构建后的站点
npm run type-check   # 检查 TypeScript 类型
```

**项目特点**:
- 基于 Vite + Vue 3，开发体验好
- 使用单文件组件（.vue），代码更简洁
- 支持 Composition API 与 <script setup> 语法糖
- 支持路径别名 `@/*`, `@components/*`, `@pages/*` 等
- 开启 TypeScript 严格模式

---

### 4. `backend` - 后端实战项目

**用途**: 学习 Node.js/Express 的路由、中间件、API 设计、数据处理等后端开发技能。

**进入方式**:
```bash
cd backend
npm install
npm run dev          # 启动开发模式（tsx watch），监听文件变化自动重启
npm run build        # 编译 TypeScript 到 dist/
npm run start        # 运行编译后的 JavaScript
npm run type-check   # 检查 TypeScript 类型
```

**项目特点**:
- 基于 Express，轻量且容易上手
- 使用 tsx 支持直接运行 TypeScript
- 支持路径别名 `@/*`, `@routes/*`, `@controllers/*` 等
- 开启 TypeScript 严格模式

---

## 📦 依赖概览

| 子项目 | 主要依赖 | 开发工具 |
|-------|--------|--------|
| language-basics | 无 | TypeScript |
| frontend-react | React, React-DOM | Vite, TypeScript, @types/* |
| frontend-vue | Vue 3 | Vite, TypeScript, @vitejs/plugin-vue |
| backend | Express | TypeScript, tsx, @types/* |

---

## 🚀 快速开始

### 单个项目启动

```bash
# React 前端项目
cd frontend-react && npm install && npm run dev

# Vue 前端项目
cd frontend-vue && npm install && npm run dev

# 后端项目
cd backend && npm install && npm run dev

# 基础语法练习
cd language-basics && npm install && npm run dev
```

### 批量命令（后续升级为 Workspace 后可用）

未来当升级为 pnpm workspace 时，可在根目录执行：

```bash
pnpm install         # 一键安装所有子项目依赖
pnpm dev             # 启动所有子项目开发服务
pnpm build           # 构建所有子项目
pnpm type-check      # 检查所有子项目的类型
```

---

## 📋 相关文档

- **TypeScript 配置**: 每个子项目都有独立的 `tsconfig.json`，支持路径别名和严格类型检查
- **Node 版本要求**: >= 22.22.0 (LTS)
- **包管理器**: npm（也可迁移至 pnpm）

---

## 📝 学习路线（建议）

1. **从 language-basics 开始**：掌握 JS/TS 基础
2. **进入 frontend-react**：学习 React 与浏览器交互（推荐先学）
3. **进入 frontend-vue**：对比学习 Vue，理解框架差异（可选）
4. **进入 backend**：学习 Node.js 与服务端逻辑
5. **前后端联动**：将前端与后端对接，实现完整功能

---

## 🔄 后续升级计划

当项目规模扩大时，可考虑以下升级：

- [ ] 引入 pnpm workspace 进行统一依赖管理
- [ ] 配置共享的 ESLint / Prettier
- [ ] 添加联合测试框架（Jest / Vitest）
- [ ] 搭建 CI/CD 流程

---

Happy Learning! 🎉
