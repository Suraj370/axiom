"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { BaseExecutionNode } from "../../../executions/components/base-execution-node";
import { useNodeStatus } from "../../../executions/hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";
import { DiscordDialog, type DiscordFormValues } from "./dialog";

type DiscordNodeData = {
  variableName: string;

  webhookUrl?: string;
  content?: string;
  username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send : ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const [dialogOpen, setDialogOpen] = useState(false);

  const { setNodes } = useReactFlow();

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);
  const handleSubmit = (values: DiscordFormValues) => {
    console.log(" node values", values);

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
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/discord.svg"
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
