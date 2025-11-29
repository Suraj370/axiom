import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";
import { CredentialType } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import {
  upsertCredentialSecret,
  deleteCredentialSecret,
  getCredentialSecret,
  parseSecretString,
} from "@/lib/secrets";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";

/* ----------------------------- */
/* 📌 Schemas                    */
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
/* 📌 Router                     */
/* ----------------------------- */

export const credentialsRouter = createTRPCRouter({
  // CREATE: DB row + secret in AWS
  create: premiumProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, value, type } = input;
      const userId = ctx.auth.user.id;

      return prisma.$transaction(async (tx) => {
        // 1) Create credential to get ID
        const credential = await tx.credential.create({
          data: {
            name,
            userId,
            type,
            secretId: "", // temporary placeholder
          },
        });

        const secretName = `credentials/${userId}/${name}`;

        await upsertCredentialSecret(secretName, { value });

        const updated = await tx.credential.update({
          where: { id: credential.id },
          data: { secretId: secretName },
        });

        return { ...updated, value };
      });
    }),

  remove: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      return prisma.$transaction(async (tx) => {
        const credential = await tx.credential.findFirstOrThrow({
          where: { id: input.id, userId },
        });

        const deleted = await tx.credential.delete({
          where: { id: credential.id },
        });

        await deleteCredentialSecret(credential.secretId);
        return deleted;
      });
    }),

  // UPDATE: metadata + secret value in AWS
  update: protectedProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const { id, name, type, value } = input;

      return prisma.$transaction(async (tx) => {
        const existing = await tx.credential.findFirstOrThrow({
          where: { id, userId },
        });

        // 1) Update encrypted value in AWS
        await upsertCredentialSecret(existing.secretId, { value });

        // 2) Update metadata in DB
        const updated = await tx.credential.update({
          where: { id },
          data: { name, type },
        });

        return { ...updated, value };
      });
    }),

  getOne: protectedProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;

    const credential = await prisma.credential.findFirstOrThrow({
      where: { id: input.id, userId },
    });

    const secretOutput = await getCredentialSecret(credential.secretId);

    const parsed = parseSecretString<{ value: string }>(secretOutput);
    const value = parsed?.value ?? null;


    return { ...credential, value };
  }),

  getMany: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const userId = ctx.auth.user.id;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          where: {
            userId,
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
            userId,
            name: search
              ? { contains: search, mode: "insensitive" }
              : undefined,
          },
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

      return {
        items, // 🔐 no secret values here
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

  // FILTER BY TYPE: metadata only
  getType: protectedProcedure.input(typeSchema).query(({ ctx, input }) =>
    prisma.credential.findMany({
      where: { type: input.type, userId: ctx.auth.user.id },
      orderBy: { updatedAt: "desc" },
    })
  ),
});
