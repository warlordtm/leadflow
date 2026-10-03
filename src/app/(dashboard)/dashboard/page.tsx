'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBar from '@/components/nav-bar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { BadgeVariant } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const statusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  WON: 'Won',
  LOST: 'Lost',
}

const statusBadgeVariant: Record<string, BadgeVariant> = {
  NEW: 'primary',
  CONTACTED: 'secondary',
  QUALIFIED: 'secondary',
  PROPOSAL: 'warning',
  WON: 'success',
  LOST: 'error',
}

type StatusKey = keyof typeof statusBadgeVariant

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (res.ok) {
        const d = await res.json()
        setData(d)
      }
    } catch (e) {
      console.error('Error fetching dashboard:', e)
    } finally {
      setLoading(false)
    }
  }

  const markComplete = async (id: string) => {
    await fetch(`/api/follow-ups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    fetchDashboard()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <NavBar />
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Dashboard
        </h1>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(data.leadCounts || {}).map(([status, count]) => (
            <Card
              key={status}
              className="border border-border-subtle p-5 text-center transition-transform hover:-translate-y-1"
            >
              <Badge
                variant={
                  statusBadgeVariant[status as StatusKey] || 'default'
                }
                className="mb-2 px-3 py-1 text-xs font-medium uppercase tracking-wider"
              >
                {statusLabels[status] || status}
              </Badge>
              <p className="text-3xl font-bold text-gray-900">
                {count as number}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Today&apos;s Follow-ups (
              {data.todaysFollowUps?.length || 0})
            </h2>
            {data.todaysFollowUps?.length === 0 ? (
              <p className="text-sm text-gray-500">
                No follow-ups due today.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.todaysFollowUps.map((fu: any) => (
                  <li
                    key={fu.id}
                    className="flex items-center justify-between rounded-lg border border-border-subtle p-3 transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {fu.lead?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(fu.scheduledAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' '}
                        • {fu.type.replace('_', ' ')}
                      </p>
                    </div>
                    <button
                      onClick={() => markComplete(fu.id)}
                      className="text-sm font-medium text-success hover:text-success/80 hover:underline transition-colors"
                    >
                      Complete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="border border-red-200 p-6">
            <h2 className="mb-4 text-lg font-semibold text-error">
              Overdue ({data.overdueFollowUps?.length || 0})
            </h2>
            {data.overdueFollowUps?.length === 0 ? (
              <p className="text-sm text-gray-500">
                No overdue follow-ups.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.overdueFollowUps.map((fu: any) => (
                  <li
                    key={fu.id}
                    className="rounded-lg border border-red-200 bg-error/5 p-3 transition-colors hover:bg-error/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {fu.lead?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {fu.type.replace('_', ' ')}{' '}
                          • Due: {new Date(fu.scheduledAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => markComplete(fu.id)}
                        className="text-sm font-medium text-success hover:text-success/80 hover:underline transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Upcoming (Next 7 days) (
              {data.upcomingFollowUps?.length || 0})
            </h2>
            {data.upcomingFollowUps?.length === 0 ? (
              <p className="text-sm text-gray-500">
                No upcoming follow-ups.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.upcomingFollowUps.map((fu: any) => (
                  <li
                    key={fu.id}
                    className="border-b border-border-subtle pb-3 last:border-0"
                  >
                    <p className="font-medium text-gray-900">
                      {fu.lead?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(fu.scheduledAt).toLocaleDateString()}{' '}
                      • {fu.type.replace('_', ' ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Leads
              </h2>
              <Link
                href="/leads"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                All leads →
              </Link>
            </div>
            {data.recentLeads?.length === 0 ? (
              <p className="text-sm text-gray-500">No leads yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentLeads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2.5">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="text-primary font-medium hover:underline"
                          >
                            {lead.name}
                          </Link>
                        </td>
                        <td className="py-2.5">
                          <Badge
                            variant={
                              statusBadgeVariant[lead.status as StatusKey] || 'default'
                            }
                            className="px-2.5 py-0.5 text-xs font-medium"
                          >
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-sm text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
