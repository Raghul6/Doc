import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    let datasourceUrl = process.env.DATABASE_URL

    if (process.env.NODE_ENV === 'production' && !datasourceUrl) {
      const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db')
      const tmpDbPath = path.join('/tmp', 'dev.db')
      try {
        if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath)
        }
        datasourceUrl = `file:${tmpDbPath}`
      } catch (e) {
        console.error('Failed to copy db to /tmp', e)
      }
    }

    globalForPrisma.prisma = new PrismaClient({
      log: ['query'],
      ...(datasourceUrl ? { datasourceUrl } : {}),
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
