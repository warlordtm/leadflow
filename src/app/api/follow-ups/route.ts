import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/authz'
import { createFollowUpSchema, followUpFilterSchema } from '@/lib/validations/followup'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createActivity } from '@/lib/activity'
import { logger } from '@/lib/logger'
import { Role } from '@prisma/client'

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status') ?? undefined
    const dateRange = url.searchParams.get('dateRange') ?? undefined

    const parsed = followUpFilterSchema.parse({ status, dateRange })

    const now = new Date()
    let dateFilter: any = {}

    switch (parsed.dateRange) {
      case 'today':
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lt: new Date(now.setHours(24, 0, 0, 0)),
        }
        break
      case 'upcoming':
        dateFilter = { gt: new Date(now.setHours(24, 0, 0, 0)) }
        break
      case 'overdue':
        dateFilter = { lt: new Date(now.setHours(0, 0, 0, 0)) }
        break
      case 'completed':
        // completed items have any date but COMPLETED status
        break
    }

    const where: any = {
      userId: user.id, // Staff sees their own; admin sees all (will need adjustment for teams later)
      ...(parsed.status ? { status: parsed.status } : {}),
    }

    // Apply date filter only if there's a status filter for scheduledAt
    if (dateRange && dateRange !== 'completed') {
      where.scheduledAt = dateFilter
      // If not completed, exclude completed/cancelled
      if (!parsed.status) {
        where.status = 'PENDING'
      }
    }

    if (dateRange === 'completed') {
      where.status = 'COMPLETED'
    }

    const followUps = await prisma.followUp.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        lead: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(followUps)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    logger.error('Error fetching follow-ups:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to fetch follow-ups' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createFollowUpSchema.parse(body)

    // Verify the user has access to this lead (IDOR protection)
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Authorization: staff can only create follow-ups for their own leads
    // Admins can create for any lead
    if (user.role !== Role.ADMIN && lead.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const followUp = await prisma.followUp.create({
      data: {
        leadId: data.leadId,
        userId: user.id,
        scheduledAt: new Date(data.scheduledAt),
        type: data.type,
        notes: data.notes || null,
      },
    })

    // Log activity
    await createActivity(user.id, lead.id, 'FOLLOWUP_CREATED')

    return NextResponse.json(followUp, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    logger.error('Error creating follow-up:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to create follow-up' },
      { status: 500 }
    )
  }
}
