import { z } from 'zod'

export const followUpTypeEnum = z.enum([
  'CALL',
  'MESSAGE',
  'EMAIL',
  'MEETING',
  'OTHER',
])

export const followUpStatusEnum = z.enum(['PENDING', 'COMPLETED', 'CANCELLED'])

export const createFollowUpSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  type: followUpTypeEnum,
  notes: z.string().max(2000).optional().or(z.literal('')),
})

export const updateFollowUpSchema = z.object({
  id: z.string().min(1),
  status: followUpStatusEnum.optional(),
  notes: z.string().max(2000).optional().or(z.literal('')),
})

export const followUpFilterSchema = z.object({
  status: followUpStatusEnum.optional(),
  dateRange: z.enum(['today', 'upcoming', 'overdue', 'completed']).optional(),
})
