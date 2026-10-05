import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import { logger } from '@/lib/logger'

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
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
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
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
