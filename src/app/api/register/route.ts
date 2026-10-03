import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { Role } from '@prisma/client'
import { authRateLimiter, getClientIP } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  const clientIP = getClientIP(req)

  const rateLimitResult = authRateLimiter.consume(`register:${clientIP}`)
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for registration', { clientIP })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimitResult.reset) } }
    )
  }

  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check for existing user
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // First user becomes ADMIN, rest are STAFF
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? Role.ADMIN : Role.STAFF

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
      },
    })

    // Do not return passwordHash
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
  } catch (error: any) {
    if (error?.issues) {
      // Zod validation error
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Registration error:', error)
    logger.error('Registration error:', { error: String(error) })
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
