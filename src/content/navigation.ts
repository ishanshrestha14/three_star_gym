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
