import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/authz'

vi.mock('@/lib/authz', () => ({
  getCurrentUser: vi.fn(),
}))

const { GET, POST } = await import('@/app/api/follow-ups/route')
const { PATCH: updateFollowUp, DELETE: deleteFollowUp } = await import(
  '@/app/api/follow-ups/[id]/route'
)

const mockUser = {
  id: 'fu-user-test-id',
  email: 'fu-test@example.com',
  name: 'FU Test User',
  role: 'STAFF' as const,
}

const mockAdmin = {
  id: 'fu-admin-id',
  email: 'fu-admin@example.com',
  name: 'FU Admin User',
  role: 'ADMIN' as const,
}

describe('Follow-ups API Integration', () => {
  let testLeadId: string

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

    const lead = await prisma.lead.create({
      data: {
        name: 'FU Test Lead',
        source: 'WEBSITE',
        status: 'NEW',
        ownerUserId: mockUser.id,
      },
    })
    testLeadId = lead.id
  })

  afterEach(async () => {
    await prisma.followUp.deleteMany({ where: { leadId: testLeadId } })
    await prisma.lead.deleteMany({ where: { ownerUserId: mockUser.id } })
    await prisma.user.deleteMany({
      where: { id: { in: [mockUser.id, mockAdmin.id, 'fu-other-user'] } },
    })
  })

  describe('GET /api/follow-ups', () => {
    it('should return empty array when no follow-ups exist', async () => {
      const req = new Request('http://localhost:3000/api/follow-ups')
      const response = await GET(req)
      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should return follow-ups for the current user', async () => {
      const scheduledAt = new Date(Date.now() + 86400000).toISOString()
      await prisma.followUp.create({
        data: {
          leadId: testLeadId,
          userId: mockUser.id,
          scheduledAt: new Date(scheduledAt),
          type: 'CALL',
          status: 'PENDING',
        },
      })

      const req = new Request('http://localhost:3000/api/follow-ups')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].type).toBe('CALL')
    })

    it('should filter follow-ups by dateRange=today', async () => {
      const now = new Date()
      const todayMidnight = new Date(now.setHours(0, 0, 0, 0))
      const todayNoon = new Date(now.setHours(12, 0, 0, 0))
      const tomorrow = new Date(now.getTime() + 86400000)
      tomorrow.setHours(12, 0, 0, 0)

      await prisma.followUp.createMany({
        data: [
          {
            leadId: testLeadId,
            userId: mockUser.id,
            scheduledAt: todayNoon,
            type: 'CALL',
            status: 'PENDING',
          },
          {
            leadId: testLeadId,
            userId: mockUser.id,
            scheduledAt: tomorrow,
            type: 'EMAIL',
            status: 'PENDING',
          },
        ],
      })

      const req = new Request('http://localhost:3000/api/follow-ups?dateRange=today')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].type).toBe('CALL')
    })

    it('should filter follow-ups by dateRange=completed', async () => {
      const now = new Date()
      const completedDate = new Date(now.getTime() - 86400000)

      await prisma.followUp.createMany({
        data: [
          {
            leadId: testLeadId,
            userId: mockUser.id,
            scheduledAt: now,
            type: 'CALL',
            status: 'PENDING',
          },
          {
            leadId: testLeadId,
            userId: mockUser.id,
            scheduledAt: completedDate,
            type: 'EMAIL',
            status: 'COMPLETED',
            completedAt: completedDate,
          },
        ],
      })

      const req = new Request('http://localhost:3000/api/follow-ups?dateRange=completed')
      const response = await GET(req)
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].status).toBe('COMPLETED')
    })

    it('should return 401 for unauthenticated user', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(null)
      const req = new Request('http://localhost:3000/api/follow-ups')
      const response = await GET(req)
      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/follow-ups', () => {
    it('should create a new follow-up', async () => {
      const scheduledAt = new Date(Date.now() + 86400000).toISOString()
      const req = new Request('http://localhost:3000/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: testLeadId,
          scheduledAt,
          type: 'CALL',
          notes: 'Discuss pricing',
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.leadId).toBe(testLeadId)
      expect(data.type).toBe('CALL')
    })

    it('should reject non-existent lead', async () => {
      const scheduledAt = new Date(Date.now() + 86400000).toISOString()
      const req = new Request('http://localhost:3000/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'nonexistent-lead',
          scheduledAt,
          type: 'CALL',
        }),
      })

      const response = await POST(req)
      expect(response.status).toBe(404)
    })

    it('should reject when staff tries to create follow-up for another users lead', async () => {
      const otherUser = await prisma.user.upsert({
        where: { id: 'fu-other-user' },
        update: {},
        create: {
          id: 'fu-other-user',
          email: 'fu-other@test.com',
          name: 'Others Lead',
          role: 'STAFF',
          passwordHash: 'hash',
        },
      })

      const otherLead = await prisma.lead.create({
        data: {
          name: 'Protected Lead',
          source: 'WEBSITE',
          status: 'NEW',
          ownerUserId: otherUser.id,
        },
      })

      const scheduledAt = new Date(Date.now() + 86400000).toISOString()
      const req = new Request('http://localhost:3000/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: otherLead.id,
          scheduledAt,
          type: 'CALL',
        }),
      })

      const response = await POST(req)
      expect(response.status).toBe(403)

      await prisma.lead.delete({ where: { id: otherLead.id } })
    })

    it('should allow admin to create follow-up for any lead', async () => {
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

      const scheduledAt = new Date(Date.now() + 86400000).toISOString()
      const req = new Request('http://localhost:3000/api/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: testLeadId,
          scheduledAt,
          type: 'MEETING',
        }),
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.type).toBe('MEETING')

      vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    })
  })

  describe('PATCH /api/follow-ups/[id]', () => {
    it('should mark follow-up as completed', async () => {
      const fu = await prisma.followUp.create({
        data: {
          leadId: testLeadId,
          userId: mockUser.id,
          scheduledAt: new Date(Date.now() + 86400000),
          type: 'CALL',
          status: 'PENDING',
        },
      })

      const params = Promise.resolve({ id: fu.id })
      const req = new Request(`http://localhost:3000/api/follow-ups/${fu.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      const response = await updateFollowUp(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('COMPLETED')
      expect(data.completedAt).toBeDefined()
    })

    it('should return 403 when staff tries to update another users follow-up', async () => {
      const otherUser = await prisma.user.upsert({
        where: { id: 'fu-other-user' },
        update: {},
        create: {
          id: 'fu-other-user',
          email: 'fu-other@test.com',
          name: 'Others Lead',
          role: 'STAFF',
          passwordHash: 'hash',
        },
      })

      const otherLead = await prisma.lead.create({
        data: {
          name: 'Protected Lead',
          source: 'WEBSITE',
          status: 'NEW',
          ownerUserId: otherUser.id,
        },
      })

      const fu = await prisma.followUp.create({
        data: {
          leadId: otherLead.id,
          userId: otherUser.id,
          scheduledAt: new Date(Date.now() + 86400000),
          type: 'CALL',
          status: 'PENDING',
        },
      })

      const params = Promise.resolve({ id: fu.id })
      const req = new Request(`http://localhost:3000/api/follow-ups/${fu.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      const response = await updateFollowUp(req, { params })
      expect(response.status).toBe(403)

      await prisma.lead.delete({ where: { id: otherLead.id } })
    })
  })

  describe('DELETE /api/follow-ups/[id]', () => {
    it('should delete a follow-up', async () => {
      const fu = await prisma.followUp.create({
        data: {
          leadId: testLeadId,
          userId: mockUser.id,
          scheduledAt: new Date(Date.now() + 86400000),
          type: 'CALL',
          status: 'PENDING',
        },
      })

      const params = Promise.resolve({ id: fu.id })
      const req = new Request(`http://localhost:3000/api/follow-ups/${fu.id}`, {
        method: 'DELETE',
      })

      const response = await deleteFollowUp(req, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 404 for non-existent follow-up', async () => {
      const params = Promise.resolve({ id: 'nonexistent-fu' })
      const req = new Request('http://localhost:3000/api/follow-ups/nonexistent')
      const response = await deleteFollowUp(req, { params })
      expect(response.status).toBe(404)
    })
  })
})
