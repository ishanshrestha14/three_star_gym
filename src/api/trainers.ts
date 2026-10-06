import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { db } from '../lib/db'
import { z } from 'zod'
import { parseOrNull } from '../schemas/content'
import type { Trainer, TrainerDetail } from '../types/content'
import { toImage, unwrap } from './shared'

async function fetchTrainers(): Promise<Trainer[]> {
  const rows = await db
    .from('trainers')
    .select('slug, name, position, years_experience, specializations, photo, bio')
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
    bio: row.bio,
  }))
}

export const trainersQuery = queryOptions({ queryKey: ['trainers'], queryFn: fetchTrainers })

export const useTrainers = () => useSuspenseQuery(trainersQuery).data

const socialLinksSchema = z.object({
  instagram: z.url().optional(),
  facebook: z.url().optional(),
  tiktok: z.url().optional(),
})

async function fetchTrainer(slug: string): Promise<TrainerDetail | null> {
  const { data: row, error } = await db
    .from('trainers')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw error
  if (!row) return null

  return {
    slug: row.slug,
    name: row.name,
    position: row.position,
    yearsExperience: row.years_experience,
    specializations: row.specializations,
    photo: toImage(row.photo, `trainer ${row.slug} photo`),
    bio: row.bio,
    certifications: row.certifications,
    socialLinks: parseOrNull(socialLinksSchema, row.social_links, 'trainer social links') ?? {},
  }
}

export const trainerQuery = (slug: string) =>
  queryOptions({ queryKey: ['trainers', slug], queryFn: () => fetchTrainer(slug) })

export const useTrainer = (slug: string) => useSuspenseQuery(trainerQuery(slug)).data
