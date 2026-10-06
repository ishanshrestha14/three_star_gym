/*
  Content shapes for CMS-managed data. Each type mirrors a future Supabase
  table (or a homepage_sections jsonb payload), so swapping the placeholder
  files for database queries won't change any component props.
*/

export type Image = {
  /** Path without size suffix, e.g. "/placeholder/hero" → "/placeholder/hero-1280.webp" */
  src: string
  alt: string
  width: number
  height: number
  /** Widths that exist on disk / in storage */
  widths: number[]
  /** File format; omitted means webp. Browsers that can't encode webp upload jpg. */
  ext?: 'webp' | 'jpg'
}

export type Cta = { label: string; to: string }

export type OpeningHours = { days: string; hours: string }

/** Empty strings mean "not set" for optional contact fields. */
export type SiteSettings = {
  name: string
  shortName: string
  city: string
  area: string
  description: string
  phone: string
  whatsappNumber: string // international format, digits only
  whatsappMessage: string
  email: string
  address: string
  googleMapsUrl: string
  instagramUrl: string
  facebookUrl: string
  tiktokUrl: string
  openingHours: OpeningHours[]
}

export type HeroContent = {
  /** Line breaks ("\n") are kept as visual lines */
  heading: string
  subheading: string
  primaryCta: Cta
  secondaryCta: Cta
  image: Image
}

export type Stat = { value: string; label: string }

export type AboutContent = {
  heading: string
  body: string
  images: [Image, Image]
}

export type WhyUsContent = {
  heading: string
  items: { title: string; description: string }[]
}

export type TrialCtaContent = {
  heading: string
  body: string
  cta: Cta
  image: Image
}

export type Service = {
  slug: string
  title: string
  shortDescription: string
  image: Image | null
}

export type ServiceDetail = Service & {
  body: string
  benefits: string[]
  audience: string
  whatToExpect: string
  seoTitle: string
  seoDescription: string
}

export type Trainer = {
  slug: string
  name: string
  position: string
  yearsExperience: number
  specializations: string[]
  photo: Image | null
  bio: string
}

export type TrainerDetail = Trainer & {
  certifications: string[]
  socialLinks: { instagram?: string; facebook?: string; tiktok?: string }
}

export type MembershipPlan = {
  id: string
  name: string
  priceNpr: number
  durationLabel: string
  durationMonths: number | null
  features: string[]
  isPopular: boolean
}

export type Faq = { id: string; question: string; answer: string; category: string }

export type Testimonial = {
  id: string
  name: string
  rating: number
  content: string
  source: 'google' | 'facebook' | 'website' | 'other'
  date: string
}

export type Transformation = {
  id: string
  personName: string
  before: Image
  after: Image
  durationLabel: string
  result: string
  testimonial: string
}

export type GalleryCategory = 'gym' | 'equipment' | 'training' | 'members' | 'events' | 'facilities'

export type GalleryImage = {
  id: string
  image: Image
  caption: string
  category: GalleryCategory
}

export type AboutPageContent = {
  title: string
  intro: string
  image: Image
  story: { heading: string; body: string }
  values: WhyUsContent
  facilities: { heading: string; items: string[]; image: Image }
  community: { heading: string; body: string; image: Image }
}

export type BlogCategory = { name: string; slug: string }

export type BlogPostSummary = {
  slug: string
  title: string
  excerpt: string
  coverImage: Image | null
  authorName: string
  publishedAt: string
  isFeatured: boolean
  category: BlogCategory | null
}

export type BlogPost = BlogPostSummary & {
  content: string
  tags: string[]
  author: { slug: string; name: string } | null
  seoTitle: string
  seoDescription: string
}
