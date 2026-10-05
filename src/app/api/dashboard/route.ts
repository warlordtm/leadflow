import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/authz'
import prisma from '@/lib/prisma'
import { LeadStatus, FollowUpStatus } from '@prisma/client'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const todayEnd = new Date(now.setHours(24, 0, 0, 0))

    // Lead counts by status (for admin: all leads; for staff: their own)
    // For admin role, see all leads; for staff, only owned
    // In solo mode, user is admin and owns all leads
    // In team mode, admin sees all, staff sees only assigned leads
    const leadCounts = await prisma.lead.groupBy({
      by: ['status'],
      where: {
        ownerUserId: user.id,
      },
      _count: {
        _all: true,
      },
    })

    const statusCounts: Record<string, number> = {}
    for (const s of Object.values(LeadStatus)) {
      statusCounts[s] = 0
    }
    for (const gc of leadCounts) {
      statusCounts[gc.status] = gc._count._all
    }

    const totalLeads = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    )

    // Today's follow-ups (pending, scheduled today)
    const todaysFollowUps = await prisma.followUp.findMany({
      where: {
        userId: user.id,
        status: FollowUpStatus.PENDING,
        scheduledAt: { gte: todayStart, lt: todayEnd },
      },
      include: {
        lead: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    })

    // Upcoming follow-ups (next 7 days)
    const in7Days = new Date(todayEnd)
    in7Days.setDate(todayEnd.getDate() + 7)
    const upcomingFollowUps = await prisma.followUp.findMany({
      where: {
        userId: user.id,
        status: FollowUpStatus.PENDING,
        scheduledAt: { gte: todayEnd, lt: in7Days },
      },
      include: {
        lead: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    })

    // Overdue follow-ups (past due, still pending)
    const overdueFollowUps = await prisma.followUp.findMany({
      where: {
        userId: user.id,
        status: FollowUpStatus.PENDING,
        scheduledAt: { lt: todayStart },
      },
      include: {
        lead: { select: { id: true, name: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    })

    // Recent leads (last 10)
    const recentLeads = await prisma.lead.findMany({
      where: { ownerUserId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        source: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      leadCounts: statusCounts,
      totalLeads,
      todaysFollowUps,
      upcomingFollowUps,
      overdueFollowUps,
      recentLeads,
    })
  } catch (error) {
    logger.error('Error fetching dashboard:', { error: String(error) })
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
