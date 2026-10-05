import { useRef } from 'react'
import { parallax } from '../../animations/parallax'
import { fadeUp, revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { AboutContent } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { CtaLink } from '../ui/CtaLink'
import { MaskedLines } from '../ui/MaskedLines'

export function BrandIntro({ content }: { content: AboutContent }) {
  const ref = useRef<HTMLElement>(null)
  const [wide, tall] = content.images

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
    fadeUp('[data-intro-copy]', { trigger: '[data-intro-copy]' })
    parallax('[data-drift-x]', { x: 10, trigger: '[data-drift-frame]' })
    parallax('[data-drift-y]', { y: -16 })
  }, ref)

  return (
    <section ref={ref} className="pt-28 pb-12 md:pt-44 md:pb-16">
      <Container className="grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <MaskedLines text={content.heading} className="type-display text-display md:col-span-7" />

        <div data-intro-copy className="md:col-span-4 md:col-start-9 md:self-end">
          <p className="text-lg leading-relaxed text-chalk/80">{content.body}</p>
          <CtaLink to="/about" variant="outline" className="mt-8">
            Our story
          </CtaLink>
        </div>

        <figure data-drift-frame className="aspect-[4/3] overflow-hidden md:col-span-7 md:mt-12">
          <div data-drift-x className="h-full w-[112%] -ml-[6%]">
            <ResponsiveImage image={wide} sizes="(min-width: 768px) 60vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </figure>

        <figure className="aspect-[3/4] w-2/3 justify-self-end overflow-hidden md:col-span-4 md:col-start-9 md:mt-48 md:w-full">
          <div data-drift-y className="h-[116%] -mt-[8%]">
            <ResponsiveImage image={tall} sizes="(min-width: 768px) 33vw, 66vw" className="h-full w-full object-cover" />
          </div>
        </figure>
      </Container>
    </section>
  )
}
