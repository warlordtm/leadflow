import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  if (process.env.VERCEL && req.headers.get('host')) {
    process.env.NEXTAUTH_URL = `https://${req.headers.get('host')}`
  }
  const { GET } = await import('@/lib/auth')
  return GET(req)
}

export async function POST(req: NextRequest) {
  if (process.env.VERCEL && req.headers.get('host')) {
    process.env.NEXTAUTH_URL = `https://${req.headers.get('host')}`
  }
  const { POST } = await import('@/lib/auth')
  return POST(req)
}
