import { auth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProfileSettingsPage() {
  const session = await auth()

  if (!session?.user) {
    return <p className="text-gray-600">Not authenticated.</p>
  }

  const role = (session.user as { role: string }).role

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-gray-200">
          <div className="py-4">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{session.user.name}</dd>
          </div>
          <div className="py-4">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{session.user.email}</dd>
          </div>
          <div className="py-4">
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {role}
              </span>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
