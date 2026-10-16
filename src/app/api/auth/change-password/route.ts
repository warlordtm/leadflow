import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { currentPassword, newPassword, confirmPassword } = await req.json()

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { message: 'New password and confirmation do not match' },
      { status: 400 }
    )
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { message: 'Password must be at least 8 characters' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash)

  if (!isValid) {
    return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  })

  logger.info('Password changed successfully', { userId: user.id })

  return NextResponse.json({ message: 'Password changed successfully' })
}
