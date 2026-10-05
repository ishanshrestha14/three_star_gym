import type { Transformation } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

/* Real, consented member results only; the section disappears when the list is empty. */
export function Transformations({ items }: { items: Transformation[] }) {
  if (items.length === 0) return null

  return (
    <section className="py-24 md:py-32">
      <Container>
        <MaskedLines text={'Real people.\nReal work.'} className="type-display text-display" />
        <ul className="mt-12 space-y-20 md:mt-16">
          {items.map((item) => (
            <li key={item.id} className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="grid grid-cols-2 gap-2 md:col-span-7">
                {[
                  { label: 'Before', image: item.before },
                  { label: 'After', image: item.after },
                ].map(({ label, image }) => (
                  <figure key={label}>
                    <div className="aspect-[3/4] overflow-hidden bg-iron">
                      <ResponsiveImage image={image} sizes="(min-width: 768px) 30vw, 50vw" className="h-full w-full object-cover" />
                    </div>
                    <figcaption className="mt-2 text-sm text-chalk/60">{label}</figcaption>
                  </figure>
                ))}
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <p className="type-display text-headline">{item.result}</p>
                <p className="mt-2 text-chalk/60">in {item.durationLabel}</p>
                <blockquote className="mt-8 text-xl leading-snug">“{item.testimonial}”</blockquote>
                <p className="mt-4 text-sm font-semibold">{item.personName}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
