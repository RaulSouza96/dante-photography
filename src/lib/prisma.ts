import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

let prisma: PrismaClient

if (process.env.DATABASE_URL?.startsWith('postgres')) {
  neonConfig.webSocketConstructor = ws
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export { prisma }
