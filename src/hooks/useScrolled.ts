import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolled(threshold: number) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  )
}
