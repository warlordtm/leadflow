'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/nav-bar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (e) {
      console.error('Error fetching users:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data)
    } catch (e) {
      console.error('Error fetching leads:', e)
    } finally {
      setLoading(false)
    }
  }

  const reassignLead = async (leadId: string, newOwnerId: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerUserId: newOwnerId }),
      })
      fetchLeads()
    } catch (e) {
      console.error('Error reassigning lead:', e)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      fetchUsers()
    } catch (e) {
      console.error('Error updating role:', e)
    }
  }

  useEffect(() => {
    if (activeTab === 'users') fetchUsers()
    if (activeTab === 'leads') fetchLeads()
  }, [activeTab])

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Panel
          </h1>
          <div className="flex space-x-2">
              <Button
              variant={activeTab === 'users' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('users')}
              size="sm"
            >
              Users
            </Button>
            <Button
              variant={activeTab === 'leads' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('leads')}
              size="sm"
            >
              Lead Assignment
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : activeTab === 'users' ? (
          <Card className="p-6">
            <table className="w-full min-w-full">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-3 text-sm font-medium text-gray-900">{user.name || '-'}</td>
                    <td className="py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="w-32 rounded-md border border-border px-2 py-1 text-sm"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="STAFF">STAFF</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'warning' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-6">
            <table className="w-full min-w-full">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reassign</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-3 font-medium text-gray-900">{lead.name || 'Unknown'}</td>
                    <td className="py-3">{lead.status}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {users.find(u => u.id === lead.ownerUserId)?.name || 'Unassigned'}
                    </td>
                    <td className="py-3">
                      <select
                        value={lead.ownerUserId || ''}
                        onChange={(e) => reassignLead(lead.id, e.target.value)}
                        className="w-48 rounded-md border border-border px-2 py-1 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name || u.email}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
