import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Trainer } from '../types/content'
import { toImage, unwrap } from './shared'

async function fetchTrainers(): Promise<Trainer[]> {
  const rows = await supabase
    .from('trainers')
    .select('slug, name, position, years_experience, specializations, photo')
    .eq('published', true)
    .order('sort_order')
    .then(unwrap)

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    position: row.position,
    yearsExperience: row.years_experience,
    specializations: row.specializations,
    photo: toImage(row.photo, `trainer ${row.slug} photo`),
  }))
}

export const trainersQuery = queryOptions({ queryKey: ['trainers'], queryFn: fetchTrainers })

export const useTrainers = () => useSuspenseQuery(trainersQuery).data
