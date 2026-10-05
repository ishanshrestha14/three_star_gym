import type { RefObject } from 'react'
import { gsap, MOTION_OK, useGSAP } from './gsap'

/*
  Runs `setup` inside a GSAP context scoped to `scope`, only when the visitor
  allows motion. Everything created inside is reverted on unmount, and
  selector strings resolve within the scope element.
*/
export function useMotion(setup: () => void, scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, setup)
    },
    { scope },
  )
}
