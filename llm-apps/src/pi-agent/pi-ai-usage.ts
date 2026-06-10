// 练习 pi-ai 的使用
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


function showModels() {
  const providers = getProviders();
  console.log("Available providers:\n", providers);

  // const provider: KnownProvider = "openai";
  const provider: KnownProvider = "deepseek";
  const models = getModels(provider);
  console.log("---------------------------------------");
  console.log("Available models:\n", models);
}

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
  console.log("\n>>> Ollama Model:\n", ollamaModel);

  // 配置模型选项
  // 注意，API-KEY是在这里配置，如果不配置，则会尝试从环境变量里获取
  const options: ProviderStreamOptions = {
    // model-specific options can be added here if needed
    apiKey: "OLLAMA_API_KEY",
  };
  console.log("\n>>> Ollama Model Options:\n", options);

  return { ollamaModel, options };
}


async function showModelUsage(): Promise<void> {
  const { ollamaModel, options } = getOllamaModelConfig();

  // 初始化上下文
  const context: Context = {
    systemPrompt: "You are a helpful assistant.",
    messages: [{ role: "user", content: "你好啊", timestamp: Date.now() }],
  };

  // Stream调用模型
  const s: AssistantMessageEventStream = stream(ollamaModel, context, options);

  console.log("\n\n>>> Stream Chat with Ollama Model:\n");
  for await (const event of s) {
    switch (event.type) {
      case "start":
        console.log(`Starting with ${event.partial.model}`);
        break;
      case "text_start":
        console.log("\n[Text started]");
        break;
      case "text_delta":
        process.stdout.write(event.delta);
        break;
      case "text_end":
        console.log("\n[Text ended]");
        break;
      case "thinking_start":
        console.log("[Model is thinking...]");
        break;
      case "thinking_delta":
        process.stdout.write(event.delta);
        break;
      case "thinking_end":
        console.log("[Thinking complete]");
        break;
      case "toolcall_start":
        console.log(`\n[Tool call started: index ${event.contentIndex}]`);
        break;
      case "toolcall_delta":
        // Partial tool arguments are being streamed
        const partialCall = event.partial.content[event.contentIndex];
        if (partialCall.type === "toolCall") {
          console.log(`[Streaming args for ${partialCall.name}]`);
        }
        break;
      case "toolcall_end":
        console.log(`\nTool called: ${event.toolCall.name}`);
        console.log(`Arguments: ${JSON.stringify(event.toolCall.arguments)}`);
        break;
      case "done":
        console.log(`\nFinished: ${event.reason}`);
        break;
      case "error":
        console.error(`Error: ${event.error}`);
        break;
    }
  }

  const finalMessage = await s.result();
  console.log(
    "\n\n>>> Stream Chat final result with Ollama Model:\n",
    finalMessage,
  );
  // context.messages.push(finalMessage);
}

async function showToolCalling() {
  const { ollamaModel, options } = getOllamaModelConfig();

  // 定义工具描述的schema，这里要使用 typebox 来定义参数的结构
  // 注意，这里并不需要提供工具的实现
  const tool: Tool = {
    name: "getCurrentTime",
    description: "Get the current time in ISO format.",
    parameters: Type.Object({
      timezone: Type.Optional(
        Type.String({
          description:
            "Timezone identifier, e.g. 'UTC', 'America/New_York', default 'Asia/Shanghai'",
        }),
      ),
    }),
  };

  // 将Tool附加到Context中
  const context: Context = {
    systemPrompt: "You are a helpful assistant with access to some tools.",
    messages: [
      {
        role: "user",
        content: "你好，请问现在是什么时间",
        timestamp: Date.now(),
      },
    ],
    tools: [tool],
  };

  // 这里直接使用 completiong API，不使用流式API
  const response = await complete(ollamaModel, context, options);
  console.log("\n>>> Tool Calling with Ollama Model:\n", response);
  console.log("\n>>> Tools in the response.content:");
  for (const block of response.content) {
    if (block.type === "text") {
      console.log(block.text);
    } else if (block.type === "toolCall") {
      console.log(`Tool: ${block.name}(${JSON.stringify(block.arguments)})`);
    }
  }

  // 将工具调用添加到对话上下文中
  context.messages.push(response);

  console.log("\n>>> Processing Tool Calls...");
  // 处理工具调用
  const toolCalls = response.content.filter((b) => b.type === "toolCall");
  for (const call of toolCalls) {
    // Execute the tool
    const result =
      call.name === "getCurrentTime"
        ? new Date().toLocaleString("zh-CN", {
            timeZone: call.arguments.timezone || "Asia/Shanghai",
            dateStyle: "full",
            timeStyle: "long",
          })
        : "Unknown tool";

    // Add tool result to context (supports text and images)
    context.messages.push({
      role: "toolResult",
      toolCallId: call.id,
      toolName: call.name,
      content: [{ type: "text", text: result }],
      isError: false,
      timestamp: Date.now(),
    });
  }

  const continuation = await complete(ollamaModel, context, options);
  context.messages.push(continuation);
  console.log("\n>>> After tool execution:\n", continuation.content);
}

// ===============================================================
async function main() {
  showModels();
  await showModelUsage();
  await showToolCalling();
}

await main()