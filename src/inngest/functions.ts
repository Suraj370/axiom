import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { prisma } from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";




export const executeWorkflow = inngest.createFunction(
  { id: "execute-ai" },
  { event: "workflows/execute.workflow" },
  async ({ event, step }) => {

    const workflowId = event.data.workflowId;

    if(!workflowId){
      throw new NonRetriableError("Workflow Id is missing")
    }
    
    const sortedNodes = await step.run("prepare-workflow", async() => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {id: workflowId},
        include: {
          node: true,
          connection: true
        }
      });
      return topologicalSort(workflow.node, workflow.connection);

    })

    // Initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step
      })
    }


    return {
      workflowId,
      result: context,
      
    };
  }
);
