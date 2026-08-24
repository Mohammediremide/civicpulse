import { PrismaClient } from '@prisma/client'

// Vercel serverless functions can be invoked many times against the same
// warm container; without this singleton pattern each invocation could spin
// up a new Prisma client / DB connection.
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
