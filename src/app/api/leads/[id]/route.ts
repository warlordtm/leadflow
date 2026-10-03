import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/authz'
import { updateLeadSchema } from '@/lib/validations/lead'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createActivity } from '@/lib/activity'
import { Role } from '@prisma/client'

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

    // Verify the user owns this lead (IDOR protection)
    // Admins can view any lead; staff can only view their own
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        followUps: {
          orderBy: { scheduledAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Authorization: staff can only access their own leads
    if (user.role !== Role.ADMIN && lead.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
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
    const data = updateLeadSchema.parse({ ...body, id })

    // Fetch existing lead to check ownership and detect changes
    const existing = await prisma.lead.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Authorization: staff can only edit their own leads
    if (user.role !== Role.ADMIN && existing.ownerUserId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updates: any = {}
    if (data.name !== undefined) updates.name = data.name
    if (data.email !== undefined) updates.email = data.email || null
    if (data.phone !== undefined) updates.phone = data.phone || null
    if (data.company !== undefined) updates.company = data.company || null
    if (data.source !== undefined) updates.source = data.source
    if (data.notes !== undefined) updates.notes = data.notes || null

    const wasStatusChange =
      data.status !== undefined && data.status !== existing.status

    if (data.status !== undefined) {
      updates.status = data.status
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updates,
    })

    // Log activity
    await createActivity(user.id, lead.id, 'LEAD_UPDATED')

    if (wasStatusChange) {
      await createActivity(user.id, lead.id, 'STATUS_CHANGED')
    }

    return NextResponse.json(lead)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}
