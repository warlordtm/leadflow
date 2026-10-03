'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBar from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)

      const res = await fetch(`/api/leads?${params.toString()}`)
      const data = await res.json()
      setLeads(data)
    } catch (e) {
      console.error('Error fetching leads:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [search, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLeads()
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Leads
          </h1>
          <Link href="/leads/new">
            <Button variant="primary" className="transition-transform hover:-translate-y-px">
              + New Lead
            </Button>
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-border bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-all duration-150 focus:border-primary focus:ring-primary/20"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-lg border border-border-subtle bg-white p-8 text-center">
            <p className="text-sm text-gray-500">No leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border-subtle">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.email || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.phone || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.source?.replace('_', ' ') || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <Badge
                        variant={
                          statusBadgeVariant[lead.status as StatusKey] || 'default'
                        }
                      >
                        {statusLabels[lead.status] || lead.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
