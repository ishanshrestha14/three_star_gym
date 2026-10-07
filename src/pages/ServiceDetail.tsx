import { ArrowLeft, Check } from 'lucide-react'
import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { gsap } from '../animations/gsap'
import { fadeUp, revealLines } from '../animations/reveal'
import { useMotion } from '../animations/useMotion'
import { useSections } from '../api/sections'
import { useService, useServices } from '../api/services'
import { useSiteSettings } from '../api/settings'
import { ResponsiveImage } from '../components/media/ResponsiveImage'
import { TrialCta } from '../components/sections/TrialCta'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'
import { MaskedLines } from '../components/ui/MaskedLines'
import { whatsappHref } from '../lib/contact'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug = '' } = useParams()
  const service = useService(slug)
  const services = useServices()
  const { trialCta } = useSections()
  const site = useSiteSettings()
  const ref = useRef<HTMLDivElement>(null)

  useMotion(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('[data-detail-media]', { scale: 1.06, duration: 1.8, ease: 'power2.out' }, 0)
      .from('[data-hero-title] [data-line]', { yPercent: 110, duration: 1, stagger: 0.08 }, 0.1)
      .from('[data-hero-sub]', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power3.out' }, 0.45)
    revealLines('[data-section-title] [data-line]', { trigger: '[data-benefits]' })
    fadeUp('[data-benefit]', { trigger: '[data-benefits]' })
  }, ref)

  if (!service) return <NotFound />

  const paragraphs = service.body.split(/\n\s*\n/).filter(Boolean)
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3)
  const whatsapp = whatsappHref({
    ...site,
    whatsappMessage: `Hi, I’d like to know more about ${service.title.toLowerCase()} at ${site.name}.`,
  })

  return (
    <div ref={ref}>
      <Seo
        title={service.seoTitle || service.title}
        description={service.seoDescription || service.shortDescription}
        image={service.image}
      />

      <header className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden pt-32 pb-12 md:pb-16">
        <div className="absolute inset-0 -z-10">
          {service.image && (
            <div data-detail-media className="h-full w-full">
              <ResponsiveImage image={service.image} sizes="100vw" priority className="h-full w-full object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(26_27_29/0.75)_0%,rgb(26_27_29/0.25)_40%,var(--color-graphite)_100%)]" />
        </div>
        <Container>
          <Link to="/services" className="hit-area mb-8 inline-flex items-center gap-2 text-sm text-chalk/70 hover:text-chalk">
            <ArrowLeft aria-hidden className="size-4" />
            All services
          </Link>
          <div data-hero-title>
            <MaskedLines as="h1" text={service.title} className="type-display text-title max-w-5xl" />
          </div>
          <p data-hero-sub className="mt-6 max-w-xl text-lg text-chalk/80 md:text-xl">
            {service.shortDescription}
          </p>
        </Container>
      </header>

      <Container className="grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-24">
        <div className="space-y-6 md:col-span-7">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'text-xl leading-relaxed md:text-2xl' : 'text-lg leading-relaxed text-chalk/75'}>
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="md:col-span-4 md:col-start-9">
          <div className="border-t border-accent pt-6 md:sticky md:top-28">
            {service.audience && (
              <>
                <h2 className="text-sm text-chalk/60">Who it’s for</h2>
                <p className="mt-3 leading-relaxed">{service.audience}</p>
              </>
            )}
            <div className="mt-8 flex flex-col gap-3">
              <CtaLink to="/free-trial">Book a free trial</CtaLink>
              <CtaLink to={whatsapp} variant="outline">
                Ask on WhatsApp
              </CtaLink>
            </div>
          </div>
        </aside>
      </Container>

      {service.benefits.length > 0 && (
        <section data-benefits className="border-t border-chalk/15 py-16 md:py-24">
          <Container className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div data-section-title className="md:col-span-5">
              <MaskedLines text={'What you\nget.'} className="type-display text-display" />
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2 md:col-span-7">
              {service.benefits.map((benefit) => (
                <li key={benefit} data-benefit className="flex gap-4 border-t border-chalk/15 py-6 text-lg">
                  <Check aria-hidden className="mt-1 size-5 shrink-0 text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {service.whatToExpect && (
        <section className="py-16 md:py-24">
          <Container className="grid gap-6 md:grid-cols-12 md:gap-8">
            <h2 className="text-sm text-chalk/60 md:col-span-3">Your first session</h2>
            <p className="text-2xl leading-snug md:col-span-8 md:col-start-5 md:text-3xl">{service.whatToExpect}</p>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-chalk/15 py-16 md:py-24">
          <Container>
            <h2 className="type-display text-headline">Also on the floor</h2>
            <ul className="mt-10 grid gap-8 sm:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={`/services/${item.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden bg-iron">
                      {item.image && (
                        <ResponsiveImage
                          image={item.image}
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out-strong group-hover:scale-[1.04]"
                        />
                      )}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-1 text-chalk/65">{item.shortDescription}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {trialCta && <TrialCta content={trialCta} />}
    </div>
  )
}
