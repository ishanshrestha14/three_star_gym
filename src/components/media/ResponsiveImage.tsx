import { imageFallback, imageSrcSet } from '../../lib/media'
import type { Image } from '../../types/content'

type ResponsiveImageProps = {
  image: Image
  /** Rendered width hint for the browser, e.g. "(min-width: 768px) 50vw, 100vw" */
  sizes: string
  className?: string
  /** Above-the-fold image: loads eagerly at high priority */
  priority?: boolean
}

export function ResponsiveImage({ image, sizes, className, priority = false }: ResponsiveImageProps) {
  return (
    <img
      src={imageFallback(image)}
      srcSet={imageSrcSet(image)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
    />
  )
}
