import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { useMotion } from '../../animations/useMotion'
import { useSiteSettings } from '../../api/settings'
import { heroVideo } from '../../content/heroVideo'
import type { HeroContent } from '../../types/content'
import { HeroVideo } from '../media/HeroVideo'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { CtaLink } from '../ui/CtaLink'
import { MaskedLines } from '../ui/MaskedLines'

/*
  The page's one orchestrated moment: each headline line rises out of its mask
  while widening from Archivo's narrowest cut to its final width, like a
  muscle taking load. Everything else on the page stays quiet.
*/
export function Hero({ content }: { content: HeroContent }) {
  const ref = useRef<HTMLElement>(null)
  const site = useSiteSettings()

  useMotion(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('[data-hero-media]', { scale: 1.08, duration: 2.2, ease: 'power2.out' }, 0)
      .from('[data-line]', { yPercent: 110, duration: 1, stagger: 0.09 }, 0.15)
      .from('[data-line]', { fontStretch: '62%', duration: 1.6, stagger: 0.09, ease: 'power3.inOut' }, 0.25)
      .from('[data-hero-copy] > *', { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.7)

    gsap.to('[data-hero-media]', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, ref)

  const hours = site.openingHours[0]

  return (
    <section ref={ref} className="relative isolate flex h-svh min-h-[40rem] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div data-hero-media className="relative h-full w-full">
          <ResponsiveImage image={content.image} sizes="100vw" priority className="h-full w-full object-cover object-[60%_center]" />
          {heroVideo && content.background !== 'image' && <HeroVideo {...heroVideo} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />}
        </div>
        {/* Scrims: top keeps the nav legible, bottom-left sits behind the headline so the rest of the frame stays clear */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(26_27_29/0.6)_0%,rgb(26_27_29/0)_25%,rgb(26_27_29/0)_55%,var(--color-graphite)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgb(26_27_29/0.75)_0%,rgb(26_27_29/0)_60%)]" />
      </div>

      <Container className="flex flex-1 flex-col justify-end pb-24 md:pb-10">
        <div className="grid items-end gap-8 xl:grid-cols-12">
          <MaskedLines
            as="h1"
            text={content.heading}
            className="type-display text-hero xl:col-span-7"
            lineClassName="whitespace-nowrap [font-stretch:74%]"
          />
          <div data-hero-copy className="xl:col-span-4 xl:col-start-9 xl:pb-[0.6vw]">
            <p className="max-w-sm text-lg text-chalk/80 md:text-xl">{content.subheading}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink to={content.primaryCta.to}>{content.primaryCta.label}</CtaLink>
              <CtaLink to={content.secondaryCta.to} variant="outline">
                {content.secondaryCta.label}
              </CtaLink>
            </div>
          </div>
        </div>

        <div data-hero-copy className="mt-10 hidden justify-between border-t border-chalk/15 pt-4 text-sm text-chalk/60 md:flex">
          <p>
            {site.area}, {site.city}
          </p>
          {hours && (
            <p>
              Open {hours.days}, {hours.hours}
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}
