import { useRef } from 'react'
import { fadeUp, imageReveal, revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { TrialCtaContent } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { CtaLink } from '../ui/CtaLink'
import { MaskedLines } from '../ui/MaskedLines'

export function TrialCta({ content }: { content: TrialCtaContent }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    imageReveal('[data-trial-frame]')
    revealLines('[data-line]', { trigger: ref.current, start: 'top 60%' })
    fadeUp('[data-trial-copy] > *', { trigger: ref.current, start: 'top 50%' })
  }, ref)

  return (
    <section ref={ref} className="relative isolate flex min-h-[90svh] items-center overflow-hidden py-24">
      <div data-trial-frame className="absolute inset-0 -z-10">
        <ResponsiveImage image={content.image} sizes="100vw" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-graphite/55" />
      </div>

      <Container>
        <MaskedLines text={content.heading} className="type-display text-display max-w-5xl" />
        <div data-trial-copy className="mt-8 max-w-md">
          <p className="text-lg text-chalk/85">{content.body}</p>
          <CtaLink to={content.cta.to} size="lg" className="mt-8">
            {content.cta.label}
          </CtaLink>
        </div>
      </Container>
    </section>
  )
}
