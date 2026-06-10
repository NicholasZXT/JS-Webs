
# 目录

[TOC]

# 概览

`pi-agents`包含4个基础模块：

- `pi-ai`: LLM-API
- `pi-agent-core`: Agent runtime
- `pi-coding-agent`: 交互式编程Agent CLI
- `pi-tui`: Terminal UI库

------
# `pi-ai`


------
# `pi-agent-core`

源码（v0.78.0）结构如下：
- `index.ts`
- `types.ts`
- `agent.ts`
- `agent-loop.ts`
- `harness`目录
  - `types.ts`
  - `agent-harness.ts`
  - `messages.ts`
  - `system-prompt.ts`
  - `promtp-template.ts`
  - `skills.ts`
  - `agent-harness.ts`
  - `compaction`目录
  - `env`目录
  - `session`目录
  - `utils`目录
- `proxy.ts`
- `node.ts`

看了下源码，这个package主要分为两个部分：

## 基本Agent实现

主要涉及如下源码

- `index.ts`
- `types.ts`
- `agent.ts`
- `agent-loop.ts`

其中 `agent.ts` 定义了 `Agent` 类，`agent-loop.ts` 实现了 Agent-Loop 流程。

这个Agent-Loop的源码实现不复杂，很精简，值得看看。

不过这个Agent-Loop里并不包含 Skills 等功能的接入，这些功能在下面的 AgentHarness 实现里。

## AgentHarness实现

主要涉及如下源码：

- `index.ts`
- `types.ts`
- `harness`目录
  - `types.ts`
  - `agent-harness.ts`
  - `messages.ts`
  - `system-prompt.ts`
  - `promtp-template.ts`
  - `skills.ts`
  - `agent-harness.ts`
  - `compaction`目录
  - `env`目录
  - `session`目录
  - `utils`目录

此处 AgentHarness 的实现依赖于基本Agent的 Low-Level Agent-Loop实现，主要是`agent-loop.ts`里的内容。

------
# `pi-coding-agent`


------
# `pi-tui`



------
# Pi-