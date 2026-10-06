import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Faq } from '../types/content'
import { unwrap } from './shared'

async function fetchFaqs(): Promise<Faq[]> {
  return supabase
    .from('faqs')
    .select('id, question, answer, category')
    .eq('published', true)
    .order('sort_order')
    .then(unwrap)
}

export const faqsQuery = queryOptions({ queryKey: ['faqs'], queryFn: fetchFaqs })

export const useFaqs = () => useSuspenseQuery(faqsQuery).data
