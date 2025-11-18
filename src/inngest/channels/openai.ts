import { channel, topic } from "@inngest/realtime";

export const OpenAI_CHANNEL_NAME = "openai-request-execution";

export const openaiChannel = channel(OpenAI_CHANNEL_NAME)
.addTopic(
    topic("status").type<{
        nodeId: string;
        status: "loading" | "success" | "error";
    }>(),
)
