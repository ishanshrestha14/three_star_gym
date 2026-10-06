import { useRef } from 'react'
import { parallax } from '../../animations/parallax'
import { fadeUp, revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { AboutPageContent } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

export function Facilities({ content }: { content: AboutPageContent['facilities'] }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
    fadeUp('[data-facility]', { trigger: '[data-facilities]' })
    parallax('[data-facilities-image]', { y: -14, trigger: ref.current })
  }, ref)

  if (content.items.length === 0) return null

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        <div className="aspect-[3/4] overflow-hidden bg-iron md:col-span-5">
          <div data-facilities-image className="-mt-[8%] h-[116%]">
            <ResponsiveImage image={content.image} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <MaskedLines text={content.heading} className="type-display text-display" />
          <ul data-facilities className="mt-10 border-t border-chalk/15">
            {content.items.map((item) => (
              <li key={item} data-facility className="border-b border-chalk/15 py-5 text-lg md:text-xl">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
