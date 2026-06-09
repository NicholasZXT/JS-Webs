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
    AgentHarnessOptions, Skill, AgentHarnessStreamOptions, CompactionSettings,
} from "@earendil-works/pi-agent-core";
import { 
    Agent, AgentHarness, 
    agentLoop, runAgentLoop, runAgentLoopContinue, 
    loadPromptTemplates, loadSkills,
    convertToLlm,
} from "@earendil-works/pi-agent-core";


function getOllamaModelConfig(): {
  ollamaModel: Model<"openai-completions">;
  options: ProviderStreamOptions;
} {
  
  const ollamaModelLabel = "qwen3.5:9b";
  // 配置模型基本信息
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


async function showAgentSimpleUsage(): Promise<void> {

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



async function main(): Promise<void> {
    await showAgentSimpleUsage();
}

await main();