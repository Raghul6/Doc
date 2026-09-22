import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query'],
    })
  }
  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_, prop: string | symbol) => {
    const client = getPrisma()
    return client[prop as keyof PrismaClient]
  },
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = getPrisma()
}
