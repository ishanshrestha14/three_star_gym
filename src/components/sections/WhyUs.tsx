import { useRef } from 'react'
import { fadeUp, revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { WhyUsContent } from '../../types/content'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

export function WhyUs({ content }: { content: WhyUsContent }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
    fadeUp('[data-reason]', { trigger: '[data-reasons]' })
  }, ref)

  if (content.items.length === 0) return null

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <MaskedLines text={content.heading} className="type-display text-display md:sticky md:top-32" />
        </div>
        <dl data-reasons className="grid gap-x-10 sm:grid-cols-2 md:col-span-7">
          {content.items.map((item) => (
            <div key={item.title} data-reason className="border-t border-chalk/15 pt-5 pb-10">
              <dt className="text-xl font-semibold">{item.title}</dt>
              <dd className="mt-3 leading-relaxed text-chalk/70">{item.description}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
