/*
  Single entry point for GSAP. Components import from here, never from 'gsap'
  directly, so plugins are registered once and only in the public bundle.
*/
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Use with gsap.matchMedia(): animations only register when the user allows motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, useGSAP }
