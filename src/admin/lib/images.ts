import { supabase } from '../../lib/supabase'
import type { Image } from '../../types/content'

/*
  Browser-side image pipeline. Supabase's free tier has no image resizing, so
  every upload is resized here into a few widths and stored as
  "<folder>/<id>-<width>.webp". ResponsiveImage then picks the right size.
*/

const BUCKET = 'media'
const WIDTHS = [640, 1280, 2048]
const QUALITY = 0.8
const MAX_INPUT_BYTES = 25 * 1024 * 1024

export type MediaFolder = 'site' | 'pages' | 'services' | 'trainers' | 'gallery' | 'blog' | 'transformations' | 'testimonials'

export class ImageUploadError extends Error {}

let webpSupport: Promise<boolean> | null = null

/** Safari can't encode WebP from a canvas; those uploads fall back to JPEG. */
function canEncodeWebp() {
  webpSupport ??= new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    canvas.toBlob((blob) => resolve(blob?.type === 'image/webp'), 'image/webp')
  })
  return webpSupport
}

function encode(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new ImageUploadError('This image couldn’t be processed.'))), type, QUALITY),
  )
}

/** Widths to generate: the standard sizes below the original, plus the original (capped at 2048). */
function targetWidths(naturalWidth: number) {
  const largest = Math.min(naturalWidth, WIDTHS[WIDTHS.length - 1])
  return [...new Set([...WIDTHS.filter((w) => w < largest), largest])]
}

export async function uploadImage(file: File, folder: MediaFolder, alt = ''): Promise<Image> {
  if (!file.type.startsWith('image/')) throw new ImageUploadError('Choose an image file (JPG, PNG, WebP or HEIC).')
  if (file.size > MAX_INPUT_BYTES) throw new ImageUploadError('That file is over 25 MB. Choose a smaller photo.')

  let bitmap: ImageBitmap
  try {
    // Respect the camera's rotation so phone photos aren't sideways.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new ImageUploadError('This browser can’t read that image. Try a JPG or PNG.')
  }

  const ext = (await canEncodeWebp()) ? 'webp' : 'jpg'
  const type = ext === 'webp' ? 'image/webp' : 'image/jpeg'
  const base = `${folder}/${crypto.randomUUID()}`
  // Read dimensions up front: a closed bitmap reports 0×0.
  const { width: naturalWidth, height: naturalHeight } = bitmap
  const widths = targetWidths(naturalWidth)
  const heightFor = (width: number) => Math.round((naturalHeight * width) / naturalWidth)
  const uploaded: string[] = []

  try {
    for (const width of widths) {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = heightFor(width)
      const context = canvas.getContext('2d')
      if (!context) throw new ImageUploadError('This image couldn’t be processed.')
      context.imageSmoothingQuality = 'high'
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

      const path = `${base}-${width}.${ext}`
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, await encode(canvas, type), { contentType: type, cacheControl: '31536000', upsert: false })
      if (error) throw new ImageUploadError('The upload failed. Check your connection and try again.')
      uploaded.push(path)
    }
  } catch (error) {
    // Don't leave half an image behind.
    if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded)
    throw error
  } finally {
    bitmap.close()
  }

  const largest = widths[widths.length - 1]
  return { src: base, alt, width: largest, height: heightFor(largest), widths, ...(ext === 'jpg' && { ext }) }
}

/** Deletes an uploaded image's files. Placeholder images shipped with the site are left alone. */
export async function deleteImage(image: Image | null | undefined) {
  if (!image || image.src.startsWith('/')) return
  const ext = image.ext ?? 'webp'
  await supabase.storage.from(BUCKET).remove(image.widths.map((w) => `${image.src}-${w}.${ext}`))
}

/** Deletes images that were on a record before a save but aren't any more. */
export async function deleteReplacedImages(before: (Image | null | undefined)[], after: (Image | null | undefined)[]) {
  const kept = new Set(after.map((image) => image?.src))
  await Promise.all(before.filter((image) => image && !kept.has(image.src)).map(deleteImage))
}
