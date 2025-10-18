import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    //Fetching the video
    await step.sleep("fetching video", "5s");

    //Transcribing the video
    await step.sleep("transcribing video", "5s");

    //Sending transcription to AI
    await step.sleep("sending transcription to AI", "5s");

    await step.run("create-workflow", () => {
        return prisma.workflow.create({
            data:{
                name: "workflow-from-inngest"
            }
        })
    })
    return { message: `Hello ${event.data.email}!` };
  }
);
