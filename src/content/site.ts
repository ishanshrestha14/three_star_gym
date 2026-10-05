/*
  Placeholder site settings — edit freely.
  Mirrors the future `site_settings` table; once the CMS is connected this
  file becomes the fallback and the admin panel becomes the source of truth.
*/

export type OpeningHours = { days: string; hours: string }

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
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  openingHours: OpeningHours[]
}

export const site: SiteSettings = {
  name: 'Three Star Fitness',
  shortName: 'Three Star',
  city: 'Kathmandu',
  area: 'Baneshwor',
  description:
    'Strength training, personal coaching and group classes in Kathmandu. Book a free trial session.',
  phone: '+977 9800000000',
  whatsappNumber: '9779800000000',
  whatsappMessage:
    'Hi, I found your gym through your website and would like to know about membership plans.',
  email: 'hello@threestarfitness.com.np',
  address: 'New Baneshwor, Kathmandu 44600',
  googleMapsUrl: 'https://maps.google.com/?q=New+Baneshwor+Kathmandu',
  instagramUrl: 'https://instagram.com/',
  facebookUrl: 'https://facebook.com/',
  openingHours: [
    { days: 'Sunday – Friday', hours: '5:00 am – 9:00 pm' },
    { days: 'Saturday', hours: '7:00 am – 12:00 pm' },
  ],
}

export type NavItem = { label: string; to: string }

export const primaryNav: NavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Membership', to: '/membership' },
  { label: 'Trainers', to: '/trainers' },
  { label: 'Blog', to: '/blog' },
]

export const secondaryNav: NavItem[] = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]
