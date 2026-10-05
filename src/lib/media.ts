import type { Image } from '../types/content'

/*
  Single place that turns a stored image path into a URL. When media moves to
  Cloudflare R2, prefix the R2 public base URL here.
*/
export function imageUrl(src: string, width: number) {
  return `${src}-${width}.webp`
}

export function imageSrcSet(image: Image) {
  return image.widths.map((width) => `${imageUrl(image.src, width)} ${width}w`).join(', ')
}

/** Mid-size fallback for browsers that ignore srcset. */
export function imageFallback(image: Image) {
  const width = image.widths.find((w) => w >= 1280) ?? image.widths[image.widths.length - 1]
  return imageUrl(image.src, width)
}
