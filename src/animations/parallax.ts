import { gsap } from './gsap'

type ParallaxOptions = {
  /** Percent of the element's own size to travel across the scroll range */
  x?: number
  y?: number
  trigger?: gsap.DOMTarget
}

/** Moves an element against the scroll while its trigger crosses the viewport. */
export function parallax(target: gsap.DOMTarget, { x = 0, y = 0, trigger }: ParallaxOptions) {
  return gsap.fromTo(
    target,
    { xPercent: -x / 2, yPercent: -y / 2 },
    {
      xPercent: x / 2,
      yPercent: y / 2,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? target, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
}
