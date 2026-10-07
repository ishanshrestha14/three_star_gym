import { useEffect, useRef, useState } from 'react'
import { MOTION_OK } from '../../animations/gsap'
import { cn } from '../../lib/cn'

type HeroVideoProps = {
  desktop: string
  mobile: string
  className?: string
}

const saveData = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true

/*
  Silent looping video laid over the hero photo. The photo stays the first
  thing painted: the video only starts downloading after the page has loaded,
  fades in once it's actually playing, and is skipped for visitors who save
  data or prefer reduced motion. It pauses while the hero is off screen.
*/
export function HeroVideo({ desktop, mobile, className }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || saveData() || !window.matchMedia(MOTION_OK).matches) return

    const start = () => {
      video.src = window.matchMedia('(max-width: 767px)').matches ? mobile : desktop
      video.play().catch(() => {}) // Autoplay blocked: the photo stays.
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    const observer = new IntersectionObserver(([entry]) => {
      if (!video.src) return
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)

    return () => {
      window.removeEventListener('load', start)
      observer.disconnect()
    }
  }, [desktop, mobile])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={cn('transition-opacity duration-700', playing ? 'opacity-100' : 'opacity-0', className)}
    />
  )
}
