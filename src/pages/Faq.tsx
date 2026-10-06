import { useRef } from 'react'
import { fadeUp } from '../animations/reveal'
import { useMotion } from '../animations/useMotion'
import { useFaqs } from '../api/faqs'
import { useSiteSettings } from '../api/settings'
import { FaqAccordion } from '../components/content/FaqAccordion'
import { PageHeader } from '../components/sections/PageHeader'
import { JsonLd } from '../components/seo/JsonLd'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'
import { pages } from '../content/pages'
import { telHref, whatsappHref } from '../lib/contact'
import type { Faq as FaqItem } from '../types/content'

/** Groups FAQs by category, keeping the order the admin set. */
function groupByCategory(faqs: FaqItem[]) {
  const groups = new Map<string, FaqItem[]>()
  for (const faq of faqs) groups.set(faq.category, [...(groups.get(faq.category) ?? []), faq])
  return [...groups]
}

export default function Faq() {
  const faqs = useFaqs()
  const site = useSiteSettings()
  const ref = useRef<HTMLDivElement>(null)

  useMotion(() => {
    for (const group of ref.current?.querySelectorAll('[data-faq-group]') ?? []) fadeUp(group, { trigger: group })
  }, ref)

  return (
    <>
      <Seo title="FAQ" description={pages.faq.seoDescription} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }}
      />
      <PageHeader title={pages.faq.title} intro={pages.faq.intro} />

      <div ref={ref} className="py-16 md:py-28">
        <Container className="space-y-16 md:space-y-24">
          {groupByCategory(faqs).map(([category, items]) => (
            <section key={category} data-faq-group className="grid gap-6 md:grid-cols-12 md:gap-8">
              <h2 className="type-display text-headline md:col-span-4">{category}</h2>
              <div className="md:col-span-8">
                <FaqAccordion faqs={items} name={`faq-${category}`} />
              </div>
            </section>
          ))}
        </Container>
      </div>

      <section className="border-t border-chalk/15 py-16 md:py-24">
        <Container className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 className="type-display text-display">Still have a question?</h2>
            <p className="mt-4 max-w-md text-lg text-chalk/75">
              Message us on WhatsApp or give us a call. We usually reply within a few hours during opening times.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <CtaLink to={whatsappHref(site)}>Message on WhatsApp</CtaLink>
            <CtaLink to={telHref(site.phone)} variant="outline">
              Call {site.phone}
            </CtaLink>
          </div>
        </Container>
      </section>
    </>
  )
}
