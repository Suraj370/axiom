"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { openaiChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";

export type OpenAIToken = Realtime.Token<typeof openaiChannel, ["status"]>;

export async function fetchOpenAIRealtimeToken(): Promise<OpenAIToken> {
  // A function whose declared type is neither
  const token = await getSubscriptionToken(inngest, {
    channel: openaiChannel(),
    topics: ["status"],
  });
  return token;
}
