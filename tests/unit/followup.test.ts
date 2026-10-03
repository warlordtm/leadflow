import { describe, it, expect } from 'vitest'
import {
  createFollowUpSchema,
  updateFollowUpSchema,
  followUpFilterSchema,
} from '@/lib/validations/followup'

describe('FollowUp Validation', () => {
  describe('createFollowUpSchema', () => {
    it('should accept valid data', () => {
      const result = createFollowUpSchema.safeParse({
        leadId: 'lead123',
        scheduledAt: '2026-10-15T10:00:00Z',
        type: 'CALL',
        notes: 'Call about the quote',
      })
      expect(result.success).toBe(true)
    })

    it('should accept minimal data (notes optional)', () => {
      const result = createFollowUpSchema.safeParse({
        leadId: 'lead123',
        scheduledAt: '2026-10-15T10:00:00Z',
        type: 'CALL',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty leadId', () => {
      const result = createFollowUpSchema.safeParse({
        leadId: '',
        scheduledAt: '2026-10-15T10:00:00Z',
        type: 'CALL',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid type', () => {
      const result = createFollowUpSchema.safeParse({
        leadId: 'lead123',
        scheduledAt: '2026-10-15T10:00:00Z',
        type: 'INVALID_TYPE',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid date', () => {
      const result = createFollowUpSchema.safeParse({
        leadId: 'lead123',
        scheduledAt: 'not-a-date',
        type: 'CALL',
      })
      expect(result.success).toBe(false)
    })

    it('should accept all valid types', () => {
      const types = ['CALL', 'MESSAGE', 'EMAIL', 'MEETING', 'OTHER']
      for (const type of types) {
        const result = createFollowUpSchema.safeParse({
          leadId: 'lead123',
          scheduledAt: '2026-10-15T10:00:00Z',
          type,
        })
        expect(result.success).toBe(true)
      }
    })

    it('should cap notes at 2000 characters', () => {
      const result = createFollowUpSchema.safeParse({
        leadId: 'lead123',
        scheduledAt: '2026-10-15T10:00:00Z',
        type: 'CALL',
        notes: 'x'.repeat(2001),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('updateFollowUpSchema', () => {
    it('should require id', () => {
      const result = updateFollowUpSchema.safeParse({
        status: 'COMPLETED',
      })
      expect(result.success).toBe(false)
    })

    it('should accept valid update with id', () => {
      const result = updateFollowUpSchema.safeParse({
        id: 'fu123',
        status: 'COMPLETED',
        notes: 'Called and left voicemail',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('followUpFilterSchema', () => {
    it('should accept empty params', () => {
      const result = followUpFilterSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should accept valid dateRange', () => {
      const result = followUpFilterSchema.safeParse({
        dateRange: 'today',
      })
      expect(result.success).toBe(true)
    })

    it('should accept valid status', () => {
      const result = followUpFilterSchema.safeParse({
        status: 'COMPLETED',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid dateRange', () => {
      const result = followUpFilterSchema.safeParse({
        dateRange: 'invalid-range',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid status', () => {
      const result = followUpFilterSchema.safeParse({
        status: 'INVALID_STATUS',
      })
      expect(result.success).toBe(false)
    })
  })
})
