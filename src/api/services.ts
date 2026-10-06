import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Service, ServiceDetail } from '../types/content'
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

async function fetchService(slug: string): Promise<ServiceDetail | null> {
  const { data: row, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw error
  if (!row) return null

  return {
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    image: toImage(row.image, `service ${row.slug} image`),
    body: row.body,
    benefits: row.benefits,
    audience: row.audience,
    whatToExpect: row.what_to_expect,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  }
}

export const serviceQuery = (slug: string) =>
  queryOptions({ queryKey: ['services', slug], queryFn: () => fetchService(slug) })

export const useService = (slug: string) => useSuspenseQuery(serviceQuery(slug)).data
