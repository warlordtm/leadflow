import { describe, it, expect } from 'vitest'

// Test the registration validation schema
import { registerSchema } from '@/lib/validations/auth'

describe('Auth Validation', () => {
  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('should reject empty name', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject short password', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('8 characters')
    }
  })

  it('should accept valid input', () => {
    const result = registerSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })
})
