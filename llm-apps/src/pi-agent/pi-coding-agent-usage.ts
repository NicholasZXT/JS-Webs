import { Type, getModel, stream, Context, Tool } from "@earendil-works/pi-ai";
import { 
    Agent, AgentState, AgentMessage,
} from "@earendil-works/pi-agent-core";
import {
    getShellConfig, createCodingTools, createAgentSession, AgentSession, parseSkillBlock, formatSkillsForPrompt,
} from "@earendil-works/pi-coding-agent";