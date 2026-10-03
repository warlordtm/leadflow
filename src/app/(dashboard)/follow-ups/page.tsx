'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/nav-bar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs } from '@/components/ui/tabs'

const tabs = [
  { id: 'today', label: "Today's" },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
]

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('today')

  const fetchFollowUps = async (dateRange: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/follow-ups?dateRange=${dateRange}`)
      const data = await res.json()
      setFollowUps(data)
    } catch (e) {
      console.error('Error fetching follow-ups:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFollowUps(activeTab)
  }, [activeTab])

  const handleComplete = async (id: string) => {
    await fetch(`/api/follow-ups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    fetchFollowUps(activeTab)
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOverdue = (followUp: any) => {
    return (
      followUp.status === 'PENDING' &&
      new Date(followUp.scheduledAt) < new Date()
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Follow-ups
          </h1>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-8"
        />

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : followUps.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-500">
              No follow-ups in this view.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {followUps.map((fu) => (
              <Card
                key={fu.id}
                className={`p-4 transition-shadow hover:shadow-md ${
                  isOverdue(fu)
                    ? 'border-red-200 bg-error/5'
                    : 'border-border-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {fu.lead?.name || 'Unknown lead'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(fu.scheduledAt)}{' '}
                      • {fu.type.replace('_', ' ')}
                    </p>
                    {fu.notes && (
                      <p className="mt-1 text-sm text-gray-500">
                        {fu.notes}
                      </p>
                    )}
                    {fu.status === 'COMPLETED' && (
                      <Badge
                        variant="success"
                        className="mt-2"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>
                  {fu.status === 'PENDING' && (
                    <button
                      onClick={() => handleComplete(fu.id)}
                      className="text-sm font-medium text-success hover:text-success/80 hover:underline transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
