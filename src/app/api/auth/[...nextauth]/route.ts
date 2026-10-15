import type { NextRequest } from 'next/server'
import { GET as AuthGET, POST as AuthPOST } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (req.headers.get('host')) {
    process.env.NEXTAUTH_URL = `https://${req.headers.get('host')}`
  }
  return AuthGET(req)
}

export async function POST(req: NextRequest) {
  if (req.headers.get('host')) {
    process.env.NEXTAUTH_URL = `https://${req.headers.get('host')}`
  }
  return AuthPOST(req)
}
