import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import { logger } from '@/lib/logger'
import { authRateLimiter, getClientIP } from '@/lib/rate-limit'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const clientIP = getClientIP({ headers: new Headers() } as any)
        const rateLimitResult = authRateLimiter.consume(`login:${clientIP}`)
        if (!rateLimitResult.success) {
          logger.warn('Rate limit exceeded for login attempt', { email: credentials.email, clientIP })
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash as string
        )

        if (!isValid) {
          logger.warn('Failed login attempt', { email: credentials.email })
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? '',
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // Allow Google sign in
      if (account?.provider === 'google') {
        try {
          // Ensure user exists with a role
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                passwordHash: null,
                role: 'STAFF',
              },
            })
          } else if (!existingUser.role) {
            await prisma.user.update({
              where: { email: user.email! },
              data: { role: 'STAFF' },
            })
          }
          return true
        } catch (error) {
          logger.error('Error in Google signIn callback:', { error: String(error) })
          return false
        }
      }
      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role || 'STAFF'
        token.sub = user.id
      }
      // Ensure role is set for existing tokens - fetch from DB if missing
      if (!token.role && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          })
          if (dbUser) {
            token.role = dbUser.role || 'STAFF'
            token.sub = dbUser.id
          } else {
            token.role = 'STAFF'
          }
        } catch (e) {
          token.role = 'STAFF'
        }
      }
      if (!token.role) {
        token.role = 'STAFF'
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = (token.role as string) || 'STAFF'
      }
      return session
    },
  },
}

// NextAuth returns a request handler function for App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// Server-side session helper for server components and API routes
export async function auth() {
  return getServerSession(authOptions)
}
