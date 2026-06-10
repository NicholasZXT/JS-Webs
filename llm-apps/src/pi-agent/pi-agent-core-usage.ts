// 练习 pi-agent-core 使用
import type {
  Static, TSchema,  // 这个是由 TypeBox 提供的类型别名
  Api, Provider, KnownProvider, ModelThinkingLevel, Transport, 
  StreamOptions, SimpleStreamOptions, ProviderStreamOptions,
  Model, Tool, ToolCall, Usage, StopReason,
  AssistantMessage, UserMessage, ToolResultMessage, Message,
  AssistantMessageEvent,
  Context,
} from "@earendil-works/pi-ai";
import {
  Type,  // 这个是由 TypeBox 提供的类型构造函数
  getProviders, getModels, getModel,
  stream, complete, streamSimple, completeSimple,
  AssistantMessageEventStream, 
  validateToolArguments, validateToolCall
} from "@earendil-works/pi-ai";
import type {
  AgentOptions, AgentLoopConfig, AgentMessage, AgentState, AgentContext, AgentEvent, 
  AgentTool, AgentToolCall, ToolExecutionMode, QueueMode,
  BeforeToolCallContext, AfterToolCallContext,
  AgentToolResult, BeforeToolCallResult, AfterToolCallResult,
  // 来自 agent/harness/types.ts
  AgentHarnessOptions, ExecutionEnv,
  Skill, AgentHarnessStreamOptions, CompactionSettings,
  SessionContext, SessionMetadata, SessionStorage,
} from "@earendil-works/pi-agent-core";
import { 
  Agent, 
  agentLoop, runAgentLoop, runAgentLoopContinue, 
  loadPromptTemplates, loadSkills,
  convertToLlm,
  // 来自 agent/harness
  AgentHarness, Session,
  InMemorySessionRepo,
  FileError, ExecutionError,
} from "@earendil-works/pi-agent-core";


function getOllamaModelConfig(): {
  ollamaModel: Model<"openai-completions">;
  options: ProviderStreamOptions;
} {
  
  // 配置模型基本信息
  const ollamaModelLabel = "qwen3.5:9b";
  const ollamaModel: Model<"openai-completions"> = {
    id: ollamaModelLabel,
    name: `${ollamaModelLabel}(Ollama)`,
    api: "openai-completions",
    provider: "ollama",
    baseUrl: "http://localhost:11434/v1",
    reasoning: false,
    // thinkingLevelMap: {},
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 32000,
  };
  console.log(">>> Ollama Model:\n", ollamaModel);

  // 配置模型选项
  // 注意，API-KEY是在这里配置，如果不配置，则会尝试从环境变量里获取
  const options: ProviderStreamOptions = {
    // model-specific options can be added here if needed
    apiKey: "OLLAMA_API_KEY",
  };
  console.log(">>> Ollama Model Options:\n", options);

  return { ollamaModel, options };
}


