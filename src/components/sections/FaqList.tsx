import { useRef } from 'react'
import { Link } from 'react-router'
import { revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { Faq } from '../../types/content'
import { FaqAccordion } from '../content/FaqAccordion'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

type FaqListProps = {
  faqs: Faq[]
  title?: string
}

export function FaqList({ faqs, title = 'Questions,\nanswered.' }: FaqListProps) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
  }, ref)

  if (faqs.length === 0) return null

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <MaskedLines text={title} className="type-display text-display" />
          <Link
            to="/faq"
            className="mt-8 inline-block text-sm font-semibold underline decoration-chalk/30 underline-offset-4 hover:decoration-accent"
          >
            See all questions
          </Link>
        </div>

        <div className="md:col-span-7">
          <FaqAccordion faqs={faqs} name="faq" />
        </div>
      </Container>
    </section>
  )
}
