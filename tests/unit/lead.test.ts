import { describe, it, expect } from 'vitest'
import { createLeadSchema, updateLeadSchema, leadFilterSchema } from '@/lib/validations/lead'

describe('Lead Validation', () => {
  describe('createLeadSchema', () => {
    it('should accept valid lead data', () => {
      const result = createLeadSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Acme Inc',
        source: 'WEBSITE',
        notes: 'Interested in services',
      })
      expect(result.success).toBe(true)
    })

    it('should accept minimal data (name only)', () => {
      const result = createLeadSchema.safeParse({
        name: 'Jane Doe',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.source).toBe('OTHER')
        expect(result.data.status).toBe('NEW')
      }
    })

    it('should reject empty name', () => {
      const result = createLeadSchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const result = createLeadSchema.safeParse({
        name: 'John Doe',
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid source', () => {
      const result = createLeadSchema.safeParse({
        name: 'John Doe',
        source: 'INVALID_SOURCE',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid status', () => {
      const result = createLeadSchema.safeParse({
        name: 'John Doe',
        status: 'INVALID_STATUS',
      })
      expect(result.success).toBe(false)
    })

    it('should cap name at 200 characters', () => {
      const result = createLeadSchema.safeParse({
        name: 'x'.repeat(201),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateLeadSchema', () => {
    it('should accept valid update', () => {
      const result = updateLeadSchema.safeParse({
        id: 'lead123',
        name: 'Updated Name',
      })
      expect(result.success).toBe(true)
    })

    it('should require id', () => {
      const result = updateLeadSchema.safeParse({
        name: 'Updated Name',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('leadFilterSchema', () => {
    it('should accept empty params', () => {
      const result = leadFilterSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should accept search string', () => {
      const result = leadFilterSchema.safeParse({ search: 'john' })
      expect(result.success).toBe(true)
    })

    it('should accept valid status', () => {
      const result = leadFilterSchema.safeParse({ status: 'WON' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid status', () => {
      const result = leadFilterSchema.safeParse({ status: 'INVALID' })
      expect(result.success).toBe(false)
    })
  })
})
