import { channel, topic } from "@inngest/realtime";

export const Anthropic_CHANNEL_NAME = "anthropic-request-execution";

export const anthropicChannel = channel(Anthropic_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
