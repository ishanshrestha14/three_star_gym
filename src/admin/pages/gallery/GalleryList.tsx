import { useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { galleryCategoryLabel } from '../../../api/gallery'
import { supabase } from '../../../lib/supabase'
import type { GalleryCategory } from '../../../types/content'
import { ContentListPage } from '../../components/ContentListPage'
import { Select } from '../../components/form'
import { Button, Panel } from '../../components/ui'
import { ImageUploadError, uploadImage } from '../../lib/images'
import { toast } from '../../toast'

const categories = Object.entries(galleryCategoryLabel) as [GalleryCategory, string][]

/* Gallery admin: bulk upload on top of the standard list. */
export default function GalleryList() {
  const queryClient = useQueryClient()
  const input = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<GalleryCategory>('gym')
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

  const uploadAll = async (files: File[]) => {
    if (files.length === 0) return
    setProgress({ done: 0, total: files.length })
    let added = 0
    const { data: last } = await supabase.from('gallery_images').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    let sortOrder = (last?.[0]?.sort_order ?? -1) + 1

    for (const file of files) {
      try {
        // A generic description to start with; each photo can be described properly afterwards.
        const image = await uploadImage(file, 'gallery', `${galleryCategoryLabel[category]} at the gym`)
        const { error } = await supabase.from('gallery_images').insert({ image, category, published: true, sort_order: sortOrder++ })
        if (error) throw error
        added++
      } catch (error) {
        toast.error(`${file.name}: ${error instanceof ImageUploadError ? error.message : 'didn’t upload.'}`)
      }
      setProgress((p) => p && { ...p, done: p.done + 1 })
    }

    setProgress(null)
    if (input.current) input.current.value = ''
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery_images'] }),
      queryClient.invalidateQueries({ queryKey: ['gallery'] }),
    ])
    if (added) toast.success(`${added} ${added === 1 ? 'photo' : 'photos'} added. Open each one to add a proper description.`)
  }

  return (
    <ContentListPage
      table="gallery_images"
      path="gallery"
      title="Gallery"
      description="Photos on the gallery page, in this order. The first six also scroll across the homepage."
      addLabel="Add one photo"
      emptyTitle="No photos yet."
      emptyBody="Upload real photos of the gym, the equipment and members training. They make the biggest difference to how the site feels."
      toItem={(item) => {
        const image = item.image as { alt?: string } | null
        return {
          title: image?.alt || 'Photo',
          subtitle: [galleryCategoryLabel[item.category as GalleryCategory], item.caption].filter(Boolean).join(': '),
          image: item.image as never,
        }
      }}
      imagesOf={(item) => [item.image as never]}
    >
      <Panel className="mb-6 p-4 md:p-5">
        <h2 className="font-semibold">Upload photos</h2>
        <p className="mt-1 text-sm text-chalk/60">Choose several at once. They’re resized automatically and go straight onto the gallery page.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="upload-category">Category</label>
            <Select id="upload-category" value={category} onChange={(event) => setCategory(event.target.value as GalleryCategory)} className="w-auto py-2">
              {categories.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <input
            ref={input}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            aria-label="Choose photos to upload"
            onChange={(event) => void uploadAll([...(event.target.files ?? [])])}
          />
          <Button variant="primary" onClick={() => input.current?.click()} disabled={Boolean(progress)}>
            <Upload aria-hidden className="size-4" />
            {progress ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : 'Choose photos'}
          </Button>
        </div>
      </Panel>
    </ContentListPage>
  )
}
