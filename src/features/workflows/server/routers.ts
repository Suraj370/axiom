import type { Edge, Node } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";
import { NodeType } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import { prisma } from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";

const idSchema = z.object({ id: z.string() });

const updateSchema = z.object({
  id: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string().nullish(),
      position: z.object({ x: z.number(), y: z.number() }),
      data: z.record(z.string(), z.any()),
    })
  ),

  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().nullish(),
      targetHandle: z.string().nullish(),
    })
  ),
});
const updateNameSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

const paginationSchema = z.object({
  page: z.number().min(1).default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});
export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
      });

      await sendWorkflowExecution({
        workflowId: input.id,
      });
      return workflow;
    }),
  create: premiumProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        node: {
          create: {
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),

  remove: protectedProcedure.input(idSchema).mutation(({ ctx, input }) =>
    prisma.workflow.delete({
      where: {
        id: input.id,
        userId: ctx.auth.user.id,
      },
    })
  ),

  update: protectedProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      //Transaction to  ensure consistency

      return await prisma.$transaction(async (tx) => {
        //Delete existing nodes and connection (cascades delete connections)
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        // Create nodes
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        }),
          // Create connections
          await tx.connection.createMany({
            data: edges.map((edge) => ({
              workflowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle || "main",
              toInput: edge.targetHandle || "main",
            })),
          });

        // update workflow's updatedAt timestamp
        await tx.workflow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return workflow;
      });
    }),

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

  getOne: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const workflow = await prisma.workflow.findUniqueOrThrow({
      where: {
        id: input.id,
        userId: ctx.auth.user.id,
      },
      include: {
        node: true,
        connection: true,
      },
    });

    const nodes: Node[] = workflow.node.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position as { x: number; y: number },
      data: (node.data as Record<string, unknown>) || {},
    }));

    // Transform server connections to react-flow compatible edges
    const edges: Edge[] = workflow.connection.map((connection) => ({
      id: connection.id,
      source: connection.fromNodeId,
      target: connection.toNodeId,
      sourceHandle: connection.fromOutput,
      targetHandle: connection.toInput,
    }));
    return {
      id: workflow.id,
      name: workflow.name,
      nodes,
      edges,
    };
  }),

  getMany: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          where: {
            userId: ctx.auth.user.id,
            name: search
              ? { contains: search, mode: "insensitive" }
              : undefined,
          },
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: search
              ? { contains: search, mode: "insensitive" }
              : undefined,
          },
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        items,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    }),
});
