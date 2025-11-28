import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

/* ----------------------------- */
/* 📌 Types & Schemas Section    */
/* ----------------------------- */

const idSchema = z.object({ id: z.string() });

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
});

const updateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
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
});

/* ----------------------------- */
/* 📌 Type Inference Section     */
/* ----------------------------- */

export type IdInput = z.infer<typeof idSchema>;
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type UpdateNameInput = z.infer<typeof updateNameSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

/* ----------------------------- */
/* 📌 Router Section             */
/* ----------------------------- */

export const executionsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(idSchema).query(({ ctx, input }) =>
    prisma.execution.findUniqueOrThrow({
      where: { id: input.id, workflow: { userId: ctx.auth.user.id } },
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  ),

  getMany: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          where: {
            workflow: { userId: ctx.auth.user.id },
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { startedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.execution.count({
          where: {
            workflow: { userId: ctx.auth.user.id },
          },
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      return {
        items,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }),
});
