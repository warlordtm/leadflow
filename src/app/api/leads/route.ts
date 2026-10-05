import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/authz'
import { createLeadSchema, leadFilterSchema } from '@/lib/validations/lead'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createActivity } from '@/lib/activity'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('search') ?? undefined
    const status = url.searchParams.get('status') ?? undefined
    const source = url.searchParams.get('source') ?? undefined

    const parsed = leadFilterSchema.parse({
      search,
      status,
      source,
    })

    const where: any = {
      ownerUserId: user.id,
    }

    if (parsed.status) {
      where.status = parsed.status
    }

    if (parsed.source) {
      where.source = parsed.source
    }

    if (parsed.search) {
      where.OR = [
        { name: { contains: parsed.search, mode: 'insensitive' } },
        { email: { contains: parsed.search, mode: 'insensitive' } },
        { phone: { contains: parsed.search, mode: 'insensitive' } },
        { company: { contains: parsed.search, mode: 'insensitive' } },
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        followUps: {
          where: { status: 'PENDING' },
          select: { id: true, scheduledAt: true },
        },
      },
    })

    return NextResponse.json(leads)
  } catch (error) {
    logger.error('Error fetching leads:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
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
    const data = createLeadSchema.parse(body)

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company: data.company || null,
        source: data.source,
        status: data.status,
        notes: data.notes || null,
        ownerUserId: user.id,
      },
    })

    // Log activity
    await createActivity(user.id, lead.id, 'LEAD_CREATED')

    return NextResponse.json(lead, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    logger.error('Error creating lead:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
