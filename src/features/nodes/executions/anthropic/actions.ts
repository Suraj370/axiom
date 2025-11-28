"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { inngest } from "@/inngest/client";

export type AnthropicToken = Realtime.Token<
  typeof anthropicChannel,
  ["status"]
>;

export async function fetchAnthropicRealtimeToken(): Promise<AnthropicToken> {
  // A function whose declared type is neither
  const token = await getSubscriptionToken(inngest, {
    channel: anthropicChannel(),
    topics: ["status"],
  });
  return token;
}
