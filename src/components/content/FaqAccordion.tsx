import { Plus } from 'lucide-react'
import type { Faq } from '../../types/content'

/* Native <details> accordion: works without JavaScript and opens one answer at a time per group. */
export function FaqAccordion({ faqs, name }: { faqs: Faq[]; name: string }) {
  return (
    <div className="border-t border-chalk/15">
      {faqs.map((faq) => (
        <details key={faq.id} name={name} className="group border-b border-chalk/15">
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
  )
}
