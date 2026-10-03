'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NavBar from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'

const sources = [
  'WHATSAPP',
  'INSTAGRAM',
  'FACEBOOK',
  'WEBSITE',
  'REFERRAL',
  'PHONE',
  'OTHER',
]

export default function NewLeadPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [source, setSource] = useState('OTHER')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, company, source, notes }),
    })

    if (res.ok) {
      router.push('/leads')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create lead')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <NavBar />
      <div className="mx-auto max-w-2xl px-6 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            New Lead
          </h1>
          <Link
            href="/leads"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Leads
          </Link>
        </div>

        <div className="rounded-xl border border-border-subtle bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-md bg-error/10 p-3.5 text-sm text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              type="text"
              required
              placeholder="Jane Cooper"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Company"
              type="text"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3.5 py-2 text-sm text-gray-900 outline-none transition-all duration-150 focus:border-primary focus:ring-primary/20"
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              label="Notes"
              placeholder="Any additional context..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Lead'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
