import { useNavigation } from 'react-router'
import { cn } from '../../lib/cn'

/*
  Thin bar at the top of the screen while the next page's data loads, so a
  click always gets immediate feedback. Waits briefly before appearing so
  fast (cached) navigations don't flash it.
*/
export function NavigationProgress() {
  const loading = useNavigation().state !== 'idle'

  return (
    <div
      role="progressbar"
      aria-hidden={!loading}
      aria-label="Loading page"
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent transition-[transform,opacity]',
        loading
          ? 'scale-x-[0.85] opacity-100 delay-150 duration-[2500ms] ease-out'
          : 'scale-x-100 opacity-0 duration-300 ease-in',
      )}
    />
  )
}
