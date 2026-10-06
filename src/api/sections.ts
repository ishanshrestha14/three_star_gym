import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { aboutSchema, heroSchema, parseOrNull, statsSchema, trialCtaSchema, whyUsSchema } from '../schemas/content'
import { unwrap } from './shared'

async function fetchSections() {
  // Filter on visibility explicitly: RLS also returns hidden sections to admins.
  const rows = await supabase.from('homepage_sections').select('key, content').eq('is_visible', true).then(unwrap)
  const section = (key: string) => rows.find((row) => row.key === key)?.content

  return {
    hero: parseOrNull(heroSchema, section('hero'), 'hero'),
    stats: parseOrNull(statsSchema, section('stats'), 'stats')?.items ?? [],
    about: parseOrNull(aboutSchema, section('about'), 'about'),
    whyUs: parseOrNull(whyUsSchema, section('why_us'), 'why us'),
    trialCta: parseOrNull(trialCtaSchema, section('trial_cta'), 'trial CTA'),
  }
}

export const sectionsQuery = queryOptions({ queryKey: ['sections'], queryFn: fetchSections })

export const useSections = () => useSuspenseQuery(sectionsQuery).data
