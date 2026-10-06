import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Service } from '../types/content'
import { toImage, unwrap } from './shared'

async function fetchServices(): Promise<Service[]> {
  const rows = await supabase
    .from('services')
    .select('slug, title, short_description, image')
    .eq('published', true)
    .order('sort_order')
    .then(unwrap)

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    image: toImage(row.image, `service ${row.slug} image`),
  }))
}

export const servicesQuery = queryOptions({ queryKey: ['services'], queryFn: fetchServices })

export const useServices = () => useSuspenseQuery(servicesQuery).data
