import { gsap } from './gsap'

type Target = gsap.TweenTarget
type ScrollOptions = { trigger?: gsap.DOMTarget; start?: string }

/*
  Lines slide up from behind an overflow mask. Pair with <MaskedLines>, which
  renders each line as `[data-line]` inside a clipping wrapper.
*/
export function revealLines(lines: Target, { trigger, start = 'top 82%' }: ScrollOptions = {}) {
  return gsap.from(lines, {
    yPercent: 110,
    duration: 0.9,
    ease: 'power4.out',
    stagger: 0.08,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  })
}

/** Fades content in with a short rise. Use for supporting copy, not headings. */
export function fadeUp(targets: Target, { trigger, start = 'top 85%' }: ScrollOptions = {}) {
  return gsap.from(targets, {
    autoAlpha: 0,
    y: 24,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  })
}

/** Image opens from a horizontal slit as it scrolls into view, scrubbed to scroll position. */
export function imageReveal(frame: gsap.DOMTarget, { start = 'top 90%' }: ScrollOptions = {}) {
  return gsap.fromTo(
    frame,
    { clipPath: 'inset(22% 8% 22% 8%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: frame, start, end: 'center 55%', scrub: 0.6 },
    },
  )
}
