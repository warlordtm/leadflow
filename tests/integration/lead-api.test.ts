import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/authz'

vi.mock('@/lib/authz', () => ({
  getCurrentUser: vi.fn(),
}))

const { GET, POST } = await import('@/app/api/leads/route')
const { GET: getOne, PATCH: updateLead, DELETE: deleteLead } = await import(
  '@/app/api/leads/[id]/route'
)

const mockUser = {
  id: 'user-test-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'STAFF' as const,
}

const mockAdmin = {
  id: 'admin-id',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'ADMIN' as const,
}

describe('Leads API Integration', () => {
  beforeEach(async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    await prisma.user.upsert({
      where: { id: mockUser.id },
      update: { email: mockUser.email, name: mockUser.name, role: 'STAFF' },
      create: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: 'STAFF',
        passwordHash: 'hashedpassword',
      },
    })
    await prisma.lead.deleteMany({ where: { ownerUserId: mockUser.id } })
  })

  afterEach(async () => {
    await prisma.lead.deleteMany({ where: { ownerUserId: mockUser.id } })
    await prisma.lead.deleteMany({ where: { ownerUserId: 'other-user' } })
    await prisma.user.deleteMany({
      where: { id: { in: [mockUser.id, mockAdmin.id, 'other-user'] } },
    })
  })

  describe('GET /api/leads', () => {
    it('should return empty array when no leads exist', async () => {
      const req = new Request('http://localhost:3000/api/leads')
      const response = await GET(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should return leads owned by the current user', async () => {
      await prisma.lead.create({
        data: {
          name: 'Test Lead',
          email: 'lead@test.com',
          source: 'WEBSITE',
          status: 'NEW',
          ownerUserId: mockUser.id,
        },
      })

      const req = new Request('http://localhost:3000/api/leads')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Test Lead')
    })

    it('should filter leads by status', async () => {
      await prisma.lead.createMany({
        data: [
          { name: 'Lead 1', source: 'WEBSITE', status: 'NEW', ownerUserId: mockUser.id },
          { name: 'Lead 2', source: 'WEBSITE', status: 'WON', ownerUserId: mockUser.id },
        ],
      })

      const req = new Request('http://localhost:3000/api/leads?status=WON')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].status).toBe('WON')
    })

    it('should search leads by name', async () => {
      await prisma.lead.createMany({
        data: [
          { name: 'John Doe', source: 'WEBSITE', status: 'NEW', ownerUserId: mockUser.id },
          { name: 'Jane Smith', source: 'WEBSITE', status: 'NEW', ownerUserId: mockUser.id },
        ],
      })

      const req = new Request('http://localhost:3000/api/leads?search=John')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('John Doe')
    })

    it('should return 401 for unauthenticated user', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(null)
      const req = new Request('http://localhost:3000/api/leads')
      const response = await GET(req)
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/leads', () => {
    it('should create a new lead', async () => {
      const req = new Request('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Lead',
          email: 'new@test.com',
          source: 'REFERRAL',
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('New Lead')
      expect(data.email).toBe('new@test.com')
      expect(data.source).toBe('REFERRAL')
      expect(data.status).toBe('NEW')

      await prisma.lead.delete({ where: { id: data.id } })
    })

    it('should reject invalid email', async () => {
      const req = new Request('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Lead',
          email: 'not-an-email',
        }),
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
    })

    it('should reject empty name', async () => {
      const req = new Request('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
        }),
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/leads/[id]', () => {
    it('should return lead by id', async () => {
      const lead = await prisma.lead.create({
        data: {
          name: 'Detail Lead',
          source: 'PHONE',
          status: 'CONTACTED',
          ownerUserId: mockUser.id,
        },
      })

      const params = Promise.resolve({ id: lead.id })
      const req = new Request('http://localhost:3000/api/leads/test')
      const response = await getOne(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Detail Lead')
    })

    it('should return 404 for non-existent lead', async () => {
      const params = Promise.resolve({ id: 'nonexistent' })
      const req = new Request('http://localhost:3000/api/leads/test')
      const response = await getOne(req, { params })
      expect(response.status).toBe(404)
    })
  })

  describe('PATCH /api/leads/[id]', () => {
    it('should update lead status', async () => {
      const lead = await prisma.lead.create({
        data: {
          name: 'Update Lead',
          source: 'WEBSITE',
          status: 'NEW',
          ownerUserId: mockUser.id,
        },
      })

      const params = Promise.resolve({ id: lead.id })
      const req = new Request(`http://localhost:3000/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'WON' }),
      })

      const response = await updateLead(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('WON')
    })

    it('should return 403 when another user tries to update lead (staff)', async () => {
      const otherUser = await prisma.user.upsert({
        where: { id: 'other-user' },
        update: { },
        create: {
          id: 'other-user',
          email: 'other@test.com',
          name: 'Other User',
          role: 'STAFF',
          passwordHash: 'hash',
        },
      })

      const lead = await prisma.lead.create({
        data: {
          name: 'Protected Lead',
          source: 'WEBSITE',
          status: 'NEW',
          ownerUserId: otherUser.id,
        },
      })

      const params = Promise.resolve({ id: lead.id })
      const req = new Request(`http://localhost:3000/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked' }),
      })

      const response = await updateLead(req, { params })
      expect(response.status).toBe(403)
    })

    it('should allow admin to update any lead', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(mockAdmin)

      await prisma.user.upsert({
        where: { id: mockAdmin.id },
        update: { email: mockAdmin.email, name: mockAdmin.name, role: 'ADMIN' },
        create: {
          id: mockAdmin.id,
          email: mockAdmin.email,
          name: mockAdmin.name,
          role: 'ADMIN',
          passwordHash: 'hashedpassword',
        },
      })

      const lead = await prisma.lead.create({
        data: {
          name: 'Admin Lead',
          source: 'WEBSITE',
          status: 'NEW',
          ownerUserId: mockUser.id,
        },
      })

      const params = Promise.resolve({ id: lead.id })
      const req = new Request(`http://localhost:3000/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated by Admin' }),
      })

      const response = await updateLead(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated by Admin')

      vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    })
  })
})
