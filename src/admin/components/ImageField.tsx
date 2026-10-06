import { ImagePlus, Loader2 } from 'lucide-react'
import { useId, useRef, useState, type DragEvent } from 'react'
import { ResponsiveImage } from '../../components/media/ResponsiveImage'
import { cn } from '../../lib/cn'
import type { Image } from '../../types/content'
import { ImageUploadError, uploadImage, type MediaFolder } from '../lib/images'
import { toast } from '../toast'
import { Button } from './ui'

type ImageFieldProps = {
  label: string
  value: Image | null | undefined
  onChange: (image: Image | null) => void
  folder: MediaFolder
  hint?: string
  error?: string
  /** Preview frame shape, e.g. "aspect-[4/3]" */
  aspect?: string
  required?: boolean
}

/*
  Upload, preview, replace or remove one image, with its alt text. The old
  file is cleaned up when the record is saved, not here, so cancelling a form
  never deletes the image that's live on the site.
*/
export function ImageField({ label, value, onChange, folder, hint, error, aspect = 'aspect-[4/3]', required }: ImageFieldProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      onChange(await uploadImage(file, folder, value?.alt ?? ''))
    } catch (err) {
      toast.error(err instanceof ImageUploadError ? err.message : 'The upload failed. Try again.')
    } finally {
      setUploading(false)
      if (input.current) input.current.value = ''
    }
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    void upload(event.dataTransfer.files[0])
  }

  return (
    <div>
      <p id={`${id}-label`} className="text-sm font-medium">
        {label}
        {!required && <span className="font-normal text-chalk/50"> (optional)</span>}
      </p>
      {hint && <p className="mt-0.5 text-sm text-chalk/50">{hint}</p>}

      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-labelledby={`${id}-label`}
        onChange={(event) => void upload(event.target.files?.[0])}
      />

      <div className="mt-2 grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr]">
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={uploading}
          className={cn(
            'relative flex w-full items-center justify-center overflow-hidden rounded border bg-graphite transition-colors',
            aspect,
            dragging ? 'border-accent' : error ? 'border-accent/70' : 'border-dashed border-chalk/25 hover:border-chalk/50',
          )}
        >
          {value && <ResponsiveImage image={value} sizes="224px" className="absolute inset-0 h-full w-full object-cover" />}
          {uploading ? (
            <span className="relative flex flex-col items-center gap-2 rounded bg-graphite/80 px-3 py-2 text-sm">
              <Loader2 aria-hidden className="size-5 animate-spin" />
              Uploading…
            </span>
          ) : (
            !value && (
              <span className="flex flex-col items-center gap-2 px-4 text-center text-sm text-chalk/60">
                <ImagePlus aria-hidden className="size-6" />
                Drop a photo here or click to choose
              </span>
            )
          )}
        </button>

        <div className="space-y-3">
          {value && (
            <div>
              <label htmlFor={`${id}-alt`} className="block text-sm font-medium">
                Describe the photo
              </label>
              <p className="mt-0.5 text-sm text-chalk/50">Read aloud by screen readers and used by Google, e.g. “Coach spotting a bench press”.</p>
              <input
                id={`${id}-alt`}
                value={value.alt}
                onChange={(event) => onChange({ ...value, alt: event.target.value })}
                className="mt-2 block w-full rounded border border-chalk/20 bg-graphite px-3 py-2.5 focus:border-chalk/60 focus:outline-none"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => input.current?.click()} disabled={uploading}>
              {value ? 'Replace photo' : 'Choose photo'}
            </Button>
            {value && !required && (
              <Button variant="ghost" onClick={() => onChange(null)} disabled={uploading}>
                Remove
              </Button>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm text-accent">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
