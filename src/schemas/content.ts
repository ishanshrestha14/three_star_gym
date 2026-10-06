/*
  Runtime schemas for jsonb content coming out of the database. Shared by the
  public site (to validate what it renders) and the admin forms (to validate
  what gets saved).
*/
import { z } from 'zod'
import type {
  AboutContent,
  AboutPageContent,
  Cta,
  HeroContent,
  Image,
  OpeningHours,
  Stat,
  TrialCtaContent,
  WhyUsContent,
} from '../types/content'

// Typed on both sides so forms can use it with React Hook Form.
export const imageSchema: z.ZodType<Image, Image> = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  widths: z.array(z.number().positive()).min(1),
  ext: z.enum(['webp', 'jpg']).optional(),
})

const ctaSchema: z.ZodType<Cta> = z.object({
  label: z.string().min(1),
  to: z.string().min(1),
})

export const heroSchema: z.ZodType<HeroContent> = z.object({
  heading: z.string().min(1),
  subheading: z.string(),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  image: imageSchema,
})

export const statsSchema: z.ZodType<{ items: Stat[] }> = z.object({
  items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })),
})

export const aboutSchema: z.ZodType<AboutContent> = z.object({
  heading: z.string().min(1),
  body: z.string(),
  images: z.tuple([imageSchema, imageSchema]),
})

export const whyUsSchema: z.ZodType<WhyUsContent> = z.object({
  heading: z.string().min(1),
  items: z.array(z.object({ title: z.string().min(1), description: z.string() })),
})

export const trialCtaSchema: z.ZodType<TrialCtaContent> = z.object({
  heading: z.string().min(1),
  body: z.string(),
  cta: ctaSchema,
  image: imageSchema,
})

export const aboutPageSchema: z.ZodType<AboutPageContent> = z.object({
  title: z.string().min(1),
  intro: z.string(),
  image: imageSchema,
  story: z.object({ heading: z.string().min(1), body: z.string() }),
  values: whyUsSchema,
  facilities: z.object({ heading: z.string().min(1), items: z.array(z.string().min(1)), image: imageSchema }),
  community: z.object({ heading: z.string().min(1), body: z.string(), image: imageSchema }),
})

export const openingHoursSchema: z.ZodType<OpeningHours[]> = z.array(
  z.object({ days: z.string().min(1), hours: z.string().min(1) }),
)

/** Parses jsonb, returning null (and warning in dev) instead of crashing the page. */
export function parseOrNull<T>(schema: z.ZodType<T>, value: unknown, label: string): T | null {
  const result = schema.safeParse(value)
  if (result.success) return result.data
  if (import.meta.env.DEV) console.warn(`Invalid ${label} content`, result.error.issues)
  return null
}
