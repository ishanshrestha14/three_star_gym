import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { fadeUp } from '../animations/reveal'
import { useMotion } from '../animations/useMotion'
import { useSections } from '../api/sections'
import { useTrainers } from '../api/trainers'
import { ResponsiveImage } from '../components/media/ResponsiveImage'
import { PageHeader } from '../components/sections/PageHeader'
import { TrialCta } from '../components/sections/TrialCta'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { pages } from '../content/pages'

export default function Trainers() {
  const trainers = useTrainers()
  const { trialCta } = useSections()
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    for (const card of ref.current?.querySelectorAll('[data-trainer]') ?? []) fadeUp(card, { trigger: card })
  }, ref)

  return (
    <>
      <Seo title="Trainers" description={pages.trainers.seoDescription} />
      <PageHeader title={pages.trainers.title} intro={pages.trainers.intro} />

      <section ref={ref} className="py-16 md:py-28">
        <Container>
          <ul className="grid gap-x-8 gap-y-20 md:grid-cols-2">
            {trainers.map((trainer, index) => (
              <li key={trainer.slug} data-trainer className={index % 2 === 1 ? 'md:mt-32' : undefined}>
                <Link to={`/trainers/${trainer.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-iron">
                    {trainer.photo && (
                      <ResponsiveImage
                        image={trainer.photo}
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="h-full w-full object-cover grayscale transition-[filter,scale] duration-700 ease-out-strong group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    )}
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="type-display text-headline">{trainer.name}</h2>
                      <p className="mt-2 text-chalk/70">
                        {trainer.position}, {trainer.yearsExperience} years coaching
                      </p>
                    </div>
                    <ArrowRight
                      aria-hidden
                      className="mb-1 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                  {trainer.bio && (
                    <p className="mt-4 line-clamp-3 max-w-lg leading-relaxed text-chalk/60">{trainer.bio.split('\n')[0]}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {trialCta && <TrialCta content={trialCta} />}
    </>
  )
}
