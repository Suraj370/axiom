import { NonRetriableError } from "inngest";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { NodeType } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { anthropicChannel } from "./channels/anthropic";
import { geminiChannel } from "./channels/gemini";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { openaiChannel } from "./channels/openai";
import { inngest } from "./client";
import { topologicalSort } from "./utils";
import { discordChannel } from "./channels/discord";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0, //TODO: Remove in Production
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      anthropicChannel(),
      discordChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow Id is missing");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          node: true,
          connection: true,
        },
      });
      return topologicalSort(workflow.node, workflow.connection);
    });

    const userId = await step.run("find-user-id", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: {
          userId: true,
        },
      });
      return workflow.userId;
    });

    // Initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  }
);
