import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { db } from '../lib/db'
import type { GalleryCategory, GalleryImage } from '../types/content'
import { toImage, unwrap } from './shared'

export const galleryCategoryLabel: Record<GalleryCategory, string> = {
  gym: 'The gym',
  equipment: 'Equipment',
  training: 'Training',
  members: 'Members',
  events: 'Events',
  facilities: 'Facilities',
}

async function fetchGallery(): Promise<GalleryImage[]> {
  const rows = await db
    .from('gallery_images')
    .select('id, image, caption, category')
    .eq('published', true)
    .order('sort_order')
    .then(unwrap)

  return rows.flatMap((row) => {
    const image = toImage(row.image, 'gallery image')
    return image ? [{ id: row.id, image, caption: row.caption, category: row.category as GalleryCategory }] : []
  })
}

export const galleryQuery = queryOptions({ queryKey: ['gallery'], queryFn: fetchGallery })

export const useGallery = () => useSuspenseQuery(galleryQuery).data
