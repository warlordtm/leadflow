'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/components/ui/badge'

const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']

const statusBadgeVariant: Record<string, BadgeVariant> = {
  NEW: 'primary',
  CONTACTED: 'secondary',
  QUALIFIED: 'secondary',
  PROPOSAL: 'warning',
  WON: 'success',
  LOST: 'error',
}

const statusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  WON: 'Won',
  LOST: 'Lost',
}

const followUpTypes = ['CALL', 'MESSAGE', 'EMAIL', 'MEETING', 'OTHER']

type Lead = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  source: string
  status: string
  notes: string | null
  ownerUserId: string
  createdAt: string
  updatedAt: string
  activities?: any[]
  followUps?: any[]
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  })
  const [followUpData, setFollowUpData] = useState({
    scheduledAt: '',
    type: 'CALL',
    notes: '',
  })

  useEffect(() => {
    fetchLead()
  }, [id])

  const fetchLead = async () => {
    const res = await fetch(`/api/leads/${id}`)
    if (res.ok) {
      const data = await res.json()
      setLead(data)
      setFormData({
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        notes: data.notes || '',
      })
    } else if (res.status === 403) {
      alert('You do not have permission to view this lead')
      router.push('/leads')
    } else if (res.status === 404) {
      router.push('/leads')
    }
    setLoading(false)
  }

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    const res = await fetch('/api/follow-ups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId: id,
        scheduledAt: followUpData.scheduledAt,
        type: followUpData.type,
        notes: followUpData.notes,
      }),
    })
    if (res.ok) {
      setShowFollowUpForm(false)
      setFollowUpData({ scheduledAt: '', type: 'CALL', notes: '' })
      fetchLead()
    }
    setUpdateLoading(false)
  }

  const handleCompleteFollowUp = async (id: string) => {
    await fetch(`/api/follow-ups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    fetchLead()
  }

  const handleStatusChange = async (newStatus: string) => {
    setUpdateLoading(true)
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setLead((prev: any) => (prev ? { ...prev, status: updated.status } : null))
    }
    setUpdateLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      const updated = await res.json()
      setLead((prev: any) => (prev ? { ...prev, ...updated } : null))
      setEditing(false)
    }
    setUpdateLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <NavBar />
        <div className="mx-auto max-w-4xl px-6 pt-8">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-6" />
          <div className="mb-6 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-64 animate-pulse rounded-xl bg-gray-200 md:col-span-2" />
            <div className="h-40 animate-pulse rounded-xl bg-gray-200 md:col-span-2" />
          </div>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <NavBar />
        <div className="mx-auto max-w-4xl px-6 pt-8">
          <p className="text-gray-500">Lead not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {lead.name}
          </h1>
          <Link
            href="/leads"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Leads
          </Link>
        </div>

        <Badge
          variant={statusBadgeVariant[lead.status] || 'default'}
          className="mb-6 px-3 py-1 text-sm font-medium uppercase tracking-wider"
        >
          {statusLabels[lead.status] || lead.status}
        </Badge>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Lead Information
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.email || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.phone || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.company || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.source?.replace('_', ' ') || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Update Status
            </h2>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updateLoading || lead.status === s}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ease-spring ${
                    lead.status === s
                      ? 'ring-2 ring-primary bg-primary/10 text-primary'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-y-0.5'
                  } disabled:opacity-50 disabled:hover:transform-none`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Follow-ups
              </h2>
              <button
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {showFollowUpForm ? 'Cancel' : '+ Schedule Follow-up'}
              </button>
            </div>

            {showFollowUpForm && (
              <form onSubmit={handleFollowUp} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    When
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={followUpData.scheduledAt}
                    onChange={(e) =>
                      setFollowUpData({
                        ...followUpData,
                        scheduledAt: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-border bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-all duration-150 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Type
                  </label>
                  <select
                    value={followUpData.type}
                    onChange={(e) =>
                      setFollowUpData({
                        ...followUpData,
                        type: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-border bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-all duration-150 focus:border-primary focus:ring-primary/20"
                  >
                    {followUpTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <Textarea
                  label="Notes"
                  placeholder="What to discuss at this follow-up..."
                  rows={3}
                  value={followUpData.notes}
                  onChange={(e) =>
                    setFollowUpData({
                      ...followUpData,
                      notes: e.target.value,
                    })
                  }
                />
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    loading={updateLoading}
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Scheduling...' : 'Schedule'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFollowUpForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {lead.followUps && lead.followUps.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {lead.followUps.map((fu: any) => (
                  <li
                    key={fu.id}
                    className="flex items-center justify-between rounded-lg border border-border-subtle p-3 transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(fu.scheduledAt).toLocaleString()}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {fu.type.replace('_', ' ')}
                      </span>
                    </div>
                    {fu.status === 'PENDING' && (
                      <button
                        onClick={() => handleCompleteFollowUp(fu.id)}
                        className="text-sm font-medium text-success hover:text-success/80 hover:underline transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                No follow-ups scheduled.
              </p>
            )}
          </Card>

          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editing ? (
              <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                <Textarea
                  placeholder="Add notes about this lead..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  loading={updateLoading}
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Saving...' : 'Save'}
                </Button>
              </form>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                {lead.notes || 'No notes yet.'}
              </p>
            )}
          </Card>

          <Card className="p-6 md:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Activity History
            </h2>
            {lead.activities && lead.activities.length > 0 ? (
              <ul className="space-y-3">
                {lead.activities.map((activity: any) => (
                  <li
                    key={activity.id}
                    className="flex items-start justify-between text-sm text-gray-600"
                  >
                    <div>
                      <span className="font-medium text-gray-900">
                        {activity.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No activity yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
