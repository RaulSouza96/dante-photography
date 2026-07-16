import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool as any)
const prisma = new PrismaClient({ adapter })

export { prisma }
