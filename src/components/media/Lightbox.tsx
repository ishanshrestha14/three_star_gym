import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { GalleryImage } from '../../types/content'
import { ResponsiveImage } from './ResponsiveImage'

type LightboxProps = {
  items: GalleryImage[]
  index: number | null
  onIndexChange: (index: number | null) => void
}

/*
  Full-screen viewer on the native <dialog>: focus trapping, Escape to close and
  returning focus to the opener all come from the browser.
*/
export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const item = index === null ? null : items[index]

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  const step = (delta: number) => {
    if (index === null) return
    onIndexChange((index + delta + items.length) % items.length)
  }

  return (
    <dialog
      ref={ref}
      onClose={() => onIndexChange(null)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') step(1)
        if (event.key === 'ArrowLeft') step(-1)
      }}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (event.target === event.currentTarget) ref.current?.close()
      }}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-graphite/95 p-0 text-chalk backdrop:bg-graphite/80"
    >
      {item && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 text-sm text-chalk/70 sm:px-6">
            <span className="tabular-nums">
              {(index ?? 0) + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mr-2 flex size-11 items-center justify-center hover:text-chalk"
            >
              <X aria-hidden className="size-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <figure className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-20">
            {/* Bounded box: the photo scales down to fit whatever space is left */}
            <div className="min-h-0 flex-1">
              <ResponsiveImage
                key={item.id}
                image={item.image}
                sizes="100vw"
                priority
                className="h-full w-full object-contain"
              />
            </div>
            {item.caption && <figcaption className="mt-4 text-center text-chalk/80">{item.caption}</figcaption>}
          </figure>

          <div className="flex justify-center gap-2 py-4 sm:absolute sm:inset-x-0 sm:top-1/2 sm:-translate-y-1/2 sm:justify-between sm:px-4 sm:py-0">
            <button
              type="button"
              onClick={() => step(-1)}
              className="flex size-12 items-center justify-center border border-chalk/20 bg-graphite/60 hover:border-chalk/60"
            >
              <ChevronLeft aria-hidden className="size-6" />
              <span className="sr-only">Previous photo</span>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="flex size-12 items-center justify-center border border-chalk/20 bg-graphite/60 hover:border-chalk/60"
            >
              <ChevronRight aria-hidden className="size-6" />
              <span className="sr-only">Next photo</span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
