import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EnquirySource, EnquiryStatus } from '../../api/enquiries'
import { supabase } from '../../lib/supabase'

export const STATUSES: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
  { value: 'spam', label: 'Spam' },
]

export const statusLabel = Object.fromEntries(STATUSES.map((s) => [s.value, s.label])) as Record<EnquiryStatus, string>

export const sourceLabel: Record<EnquirySource, string> = {
  contact_form: 'Contact form',
  free_trial: 'Free trial',
  membership: 'Membership',
  whatsapp: 'WhatsApp',
  website: 'Website',
}

export const PAGE_SIZE = 25

// Admin data must always be fresh: someone may have just submitted a form.
const fresh = { staleTime: 0, refetchOnWindowFocus: true } as const

/* ---------- Dashboard ---------- */

function count(query: PromiseLike<{ count: number | null; error: unknown }>) {
  return Promise.resolve(query).then(({ count, error }) => {
    if (error) throw error
    return count ?? 0
  })
}

const head = { count: 'exact', head: true } as const

export const dashboardQuery = queryOptions({
  queryKey: ['admin', 'dashboard'],
  ...fresh,
  queryFn: async () => {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const since = monthStart.toISOString()

    const [newCount, monthCount, trialCount, postCount, recent] = await Promise.all([
      count(supabase.from('enquiries').select('id', head).eq('status', 'new')),
      count(supabase.from('enquiries').select('id', head).gte('created_at', since)),
      count(supabase.from('enquiries').select('id', head).eq('source', 'free_trial').gte('created_at', since)),
      count(supabase.from('blog_posts').select('id', head).eq('status', 'published')),
      supabase
        .from('enquiries')
        .select('id, name, phone, source, status, created_at')
        .order('created_at', { ascending: false })
        .limit(6)
        .then(({ data, error }) => {
          if (error) throw error
          return data
        }),
    ])

    return { newCount, monthCount, trialCount, postCount, recent }
  },
})

/* ---------- List ---------- */

export const statusCountsQuery = queryOptions({
  queryKey: ['admin', 'enquiries', 'counts'],
  ...fresh,
  queryFn: async () => {
    const counts = await Promise.all(
      STATUSES.map(({ value }) => count(supabase.from('enquiries').select('id', head).eq('status', value))),
    )
    return Object.fromEntries(STATUSES.map(({ value }, i) => [value, counts[i]])) as Record<EnquiryStatus, number>
  },
})

export type EnquiryFilters = { status: EnquiryStatus | null; search: string; page: number }

// PostgREST filter syntax treats these as operators, so strip them from free text.
const cleanSearch = (value: string) => value.replace(/[,()%*\\]/g, ' ').trim()

export const enquiriesQuery = ({ status, search, page }: EnquiryFilters) =>
  queryOptions({
    queryKey: ['admin', 'enquiries', 'list', { status, search, page }],
    ...fresh,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let query = supabase
        .from('enquiries')
        .select('id, name, phone, source, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)

      if (status) query = query.eq('status', status)
      const term = cleanSearch(search)
      if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)

      const { data, count, error } = await query
      if (error) throw error
      return { rows: data, total: count ?? 0 }
    },
  })

/* ---------- Detail ---------- */

export const enquiryQuery = (id: string) =>
  queryOptions({
    queryKey: ['admin', 'enquiries', 'detail', id],
    ...fresh,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*, plan:membership_plans(name)')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      return data
    },
  })

export const enquiryNotesQuery = (id: string) =>
  queryOptions({
    queryKey: ['admin', 'enquiries', 'notes', id],
    ...fresh,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiry_notes')
        .select('id, body, created_at, author:admins(display_name, email)')
        .eq('enquiry_id', id)
        .order('created_at')
      if (error) throw error
      return data
    },
  })

/* ---------- Mutations ---------- */

function useInvalidateEnquiries() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'enquiries'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
    ])
}

export function useUpdateEnquiryStatus(id: string) {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: async (status: EnquiryStatus) => {
      const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}

export function useAddEnquiryNote(id: string) {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: async (body: string) => {
      const { error } = await supabase.from('enquiry_notes').insert({ enquiry_id: id, body })
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}

export function useDeleteEnquiry(id: string) {
  const invalidate = useInvalidateEnquiries()
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('enquiries').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}
