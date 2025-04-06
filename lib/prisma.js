import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis; // Ensures compatibility with serverless environments

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };  
