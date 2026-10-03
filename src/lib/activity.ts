import { ActivityType } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function createActivity(
  userId: string,
  leadId: string,
  type: ActivityType,
  metadata?: any
) {
  return prisma.activity.create({
    data: {
      userId,
      leadId,
      type,
      metadata: metadata || undefined,
    },
  })
}
