import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { Service } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { SectionHeader } from './SectionHeader'

/*
  Full-width rows instead of cards. On hover the service photo opens from a
  slit behind the row and the title steps right. Touch devices get the plain rows.
*/
export function ServiceRows({ services }: { services: Service[] }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
  }, ref)

  if (services.length === 0) return null

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container>
        <SectionHeader title="What we do" link={{ label: 'All services', to: '/services' }} />

        <ul className="mt-12 border-t border-chalk/15 md:mt-16">
          {services.map((service) => (
            <li key={service.slug} className="border-b border-chalk/15">
              <Link
                to={`/services/${service.slug}`}
                className="group relative isolate block overflow-hidden py-7 md:py-10"
              >
                <div className="absolute inset-0 -z-10 [clip-path:inset(50%_0_50%_0)] transition-[clip-path] duration-500 ease-out-strong group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]">
                  <ResponsiveImage image={service.image} sizes="100vw" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-graphite/60" />
                </div>

                <div className="grid items-center gap-x-8 gap-y-2 md:grid-cols-12 md:px-4">
                  <h3 className="type-display text-headline transition-transform duration-500 ease-out-strong md:col-span-6 md:group-hover:translate-x-4">
                    {service.title}
                  </h3>
                  <p className="max-w-sm text-chalk/70 md:col-span-5">{service.shortDescription}</p>
                  <ArrowUpRight
                    aria-hidden
                    className="absolute top-7 right-0 size-7 transition-all duration-300 md:static md:col-span-1 md:size-9 md:justify-self-end md:-translate-x-3 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
