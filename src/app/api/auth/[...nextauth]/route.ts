import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'

export async function GET(req: NextRequest) {
  if (process.env.VERCEL && req.headers.get('host')) {
    process.env.NEXTAUTH_URL = `https://${req.headers.get('host')}`
  }
  const { authOptions } = await import('@/lib/auth')
  const { GET } = NextAuth(authOptions)
  return GET(req)
}

export async function POST(req: NextRequest) {
  if (process.env.VERCEL && req.headers.get('host')) {
    process.env.NEXTAUTH_URL = `https://${req.headers.get('host')}`
  }
  const { authOptions } = await import('@/lib/auth')
  const { POST } = NextAuth(authOptions)
  return POST(req)
}
