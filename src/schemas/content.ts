/*
  Runtime schemas for jsonb content coming out of the database. Shared by the
  public site (to validate what it renders) and the admin forms (to validate
  what gets saved). Written with zod/mini, which tree-shakes to a fraction of
  full Zod, because these run on every public page.
*/
import * as z from 'zod/mini'
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
export const imageSchema: z.ZodMiniType<Image, Image> = z.object({
  src: z.string().check(z.minLength(1)),
  alt: z.string(),
  width: z.number().check(z.positive()),
  height: z.number().check(z.positive()),
  widths: z.array(z.number().check(z.positive())).check(z.minLength(1)),
  ext: z.optional(z.enum(['webp', 'jpg'])),
})

const ctaSchema: z.ZodMiniType<Cta, Cta> = z.object({
  label: z.string().check(z.minLength(1)),
  to: z.string().check(z.minLength(1)),
})

export const heroSchema: z.ZodMiniType<HeroContent, HeroContent> = z.object({
  heading: z.string().check(z.minLength(1)),
  subheading: z.string(),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  image: imageSchema,
  background: z.optional(z.enum(['image', 'video'])),
})

export const statsSchema: z.ZodMiniType<{ items: Stat[] }, { items: Stat[] }> = z.object({
  items: z.array(z.object({ value: z.string().check(z.minLength(1)), label: z.string().check(z.minLength(1)) })),
})

export const aboutSchema: z.ZodMiniType<AboutContent, AboutContent> = z.object({
  heading: z.string().check(z.minLength(1)),
  body: z.string(),
  images: z.tuple([imageSchema, imageSchema]),
})

export const whyUsSchema: z.ZodMiniType<WhyUsContent, WhyUsContent> = z.object({
  heading: z.string().check(z.minLength(1)),
  items: z.array(z.object({ title: z.string().check(z.minLength(1)), description: z.string() })),
})

export const trialCtaSchema: z.ZodMiniType<TrialCtaContent, TrialCtaContent> = z.object({
  heading: z.string().check(z.minLength(1)),
  body: z.string(),
  cta: ctaSchema,
  image: imageSchema,
})

export const aboutPageSchema: z.ZodMiniType<AboutPageContent, AboutPageContent> = z.object({
  title: z.string().check(z.minLength(1)),
  intro: z.string(),
  image: imageSchema,
  story: z.object({ heading: z.string().check(z.minLength(1)), body: z.string() }),
  values: whyUsSchema,
  facilities: z.object({ heading: z.string().check(z.minLength(1)), items: z.array(z.string().check(z.minLength(1))), image: imageSchema }),
  community: z.object({ heading: z.string().check(z.minLength(1)), body: z.string(), image: imageSchema }),
})

export const openingHoursSchema: z.ZodMiniType<OpeningHours[]> = z.array(
  z.object({ days: z.string().check(z.minLength(1)), hours: z.string().check(z.minLength(1)) }),
)

/** Parses jsonb, returning null (and warning in dev) instead of crashing the page. */
export function parseOrNull<T>(schema: z.ZodMiniType<T>, value: unknown, label: string): T | null {
  const result = schema.safeParse(value)
  if (result.success) return result.data
  if (import.meta.env.DEV) console.warn(`Invalid ${label} content`, result.error.issues)
  return null
}
