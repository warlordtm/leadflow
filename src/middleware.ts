import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ROUTES = ['/', '/login', '/register']
const PUBLIC_API_ROUTES = ['/api/auth', '/api/health']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.some((r) => pathname === r)) {
    return NextResponse.next()
  }

  if (PUBLIC_API_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  if (process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto')
    const isSecure = request.nextUrl.protocol === 'https:' || protocol === 'https'

    if (!isSecure && !pathname.startsWith('/api')) {
      const httpsUrl = request.nextUrl.clone()
      httpsUrl.protocol = 'https'
      return NextResponse.redirect(httpsUrl, 301)
    }
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!pathname.startsWith('/api')) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|api/health|_next/static|_next/image|favicon.ico).*)',
  ],
}
