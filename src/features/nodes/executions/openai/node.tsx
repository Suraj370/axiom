"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { OpenAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { BaseExecutionNode } from "../../../executions/components/base-execution-node";
import { useNodeStatus } from "../../../executions/hooks/use-node-status";
import { fetchOpenAIRealtimeToken } from "./actions";
import { OpenAIDialog, type OpenAIFormValues } from "./dialog";

type OpenAINodeData = {
  variableName: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `"gpt-5-nano": ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: OpenAI_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);
  const handleSubmit = (values: OpenAIFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
      <OpenAIDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/openai.svg"
        name="OpenAI"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAINode.displayName = "OpenAINode";
