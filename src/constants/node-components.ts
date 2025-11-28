import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { AnthropicNode } from "@/features/nodes/executions/anthropic/node";
import { DiscordNode } from "@/features/nodes/executions/discord/node";
import { GeminiNode } from "@/features/nodes/executions/gemini/node";
import { HttpRequestNode } from "@/features/nodes/executions/http-request/node";
import { OpenAINode } from "@/features/nodes/executions/openai/node";
import { GoogleFormTrigger } from "@/features/nodes/trigger/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/nodes/trigger/manual-trigger/node";
import { NodeType } from "@/generated/prisma";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: OpenAINode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.DISCORD]: DiscordNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
