import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

const idSchema = z.object({ id: z.string() });
const updateNameSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(({ ctx }) =>
    prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    })
  ),

  remove: protectedProcedure
    .input(idSchema)
    .mutation(({ ctx, input }) =>
      prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      })
    ),

  updateName: protectedProcedure
    .input(updateNameSchema)
    .mutation(({ ctx, input }) =>
      prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      })
    ),

  getOne: protectedProcedure
    .input(idSchema)
    .query(({ ctx, input }) =>
      prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      })
    ),
    getMany: protectedProcedure
    .query(({ ctx }) =>
      prisma.workflow.findMany({
        where: {
          userId: ctx.auth.user.id,
        },
        orderBy: { createdAt: "desc" },
      })
    ),
});
