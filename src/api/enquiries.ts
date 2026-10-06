import type { Database } from '../types/database'
import { db } from '../lib/db'
import type { EnquiryInput } from '../schemas/enquiry'

export type EnquirySource = Database['public']['Enums']['enquiry_source']
export type EnquiryStatus = Database['public']['Enums']['enquiry_status']

type SubmitOptions = {
  source: EnquirySource
  subject?: string
  membershipPlanId?: string
}

export class EnquiryError extends Error {}

/** Sends a website form through the submit_enquiry() RPC (validated and rate-limited in Postgres). */
export async function submitEnquiry(input: EnquiryInput, { source, subject, membershipPlanId }: SubmitOptions) {
  const { error } = await db.rpc('submit_enquiry', {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email || undefined,
    p_message: input.message || undefined,
    p_subject: subject,
    p_source: source,
    p_membership_plan_id: membershipPlanId,
    p_page_path: window.location.pathname,
    p_website: input.website || undefined,
  })

  if (!error) return
  if (error.message === 'rate_limited' && error.hint) throw new EnquiryError(error.hint)
  throw new EnquiryError('Your message didn’t send. Check your connection and try again, or call or WhatsApp us.')
}
