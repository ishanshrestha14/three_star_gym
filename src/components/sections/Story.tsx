import { useRef } from 'react'
import { fadeUp, revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

/* Long-form text block: heading on the left, paragraphs on the right. */
export function Story({ heading, body }: { heading: string; body: string }) {
  const ref = useRef<HTMLElement>(null)
  const paragraphs = body.split(/\n\s*\n/).filter(Boolean)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
    fadeUp('[data-story-copy] > p', { trigger: '[data-story-copy]' })
  }, ref)

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container className="grid gap-10 md:grid-cols-12 md:gap-8">
        <MaskedLines text={heading} className="type-display text-display md:col-span-5" />
        <div data-story-copy className="space-y-6 md:col-span-6 md:col-start-7">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'text-xl leading-relaxed md:text-2xl' : 'text-lg leading-relaxed text-chalk/75'}>
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  )
}
