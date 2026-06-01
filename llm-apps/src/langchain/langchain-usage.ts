/**
 * LangChain框架使用研究
 */
import {
    Runnable, RunnableBinding, RunnableConfig, RunnableLambda, RunnablePassthrough,
    RunnableParallel, RunnableEach
} from "@langchain/core/runnables";
import {
    BaseLanguageModel, BaseLanguageModelParams, BaseLangChain, BaseLangChainParams,
    BaseLanguageModelInput, LanguageModelOutput, StructuredOutputType, ToolDefinition
} from "@langchain/core/language_models/base";
import {BaseLLM, BaseLLMParams, LLM} from "@langchain/core/language_models/llms";
import {BaseChatModel, BaseChatModelParams, SerializedChatModel, SimpleChatModel} from "@langchain/core/language_models/chat_models";
import {
    SystemMessage, SystemMessageChunk, AIMessage, AIMessageChunk, HumanMessage, HumanMessageChunk, 
    ToolMessage, ToolMessageChunk, Tool, ToolStrategy, StructuredTool,
    initChatModel, tool, createAgent, createMiddleware, 
    humanInTheLoopMiddleware, modelCallLimitMiddleware,
} from "langchain";
// import {OpenAI, ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {ChatOllama, Ollama, OllamaEmbeddings} from "@langchain/ollama";

