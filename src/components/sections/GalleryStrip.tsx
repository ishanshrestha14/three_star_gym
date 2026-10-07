import { useRef } from 'react'
import { gsap } from '../../animations/gsap'
import { revealLines } from '../../animations/reveal'
import { useMotion } from '../../animations/useMotion'
import type { GalleryImage } from '../../types/content'
import { ResponsiveImage } from '../media/ResponsiveImage'
import { Container } from '../ui/Container'
import { SectionHeader } from './SectionHeader'

/*
  A single row of photos that drifts sideways as the page scrolls on larger
  screens. On phones, or without motion, it's a plain swipeable row.
*/
export function GalleryStrip({ images }: { images: GalleryImage[] }) {
  const ref = useRef<HTMLElement>(null)

  useMotion(() => {
    revealLines('[data-line]', { trigger: ref.current })
    // Phones keep a native swipe row; the scroll-driven drift is for larger screens.
    gsap.matchMedia().add('(min-width: 768px)', () => {
      gsap.fromTo(
        '[data-strip]',
        { xPercent: 0 },
        {
          xPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
  }, ref)

  if (images.length < 3) return null

  return (
    <section ref={ref} className="overflow-hidden py-24 md:py-32">
      <Container>
        <SectionHeader title={'Inside the\ngym.'} link={{ label: 'See the gallery', to: '/gallery' }} />
      </Container>

      <ul
        data-strip
        className="mt-12 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6 md:mt-16 md:gap-4 md:overflow-visible lg:px-10"
      >
        {images.map((item, index) => (
          <li
            key={item.id}
            className={
              // Alternate tall and wide frames so the row has rhythm.
              index % 3 === 1
                ? 'aspect-[3/4] w-[55vw] shrink-0 snap-start overflow-hidden bg-iron md:w-[22vw]'
                : 'aspect-[4/3] w-[75vw] shrink-0 snap-start self-end overflow-hidden bg-iron md:w-[32vw]'
            }
          >
            <ResponsiveImage
              image={item.image}
              sizes="(min-width: 768px) 22vw, 55vw"
              className="h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
