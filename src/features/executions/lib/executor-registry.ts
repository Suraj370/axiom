import { googleFormTriggerrExecutor } from "@/features/nodes/trigger/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/nodes/trigger/manual-trigger/executor";
import { NodeType } from "@/generated/prisma";
import { AnthropicExecutor } from "../../nodes/executions/anthropic/executor";
import { discordExecutor } from "../../nodes/executions/discord/executor";
import { geminiExecutor } from "../../nodes/executions/gemini/executor";
import { httpRequestExecutor } from "../../nodes/executions/http-request/executor";
import { OpenAIExecutor } from "../../nodes/executions/openai/executor";
import type { NodeExecutor } from "../types";

export const executorRegistry: Partial<Record<NodeType, NodeExecutor>> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerrExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: OpenAIExecutor,
  [NodeType.ANTHROPIC]: AnthropicExecutor,
  [NodeType.DISCORD]: discordExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
