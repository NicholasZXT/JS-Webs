// 练习 pi-agent-core 使用
// -------- pi-ai --------
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
// -------- pi-agent-core --------
import { 
  Agent, AgentState, AgentMessage,
} from "@earendil-works/pi-agent-core";
// -------- pi-coding-agent --------
import {
  getShellConfig, createCodingTools, createAgentSession, AgentSession, parseSkillBlock, formatSkillsForPrompt,
} from "@earendil-works/pi-coding-agent";