import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Json } from '../../types/database'
import { supabase } from '../../lib/supabase'
import type { Image } from '../../types/content'
import { deleteReplacedImages } from '../lib/images'

export type SectionKey = 'hero' | 'stats' | 'about' | 'why_us' | 'trial_cta' | 'about_page'

export const adminSectionsQuery = queryOptions({
  queryKey: ['admin', 'sections'],
  staleTime: 0,
  queryFn: async () => {
    const { data, error } = await supabase.from('homepage_sections').select('key, content, is_visible, updated_at')
    if (error) throw error
    return data
  },
})

function useInvalidateSections() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'sections'] }),
      queryClient.invalidateQueries({ queryKey: ['sections'] }),
    ])
}

type SaveSection = {
  key: SectionKey
  content: unknown
  images?: { before: (Image | null | undefined)[]; after: (Image | null | undefined)[] }
}

export function useSaveSection() {
  const invalidate = useInvalidateSections()
  return useMutation({
    mutationFn: async ({ key, content, images }: SaveSection) => {
      // Upsert so a section that was never seeded can still be created.
      const { error } = await supabase.from('homepage_sections').upsert({ key, content: content as Json })
      if (error) throw error
      if (images) await deleteReplacedImages(images.before, images.after).catch(() => {})
    },
    onSuccess: invalidate,
  })
}

export function useToggleSection() {
  const invalidate = useInvalidateSections()
  return useMutation({
    mutationFn: async ({ key, isVisible }: { key: SectionKey; isVisible: boolean }) => {
      const { error } = await supabase.from('homepage_sections').update({ is_visible: isVisible }).eq('key', key)
      if (error) throw error
      return isVisible
    },
    onSuccess: invalidate,
  })
}
