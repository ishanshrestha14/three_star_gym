import { ArrowLeft } from 'lucide-react'
import { useRef } from 'react'
import { Link, useParams } from 'react-router'
import { gsap } from '../animations/gsap'
import { useMotion } from '../animations/useMotion'
import { useSiteSettings } from '../api/settings'
import { useTrainer, useTrainers } from '../api/trainers'
import { ResponsiveImage } from '../components/media/ResponsiveImage'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'
import { MaskedLines } from '../components/ui/MaskedLines'
import { whatsappHref } from '../lib/contact'
import NotFound from './NotFound'

const socialLabels = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' } as const

export default function TrainerDetail() {
  const { slug = '' } = useParams()
  const trainer = useTrainer(slug)
  const others = useTrainers().filter((t) => t.slug !== slug)
  const site = useSiteSettings()
  const ref = useRef<HTMLDivElement>(null)

  useMotion(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('[data-portrait]', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power3.inOut' }, 0)
      .from('[data-line]', { yPercent: 110, duration: 1, stagger: 0.08 }, 0.2)
      .from('[data-profile] > *', { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 0.5)
  }, ref)

  if (!trainer) return <NotFound />

  const firstName = trainer.name.split(' ')[0]
  const socials = Object.entries(trainer.socialLinks).filter((entry): entry is [keyof typeof socialLabels, string] =>
    Boolean(entry[1]),
  )
  const whatsapp = whatsappHref({
    ...site,
    whatsappMessage: `Hi, I’d like to train with ${trainer.name} at ${site.name}.`,
  })

  return (
    <div ref={ref}>
      <Seo title={`${trainer.name}, ${trainer.position}`} description={trainer.bio.split('\n')[0]} image={trainer.photo} />

      <Container className="grid gap-10 pt-28 pb-20 md:grid-cols-12 md:gap-8 md:pt-36 md:pb-28">
        <div className="md:col-span-5">
          <div data-portrait className="aspect-[3/4] overflow-hidden bg-iron md:sticky md:top-28">
            {trainer.photo && (
              <ResponsiveImage image={trainer.photo} sizes="(min-width: 768px) 40vw, 100vw" priority className="h-full w-full object-cover" />
            )}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-4">
          <Link to="/trainers" className="mb-8 inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
            <ArrowLeft aria-hidden className="size-4" />
            All coaches
          </Link>
          <MaskedLines as="h1" text={trainer.name.replace(' ', '\n')} className="type-display text-title" />

          <div data-profile>
            <p className="mt-6 text-xl text-chalk/80">
              {trainer.position}, {trainer.yearsExperience} years coaching
            </p>

            {trainer.specializations.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Specialisations">
                {trainer.specializations.map((item) => (
                  <li key={item} className="border border-chalk/25 px-3 py-1 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 space-y-5 border-t border-chalk/15 pt-10">
              {trainer.bio
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'text-xl leading-relaxed' : 'text-lg leading-relaxed text-chalk/75'}>
                    {paragraph}
                  </p>
                ))}
            </div>

            {trainer.certifications.length > 0 && (
              <div className="mt-10">
                <h2 className="text-sm text-chalk/60">Certifications</h2>
                <ul className="mt-3 space-y-1">
                  {trainer.certifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <CtaLink to="/free-trial">Train with {firstName}</CtaLink>
              <CtaLink to={whatsapp} variant="outline">
                Message on WhatsApp
              </CtaLink>
            </div>

            {socials.length > 0 && (
              <ul className="mt-8 flex gap-6 text-sm">
                {socials.map(([network, url]) => (
                  <li key={network}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-chalk/70 underline-offset-4 hover:text-chalk hover:underline">
                      {socialLabels[network]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>

      {others.length > 0 && (
        <section className="border-t border-chalk/15 py-16 md:py-24">
          <Container>
            <h2 className="type-display text-headline">More coaches</h2>
            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link to={`/trainers/${other.slug}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-iron">
                      {other.photo && (
                        <ResponsiveImage
                          image={other.photo}
                          sizes="(min-width: 768px) 33vw, 50vw"
                          className="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                        />
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold">{other.name}</h3>
                    <p className="text-sm text-chalk/60">{other.position}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </div>
  )
}