async function showAgentBasicUsage(): Promise<void> {

  const { ollamaModel, options } = getOllamaModelConfig();

  const agentOptions: AgentOptions = {
    initialState: {
      systemPrompt: "You are a helpful assistant.",
      model: ollamaModel,
    },
    getApiKey: async (provider: string) => {
      if (provider === "ollama") {
        return options.apiKey;
      }else {
        return undefined;
      }
    },
  };

  const agent = new Agent(agentOptions);

  agent.subscribe((event: AgentEvent) => {
    if (event.type === "agent_start"){
        console.log("\n>>> Agent starting...")
    }
  });

 agent.subscribe((event: AgentEvent) => {
    if (event.type === "agent_end"){
        console.log("\n>>> Agent ending")
    }
  });

 agent.subscribe((event: AgentEvent) => {
    if (event.type === "message_start"){
        console.log("\n>>> Agent message starting...")
        console.log(`role: ${event.message.role}`)
    }
  });

 agent.subscribe((event: AgentEvent) => {
    if (event.type === "message_end"){
        console.log("\n>>> Agent message ending...")
        console.log(`role: ${event.message.role}`)
    }
  });

  agent.subscribe((event: AgentEvent) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      // Stream just the new text chunk
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  await agent.prompt("Hello!");
}


async function showAgentHarnessBasicUsage(): Promise<void> {

  const { ollamaModel, options } = getOllamaModelConfig();

  // ==========================================
  // 1. 创建 Session（会话存储）
  // ==========================================
  // AgentHarness 需要一个 Session 来持久化对话历史。
  // InMemorySessionRepo 是内存中的实现，适合练习/测试；
  // 生产环境可用 JsonlSessionRepo（文件持久化）。
  const sessionRepo = new InMemorySessionRepo();
  const session: Session = await sessionRepo.create({ id: "demo-session-1" });
  console.log(">>> Session created, id:", (await session.getMetadata()).id);

  // ==========================================
  // 2. 配置 ExecutionEnv（执行环境）
  // ==========================================
  // ExecutionEnv 提供文件系统和 Shell 执行能力。
  // 这里使用最小化实现（无实际文件系统/Shell），仅用于演示。
  const env: ExecutionEnv = {
    cwd: process.cwd(),
    absolutePath: async (path: string) => ({ ok: true as const, value: path }),
    joinPath: async (parts: string[]) => ({ ok: true as const, value: parts.join("/") }),
    readTextFile: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    readTextLines: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    readBinaryFile: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    writeFile: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    appendFile: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    fileInfo: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    listDir: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    canonicalPath: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    exists: async () => ({ ok: true as const, value: false }),
    createDir: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    remove: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    createTempDir: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    createTempFile: async () => ({ ok: false as const, error: new FileError("not_supported", "not implemented") }),
    cleanup: async () => {},
    exec: async () => ({ ok: false as const, error: new ExecutionError("shell_unavailable", "not implemented") }),
  };

  // ==========================================
  // 3. 定义 Tool（可选）
  // ==========================================
  // AgentHarness 的 Tool 比底层 pi-ai 的 Tool 多了 execute 回调，
  // 框架会自动处理工具调用的执行和结果回传。
  const getCurrentTimeTool: AgentTool = {
    name: "getCurrentTime",
    label: "获取当前时间",
    description: "获取当前时间，支持指定时区。",
    parameters: Type.Object({
      timezone: Type.Optional(
        Type.String({ description: "时区标识符，如 'Asia/Shanghai'，默认 'Asia/Shanghai'" })
      ),
    }),
    execute: async (toolCallId: string, params: any) => {
      const args = params as { timezone?: string };
      const time = new Date().toLocaleString("zh-CN", {
        timeZone: args.timezone || "Asia/Shanghai",
        dateStyle: "full",
        timeStyle: "long",
      });
      return { content: [{ type: "text" as const, text: `当前时间: ${time}` }], details: { time } };
    },
  };
  const tools: AgentTool[] = [getCurrentTimeTool];

  // ==========================================
  // 4. 创建 AgentHarness 实例
  // ==========================================
  const harnessOptions: AgentHarnessOptions = {
    env,
    session,
    model: ollamaModel,
    systemPrompt: "你是一个智能助手，可以使用一系列工具。后续请用中文回答。",
    tools,
    activeToolNames: ["getCurrentTime"], // 指定哪些工具对模型可见
    thinkingLevel: "low",
    getApiKeyAndHeaders: async (model: Model<any>) => {
      if (model.provider === "ollama") {
        return { apiKey: options.apiKey! };
      }
      return { apiKey: "unused" };
    },
    // steeringMode: "queue",   // 转向消息的队列模式
    // followUpMode: "queue",   // 追问消息的队列模式
  };

  const harness = new AgentHarness(harnessOptions);
  console.log(">>> AgentHarness created");

  // ==========================================
  // 5. 订阅事件（subscribe）
  // ==========================================
  // subscribe 用于监听所有事件（包括底层 Agent 事件和 Harness 自有事件）

  // 监听模型更新
  harness.subscribe((event) => {
    if (event.type === "model_update") {
      console.log(`\n[事件] 模型更新: ${event.previousModel?.id ?? "无"} → ${event.model.id}`);
    }
  });

  // 监听工具调用 - 演示在工具调用时使用 steer() 中途修正行为
  harness.subscribe((event) => {
    if (event.type === "tool_call") {
      console.log(`\n[事件] 工具调用: ${event.toolName}(${JSON.stringify(event.input)})`);
      // steer() 只能在非 idle 状态调用，这里在 turn 执行期间调用是正确的
      // harness.steer("请用中文回答"); // 如需中途修正可取消注释
    }
  });

  // 监听工具结果
  harness.subscribe((event) => {
    if (event.type === "tool_result") {
      const status = event.isError ? "❌ 失败" : "✅ 成功";
      console.log(`[事件] 工具结果: ${event.toolName} ${status}`);
    }
  });

  // 流式输出文本
  harness.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  // ==========================================
  // 6. 注册生命周期钩子（on）
  // ==========================================
  // on() 用于注册特定类型的钩子，可以修改/拦截流程。
  // 与 subscribe 不同，on() 的 handler 可以返回结果来影响行为。

  // before_agent_start: 在 Agent 开始前修改消息或系统提示
  harness.on("before_agent_start", async (event) => {
    console.log(`\n[钩子] Agent 即将启动，prompt: "${event.prompt}"`);
    // 可以返回修改后的 systemPrompt 或 messages
    return undefined; // 不修改
  });

  // tool_call: 可以阻止特定工具调用
  harness.on("tool_call", async (event) => {
    console.log(`[钩子] 即将执行工具: ${event.toolName}`);
    // return { block: true, reason: "不允许调用此工具" }; // 阻止调用
    return undefined; // 允许调用
  });

  // ==========================================
  // 7. 与 Agent 交互
  // ==========================================

  // 7.1 prompt(): 发送用户消息，返回 AssistantMessage
  console.log("\n\n=== 第一轮对话: prompt() ===");
  const response1 = await harness.prompt("你好，请介绍一下你自己。");
  console.log("\n\n[响应] 消息内容块数:", response1.content.length);

  // 7.2 带工具调用的对话
  console.log("\n\n=== 第二轮对话: 工具调用 ===");
  console.log("用户: 现在几点了？");
  const response2 = await harness.prompt("现在几点了？");
  console.log("\n[响应] 消息内容块数:", response2.content.length);

  // 7.3 steer(): 发送转向消息
  // 注意：steer() 只能在 Agent 执行期间（非 idle）调用，用于中途修正行为。
  // 如果在 idle 状态调用会抛出 "Cannot steer while idle" 错误。
  // 正确用法：在 subscribe 回调中监听 tool_call 等事件时调用 steer()。
  // 这里演示通过 nextTurn() 在下一轮对话前插入指令（nextTurn 无 idle 限制）。
  console.log("\n\n=== nextTurn(): 下轮指令 ===");
  await harness.nextTurn("请用更简洁的方式回答。");
  console.log("下轮指令已加入队列");

  // 7.4 继续对话
  console.log("\n用户: 再次告诉我现在的时间。");
  const response3 = await harness.prompt("再次告诉我现在的时间。");
  console.log("\n[响应] 消息内容块数:", response3.content.length);

  // ==========================================
  // 8. 查看当前状态
  // ==========================================
  console.log("\n\n=== AgentHarness 当前状态 ===");
  console.log("模型:", harness.getModel().id);
  console.log("思考级别:", harness.getThinkingLevel());
  console.log("可用工具:", harness.getTools().map((t) => t.name));
  console.log("活跃工具:", harness.getActiveTools().map((t) => t.name));

  // ==========================================
  // 9. 动态修改配置
  // ==========================================
  // 可以运行时切换模型、工具等
  // await harness.setModel(anotherModel);
  // await harness.setThinkingLevel("high");
  // await harness.setActiveTools(["otherTool"]);

  // ==========================================
  // 10. 等待空闲 & 清理
  // ==========================================
  await harness.waitForIdle();
  console.log("\n>>> AgentHarness 已空闲，演示结束");
}


async function main(): Promise<void> {
  // await showAgentBasicUsage();
  await showAgentHarnessBasicUsage();
}

await main();
