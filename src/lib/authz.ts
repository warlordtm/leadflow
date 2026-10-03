import { Role } from '@prisma/client'
import { auth } from '@/lib/auth'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: Role
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth()
  if (!session?.user) return null
  return {
    id: session.user.id,
    email: session.user.email as string,
    name: session.user.name as string,
    role: (session.user as { role: string }).role as Role,
  }
}

export function isAdmin(user: SessionUser | null): boolean {
  return !!user && user.role === Role.ADMIN
}

export function isStaff(user: SessionUser | null): boolean {
  return !!user && user.role === Role.STAFF
}
