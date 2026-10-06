import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { fadeUp, imageReveal } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import { cn } from '../../lib/cn'
import type { Service } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'

/* Services page index: alternating photo and copy, one service per block. */
export function ServiceFeatures({ services }: { services: Service[] }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    for (const frame of ref.current?.querySelectorAll('[data-feature-frame]') ?? []) imageReveal(frame)
    for (const copy of ref.current?.querySelectorAll('[data-feature-copy]') ?? []) fadeUp(copy, { trigger: copy })
  }, ref)

  return (
    <section ref={ref} className="py-16 md:py-28">
      <Container>
        <ul className="space-y-20 md:space-y-36">
          {services.map((service, index) => {
            const flipped = index % 2 === 1
            return (
              <li key={service.slug} className="grid gap-8 md:grid-cols-12 md:items-center md:gap-8">
                <Link
                  to={`/services/${service.slug}`}
                  tabIndex={-1}
                  aria-hidden
                  className={cn('group block md:col-span-7', flipped && 'md:order-2 md:col-start-6')}
                >
                  <div data-feature-frame className="aspect-[4/3] overflow-hidden bg-iron">
                    {service.image && (
                      <ResponsiveImage
                        image={service.image}
                        sizes="(min-width: 768px) 58vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                </Link>

                <div data-feature-copy className={cn('md:col-span-4', flipped ? 'md:order-1 md:col-start-1' : 'md:col-start-9')}>
                  <h2 className="type-display text-headline">{service.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-chalk/75">{service.shortDescription}</p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold"
                  >
                    <span className="underline decoration-chalk/30 underline-offset-4 transition-colors group-hover:decoration-accent">
                      More about {service.title.toLowerCase()}
                    </span>
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
