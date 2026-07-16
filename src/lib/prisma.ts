import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

let prisma: PrismaClient

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL

if (connectionString?.startsWith('postgres')) {
  neonConfig.webSocketConstructor = ws
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool as any)
  prisma = new PrismaClient({ adapter })
} else {
  // Fallback para build/local (SQLite ou mock)
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export { prisma }
