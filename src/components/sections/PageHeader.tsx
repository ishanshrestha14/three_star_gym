import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { parallax } from '../../animations/parallax'
import { useMotion } from '../../animations/useMotion'
import type { Image } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { MaskedLines } from '../ui/MaskedLines'

type PageHeaderProps = {
  title: string
  intro?: string
  image?: Image | null
}

/* Opening block for inner pages: a quieter echo of the homepage hero. */
export function PageHeader({ title, intro, image }: PageHeaderProps) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('[data-line]', { yPercent: 110, duration: 1, stagger: 0.08 })
      .from('[data-page-intro]', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power3.out' }, 0.35)
    if (image) parallax('[data-page-image]', { y: 14, trigger: '[data-page-frame]' })
  }, ref)

  return (
    <header ref={ref} className="pt-32 md:pt-44">
      <Container className="grid gap-8 md:grid-cols-12 md:items-end">
        <MaskedLines as="h1" text={title} className="type-display text-title md:col-span-8" />
        {intro && (
          <p data-page-intro className="max-w-md text-lg leading-relaxed text-chalk/75 md:col-span-4 md:pb-2">
            {intro}
          </p>
        )}
      </Container>

      {image && (
        <div data-page-frame className="mt-12 aspect-[4/3] overflow-hidden md:mt-20 md:aspect-[21/9]">
          <div data-page-image className="-mt-[7%] h-[114%]">
            <ResponsiveImage image={image} sizes="100vw" priority className="h-full w-full object-cover" />
          </div>
        </div>
      )}
    </header>
  )
}
