import { z } from 'zod'

export const leadSourceEnum = z.enum([
  'WHATSAPP',
  'INSTAGRAM',
  'FACEBOOK',
  'WEBSITE',
  'REFERRAL',
  'PHONE',
  'OTHER',
])

export const leadStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL',
  'WON',
  'LOST',
])

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Lead name is required').max(200),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  source: leadSourceEnum.optional().default('OTHER'),
  status: leadStatusEnum.optional().default('NEW'),
  notes: z.string().max(2000).optional().or(z.literal('')),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().min(1),
})

export const leadFilterSchema = z.object({
  search: z.string().optional(),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
  ownerUserId: z.string().optional(),
})
