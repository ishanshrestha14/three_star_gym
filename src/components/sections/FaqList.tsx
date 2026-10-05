import { Plus } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { Faq } from '../../types/content'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

/* Native <details> accordion: works without JavaScript and opens one answer at a time. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
  }, ref)

  if (faqs.length === 0) return null

  return (
    <section ref={ref} className="py-24 md:py-32">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <MaskedLines text={'Questions,\nanswered.'} className="type-display text-display" />
          <Link
            to="/faq"
            className="mt-8 inline-block text-sm font-semibold underline decoration-chalk/30 underline-offset-4 hover:decoration-accent"
          >
            See all questions
          </Link>
        </div>

        <div className="border-t border-chalk/15 md:col-span-7">
          {faqs.map((faq) => (
            <details key={faq.id} name="faq" className="group border-b border-chalk/15">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-chalk/60 transition-transform duration-300 group-open:rotate-45 group-open:text-accent"
                />
              </summary>
              <p className="max-w-prose pb-7 leading-relaxed text-chalk/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
