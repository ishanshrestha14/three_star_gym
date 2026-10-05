import { Star } from 'lucide-react'
import type { Testimonial } from '../../types/content'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

const sourceLabel: Record<Testimonial['source'], string> = {
  google: 'Google review',
  facebook: 'Facebook review',
  website: 'Member review',
  other: 'Member review',
}

/* Only real reviews belong here; the section disappears when the list is empty. */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <Container>
        <MaskedLines text={'What members\nsay.'} className="type-display text-display" />
        <ul className="mt-12 grid gap-x-10 gap-y-14 md:mt-16 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id} className="border-t border-chalk/15 pt-6">
              <figure>
                <div className="flex gap-1 text-accent" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }, (_, i) => (
                    <Star key={i} aria-hidden className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 text-xl leading-snug">“{item.content}”</blockquote>
                <figcaption className="mt-6 text-sm text-chalk/60">
                  <span className="font-semibold text-chalk">{item.name}</span>, {sourceLabel[item.source]}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
