import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await prisma.session.findMany({
    where: { userId: session.user.id as string },
    orderBy: { expires: 'desc' },
    select: {
      id: true,
      sessionToken: true,
      expires: true,
      userId: true,
    },
  })

  return NextResponse.json({ sessions })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId } = await req.json()

  if (!sessionId) {
    return NextResponse.json({ message: 'Session ID required' }, { status: 400 })
  }

  const userSession = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!userSession || userSession.userId !== session.user.id) {
    return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  }

  await prisma.session.delete({
    where: { id: sessionId },
  })

  logger.info('Session revoked', { userId: session.user.id, sessionId })

  return NextResponse.json({ message: 'Session revoked' })
}
