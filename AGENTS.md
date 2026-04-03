# JS-Webs 项目准则

本文档定义了 JS-Webs 项目的概览、开发规范、架构原则，旨在确保项目的一致性和可维护性。

---

## 项目概览

**项目名**: JS-Webs  
**目标**: JavaScript/Web 开发入门练习（前端 + 后端 + 基础语法）  
**创建日期**: 2026-04-03  
**架构模式**: 四个独立子项目（非 Workspace 模式）  
**前端分离**: React 和 Vue 两个框架分别实现，便于对比学习

---

## 架构原则

### 核心设计决策

1. **四个独立子项目**，而非单一仓库
   - 各子项目完全独立，各自有 `package.json`、`tsconfig.json`、`node_modules`
   - 每个项目可独立启动、构建、测试
   - 前端分为 React 和 Vue 两个子项目，便于框架对比学习
   - 优势：概念清晰，适合入门学习；劣势：依赖冗余，后期可升级为 pnpm workspace

2. **语义清晰的职责划分**
   - **language-basics**: 纯 JavaScript/TypeScript 语法学习，无框架依赖
   - **frontend-react**: 浏览器端开发，React 18 + Vite（UI、交互、状态管理）
   - **frontend-vue**: 浏览器端开发，Vue 3 + Vite（UI、交互、状态管理），与 React 对比学习
   - **backend**: Node.js 服务端，Express（路由、API、业务逻辑）

### 全局约定

| 配置项 | 规范 | 说明 |
|-------|-----|------|
| **Node.js** | >= 22.22.0 (LTS) | 现代特性与稳定性保障 |
| **包管理器** | npm（当前）或 pnpm（后续升级） | npm 零学习成本，pnpm 性能更优 |
| **模块系统** | ES Module (`"type": "module"`) | 统一使用现代模块标准 |
| **TypeScript** | ^5.3.3 | 严格类型检查，开启 `strict: true` |
| **私有标记** | `"private": true` | 防止意外发布到 npm |

---

## 目录规范

### 根目录结构

```
JS-Webs/
├── language-basics/         # 子项目
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/                 # 源码
│   ├── dist/                # 编译输出（不提交）
│   └── node_modules/        # 依赖（不提交）
├── frontend-react/          # 子项目
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── src/
│   ├── dist/
│   ├── node_modules/
│   └── index.html           # Vite 入口
├── frontend-vue/            # 子项目
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── src/
│   ├── dist/
│   ├── node_modules/
│   └── index.html           # Vite 入口
├── backend/                 # 子项目
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   ├── dist/
│   └── node_modules/
├── .gitignore               # 忽略规则
├── README.md                # 项目说明
└── AGENTS.md                # 本文件
```

### 路径别名约定

**language-basics**:
- `@/*` → `src/*`

**frontend-react**:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@utils/*` → `src/utils/*`

**frontend-vue**:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@utils/*` → `src/utils/*`

**backend**:
- `@/*` → `src/*`
- `@routes/*` → `src/routes/*`
- `@controllers/*` → `src/controllers/*`
- `@models/*` → `src/models/*`
- `@middleware/*` → `src/middleware/*`
- `@utils/*` → `src/utils/*`


---
# 注意事项

- 此`AGENTS.md`文件的修改必须获得我的批准，不可擅自增加内容。