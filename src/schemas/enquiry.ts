import { z } from 'zod'

/*
  Mirrors the CHECK constraints on public.enquiries. The database enforces the
  same rules, so this exists for instant, friendly feedback only.
*/
export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(100, 'Keep your name under 100 characters'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter a phone number so we can call you back')
    .regex(/^[0-9+() -]{7,20}$/, 'Enter a valid phone number, e.g. 98XXXXXXXX'),
  email: z.union([z.literal(''), z.email('Enter a valid email address or leave it blank').max(254)]),
  message: z.string().trim().max(2000, 'Keep your message under 2,000 characters'),
  // Honeypot: hidden from people, filled in by bots.
  website: z.string(),
})

export type EnquiryInput = z.infer<typeof enquirySchema>
