import type { Image } from '../types/content'

const STORAGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media`

/*
  Single place that turns a stored image path into a URL.
  "/placeholder/hero" → file shipped with the site in /public
  "gallery/abc123"    → Supabase Storage, public "media" bucket
*/
export function imageUrl(src: string, width: number, ext: Image['ext'] = 'webp') {
  const base = src.startsWith('/') ? src : `${STORAGE_BASE}/${src}`
  return `${base}-${width}.${ext}`
}

export function imageSrcSet(image: Image) {
  return image.widths.map((width) => `${imageUrl(image.src, width, image.ext)} ${width}w`).join(', ')
}

/** Mid-size fallback for browsers that ignore srcset. */
export function imageFallback(image: Image) {
  const width = image.widths.find((w) => w >= 1280) ?? image.widths[image.widths.length - 1]
  return imageUrl(image.src, width, image.ext)
}
