import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    })
  }
  prisma = global.prisma
}

export default prisma
