import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async({ ctx }) => {
    await inngest.send({
      name: 'test/hello.world',
      data: {
        email: ctx.auth.user.email,
      },
    })
    return {success: true, message: "Job queue"}
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
