import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/authz'
import { updateFollowUpSchema } from '@/lib/validations/followup'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createActivity } from '@/lib/activity'
import { Role, FollowUpStatus } from '@prisma/client'
import { logger } from '@/lib/logger'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const followUp = await prisma.followUp.findUnique({
      where: { id },
      include: {
        lead: {
          select: { id: true, name: true, email: true, ownerUserId: true },
        },
      },
    })

    if (!followUp) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Authorization: staff can only view follow-ups on their own leads
    // Admins can view any follow-up
    if (user.role !== Role.ADMIN && followUp.lead.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(followUp)
  } catch (error) {
    logger.error('Error fetching follow-up:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to fetch follow-up' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateFollowUpSchema.parse({ ...body, id })

    const existing = await prisma.followUp.findUnique({
      where: { id },
      include: {
        lead: { select: { id: true, ownerUserId: true } },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Authorization: verify ownership
    if (user.role !== Role.ADMIN && existing.lead.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const wasCompleted = existing.status === FollowUpStatus.COMPLETED

    const followUp = await prisma.followUp.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && {
          notes: data.notes || null,
        }),
        ...(data.status === FollowUpStatus.COMPLETED && {
          completedAt: new Date(),
        }),
      },
    })

    // Log activity when marking complete
    if (!wasCompleted && data.status === FollowUpStatus.COMPLETED) {
      await createActivity(user.id, existing.leadId, 'FOLLOWUP_COMPLETED')
    }

    return NextResponse.json(followUp)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    logger.error('Error updating follow-up:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to update follow-up' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const existing = await prisma.followUp.findUnique({
      where: { id },
      include: { lead: { select: { ownerUserId: true } } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (user.role !== Role.ADMIN && existing.lead.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.followUp.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting follow-up:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to delete follow-up' },
      { status: 500 }
    )
  }
}
