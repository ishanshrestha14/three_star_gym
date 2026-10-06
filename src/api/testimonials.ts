import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Testimonial } from '../types/content'
import { unwrap } from './shared'

async function fetchTestimonials(): Promise<Testimonial[]> {
  const rows = await supabase
    .from('testimonials')
    .select('id, name, rating, content, source, review_date')
    .eq('published', true)
    .order('sort_order')
    .then(unwrap)

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    rating: row.rating,
    content: row.content,
    source: row.source as Testimonial['source'],
    date: row.review_date ?? '',
  }))
}

export const testimonialsQuery = queryOptions({ queryKey: ['testimonials'], queryFn: fetchTestimonials })

export const useTestimonials = () => useSuspenseQuery(testimonialsQuery).data
