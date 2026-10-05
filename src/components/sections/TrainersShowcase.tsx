import { useRef } from 'react'
import { Link } from 'react-router'
import { revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { Trainer } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { SectionHeader } from './SectionHeader'

/*
  Portraits sit in greyscale so mixed photography reads as one set, and come
  into colour on hover. Mobile scrolls sideways with snap points.
*/
export function TrainersShowcase({ trainers }: { trainers: Trainer[] }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
  }, ref)

  if (trainers.length === 0) return null

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container>
        <SectionHeader title={'Meet the\ncoaches'} link={{ label: 'All trainers', to: '/trainers' }} />
      </Container>

      <div className="mx-auto max-w-[90rem] lg:px-10">
        <ul className="mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mt-16 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {trainers.map((trainer) => (
            <li key={trainer.slug} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
              <Link to={`/trainers/${trainer.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-iron">
                  {trainer.photo && (
                    <ResponsiveImage
                      image={trainer.photo}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw"
                      className="h-full w-full object-cover grayscale transition-[filter,scale] duration-700 ease-out-strong group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  )}
                </div>
                <h3 className="mt-5 text-xl font-semibold">{trainer.name}</h3>
                <p className="mt-1 text-chalk/70">
                  {trainer.position}, {trainer.yearsExperience} years
                </p>
                <p className="mt-3 text-sm text-steel">{trainer.specializations.join(', ')}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
