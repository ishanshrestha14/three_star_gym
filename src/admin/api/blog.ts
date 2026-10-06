import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { Image } from '../../types/content'
import type { TablesInsert, TablesUpdate } from '../../types/database'
import { deleteImage, deleteReplacedImages } from '../lib/images'

export type PostState = 'draft' | 'published' | 'scheduled' | 'archived'

/** Draft, archived, published, or published with a future date (scheduled). */
export function postState(post: { status: string; published_at: string | null }): PostState {
  if (post.status === 'published') return post.published_at && new Date(post.published_at) > new Date() ? 'scheduled' : 'published'
  return post.status === 'archived' ? 'archived' : 'draft'
}

export const adminPostsQuery = queryOptions({
  queryKey: ['admin', 'blog', 'posts'],
  staleTime: 0,
  queryFn: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, status, published_at, is_featured, updated_at, cover_image, category:blog_categories(name)')
      .order('published_at', { ascending: false, nullsFirst: true })
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data
  },
})

export const adminPostQuery = (id: string) =>
  queryOptions({
    queryKey: ['admin', 'blog', 'post', id],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data
    },
  })

export const adminCategoriesQuery = queryOptions({
  queryKey: ['admin', 'blog', 'categories'],
  staleTime: 0,
  queryFn: async () => {
    const { data, error } = await supabase.from('blog_categories').select('id, name, slug, sort_order').order('sort_order').order('name')
    if (error) throw error
    return data
  },
})

function useInvalidateBlog() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] }),
      queryClient.invalidateQueries({ queryKey: ['blog'] }),
    ])
}

type SavePost = {
  id?: string
  values: TablesUpdate<'blog_posts'>
  images: { before: (Image | null | undefined)[]; after: (Image | null | undefined)[] }
}

export function useSavePost() {
  const invalidate = useInvalidateBlog()
  return useMutation({
    mutationFn: async ({ id, values, images }: SavePost) => {
      // Only one post leads the blog page.
      if (values.is_featured) {
        await supabase.from('blog_posts').update({ is_featured: false }).neq('id', id ?? '00000000-0000-0000-0000-000000000000')
      }
      const query = id
        ? supabase.from('blog_posts').update(values).eq('id', id)
        : supabase.from('blog_posts').insert(values as TablesInsert<'blog_posts'>)
      const { data, error } = await query.select('id').single()
      if (error) throw error
      await deleteReplacedImages(images.before, images.after).catch(() => {})
      return data.id
    },
    onSuccess: invalidate,
  })
}

export function useDeletePost() {
  const invalidate = useInvalidateBlog()
  return useMutation({
    mutationFn: async ({ id, cover }: { id: string; cover: Image | null }) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      await deleteImage(cover).catch(() => {})
    },
    onSuccess: invalidate,
  })
}

export function useSaveCategory() {
  const invalidate = useInvalidateBlog()
  return useMutation({
    mutationFn: async ({ id, name, slug, sort_order }: { id?: string; name: string; slug: string; sort_order?: number }) => {
      const { error } = id
        ? await supabase.from('blog_categories').update({ name, slug }).eq('id', id)
        : await supabase.from('blog_categories').insert({ name, slug, sort_order: sort_order ?? 0 })
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}

export function useDeleteCategory() {
  const invalidate = useInvalidateBlog()
  return useMutation({
    mutationFn: async (id: string) => {
      // Posts in this category keep existing; they just lose the category (on delete set null).
      const { error } = await supabase.from('blog_categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}
