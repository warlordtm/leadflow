import { GET, POST as NextAuthPOST } from '@/lib/auth'
import { authRateLimiter, getClientIP } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export { GET }

export async function POST(req: Request) {
  const clientIP = getClientIP(req)

  const rateLimitResult = authRateLimiter.consume(`login:${clientIP}`)
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded for login attempt', { clientIP })
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimitResult.reset) } }
    )
  }

  return NextAuthPOST(req)
}
