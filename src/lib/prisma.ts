import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `prisma` variable (avoids hot-reload creating multiple clients in dev)
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
