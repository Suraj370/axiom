import { PrismaClient } from "@/generated/prisma";


const globalPrisma = global as unknown as {
    prisma: PrismaClient | undefined
};

const prisma = globalPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV === "development") {
    globalPrisma.prisma = prisma;
}

export default prisma;
