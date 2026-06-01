/**
 * llm-apps 入口文件
 *
 * 本子项目用于练习 TS/JS 生态中 LLM 应用开发的各类框架和工具。
 * 已集成以下框架/模块（在 package.json dependencies 中）：
 *   - LiteLLM — 多模型统一调用
 *   - Vercel AI SDK — 统一的 AI 模型调用接口
 *   - Zod — 结构化输出定义
 *   - LangChain.js / LangGraph.js — 链式调用与 Agent 编排
 *   - Mastra — AI Agent 框架
 *   - LlamaIndex — 数据索引与 RAG
 */

console.log("🤖 llm-apps — LLM 应用开发练习");
console.log("=".repeat(40));
console.log("已集成框架：");
console.log("  • LangChain.js / LangGraph.js");
console.log("  • Vercel AI SDK (@ai-sdk/openai, ai-sdk-ollama)");
console.log("  • Mastra");
console.log("  • LlamaIndex");
console.log("  • LiteLLM");
console.log("  • Zod (结构化输出)");
console.log("  • dotenv (环境变量管理)");
console.log("=".repeat(40));
console.log("目录结构：");
console.log("  src/");
console.log("    ├── hello.ts       # 入口");
console.log("    ├── agents/        # AI Agent 练习");
console.log("    ├── chains/        # 链/工作流练习");
console.log("    ├── tools/         # 工具函数");
console.log("    └── utils/         # 工具函数");
console.log("");
