import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import {
  aboutSchema,
  heroSchema,
  imageSchema,
  parseOrNull,
  statsSchema,
  trialCtaSchema,
  whyUsSchema,
} from '../schemas/content'
import type {
  AboutContent,
  Faq,
  HeroContent,
  MembershipPlan,
  Service,
  Stat,
  Testimonial,
  Trainer,
  Transformation,
  TrialCtaContent,
  WhyUsContent,
} from '../types/content'

export type HomepageData = {
  hero: HeroContent | null
  stats: Stat[]
  about: AboutContent | null
  whyUs: WhyUsContent | null
  trialCta: TrialCtaContent | null
  services: Service[]
  trainers: Trainer[]
  plans: MembershipPlan[]
  faqs: Faq[]
  testimonials: Testimonial[]
  transformations: Transformation[]
}

const image = (value: unknown, label: string) => (value == null ? null : parseOrNull(imageSchema, value, label))

function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) throw error
  return data as T
}

/*
  Every query filters on published/visible explicitly: RLS would also show
  drafts to a logged-in admin, and the public site must never render those.
*/
async function fetchHomepage(): Promise<HomepageData> {
  const [sections, services, trainers, plans, faqs, testimonials, transformations] = await Promise.all([
    supabase.from('homepage_sections').select('key, content').eq('is_visible', true).then(unwrap),
    supabase
      .from('services')
      .select('slug, title, short_description, image')
      .eq('published', true)
      .order('sort_order')
      .then(unwrap),
    supabase
      .from('trainers')
      .select('slug, name, position, years_experience, specializations, photo')
      .eq('published', true)
      .order('sort_order')
      .limit(4)
      .then(unwrap),
    supabase
      .from('membership_plans')
      .select('id, name, price_npr, duration_label, features, is_popular')
      .eq('published', true)
      .order('sort_order')
      .then(unwrap),
    supabase.from('faqs').select('id, question, answer').eq('published', true).order('sort_order').limit(5).then(unwrap),
    supabase
      .from('testimonials')
      .select('id, name, rating, content, source, review_date')
      .eq('published', true)
      .order('sort_order')
      .limit(6)
      .then(unwrap),
    supabase
      .from('transformations')
      .select('id, person_name, before_image, after_image, duration_label, result, testimonial')
      .eq('published', true)
      .order('sort_order')
      .limit(3)
      .then(unwrap),
  ])

  const section = (key: string) => sections.find((row) => row.key === key)?.content

  return {
    hero: parseOrNull(heroSchema, section('hero'), 'hero'),
    stats: parseOrNull(statsSchema, section('stats'), 'stats')?.items ?? [],
    about: parseOrNull(aboutSchema, section('about'), 'about'),
    whyUs: parseOrNull(whyUsSchema, section('why_us'), 'why us'),
    trialCta: parseOrNull(trialCtaSchema, section('trial_cta'), 'trial CTA'),
    services: services.map((row) => ({
      slug: row.slug,
      title: row.title,
      shortDescription: row.short_description,
      image: image(row.image, `service ${row.slug} image`),
    })),
    trainers: trainers.map((row) => ({
      slug: row.slug,
      name: row.name,
      position: row.position,
      yearsExperience: row.years_experience,
      specializations: row.specializations,
      photo: image(row.photo, `trainer ${row.slug} photo`),
    })),
    plans: plans.map((row) => ({
      id: row.id,
      name: row.name,
      priceNpr: row.price_npr,
      durationLabel: row.duration_label,
      features: row.features,
      isPopular: row.is_popular,
    })),
    faqs,
    testimonials: testimonials.map((row) => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      content: row.content,
      source: row.source as Testimonial['source'],
      date: row.review_date ?? '',
    })),
    transformations: transformations.flatMap((row) => {
      const before = image(row.before_image, 'transformation before image')
      const after = image(row.after_image, 'transformation after image')
      if (!before || !after) return []
      return [
        {
          id: row.id,
          personName: row.person_name,
          before,
          after,
          durationLabel: row.duration_label,
          result: row.result,
          testimonial: row.testimonial,
        },
      ]
    }),
  }
}

export const homepageQuery = queryOptions({
  queryKey: ['homepage'],
  queryFn: fetchHomepage,
})

export function useHomepage() {
  return useSuspenseQuery(homepageQuery).data
}
