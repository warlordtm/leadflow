import { auth } from '@/lib/auth'
import NavBar from '@/components/nav-bar'
import { Card } from '@/components/ui/card'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <NavBar />
        <div className="mx-auto max-w-2xl px-6 pt-8">
          <p className="text-gray-600">Not authenticated.</p>
        </div>
      </div>
    )
  }

  const roleVariant = (session.user as { role: string }).role === 'ADMIN'
    ? 'warning'
    : 'secondary'

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-2xl px-6 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>
        </div>

        <Card className="p-8">
          <dl className="divide-y divide-gray-200">
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {session.user.name}
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {session.user.email}
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {(session.user as { role: string }).role}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
