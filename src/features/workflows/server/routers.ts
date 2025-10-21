import { generateSlug } from "random-word-slugs";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";

const idSchema = z.object({ id: z.string() });
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
  create: premiumProcedure.mutation(({ ctx }) =>
    prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    })
  ),

  remove: protectedProcedure.input(idSchema).mutation(({ ctx, input }) =>
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

  getOne: protectedProcedure.input(idSchema).query(({ ctx, input }) =>
    prisma.workflow.findUnique({
      where: {
        id: input.id,
        userId: ctx.auth.user.id,
      },
    })
  ),

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
