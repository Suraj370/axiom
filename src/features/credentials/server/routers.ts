import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";
import { CredentialType } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";

/* ----------------------------- */
/* 📌 Types & Schemas Section    */
/* ----------------------------- */

const idSchema = z.object({ id: z.string() });

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "Value is required"),
});

const updateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
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
  search: z.string().default(""),
});

const typeSchema = z.object({
  type: z.enum(CredentialType),
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

export const credentialsRouter = createTRPCRouter({
  create: premiumProcedure.input(createSchema).mutation(({ ctx, input }) =>
    prisma.credential.create({
      data: {
        ...input,
        userId: ctx.auth.user.id,
        // TODO: encrypt value in production
      },
    })
  ),

  remove: protectedProcedure.input(idSchema).mutation(({ ctx, input }) =>
    prisma.credential.delete({
      where: { id: input.id, userId: ctx.auth.user.id },
    })
  ),

  update: protectedProcedure.input(updateSchema).mutation(({ ctx, input }) =>
    prisma.credential.update({
      where: { id: input.id, userId: ctx.auth.user.id },
      data: {
        name: input.name,
        type: input.type,
        value: input.value,
      },
    })
  ),

  getOne: protectedProcedure.input(idSchema).query(({ ctx, input }) =>
    prisma.credential.findUniqueOrThrow({
      where: { id: input.id, userId: ctx.auth.user.id },
    })
  ),

  getMany: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
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
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: search
              ? { contains: search, mode: "insensitive" }
              : undefined,
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

  getType: protectedProcedure
    .input(typeSchema)
    .query(async ({ ctx, input }) => {
      const { type } = input;

      return await prisma.credential.findMany({
        where: { type, userId: ctx.auth.user.id },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
