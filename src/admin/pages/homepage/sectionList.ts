import type { SectionKey } from '../../api/sections'

// In the order they appear on the homepage.
export const homepageSections: { key: SectionKey; title: string; description: string }[] = [
  { key: 'hero', title: 'Hero', description: 'The big headline, photo and buttons at the top of the homepage.' },
  { key: 'stats', title: 'Stats', description: 'The row of numbers under the hero. Use real figures only.' },
  { key: 'about', title: 'Introduction', description: 'The “More than a gym” section with two photos.' },
  { key: 'why_us', title: 'Why choose us', description: 'The list of reasons people stay.' },
  { key: 'trial_cta', title: 'Free trial banner', description: 'The full-width photo banner near the bottom. Also used on inner pages.' },
]

