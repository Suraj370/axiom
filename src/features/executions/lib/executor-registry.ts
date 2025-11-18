import { googleFormTriggerrExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { NodeType } from "@/generated/prisma";
import { AnthropicExecutor } from "../components/anthropic/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { OpenAIExecutor } from "../components/openai/executor";
import type { NodeExecutor } from "../types";

export const executorRegistry: Partial<Record<NodeType, NodeExecutor>> = {
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerrExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: OpenAIExecutor,
  [NodeType.ANTHROPIC]: AnthropicExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
