import { queryOptions, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import type { Image } from '../../types/content'
import type { Tables, TablesInsert, TablesUpdate } from '../../types/database'
import { deleteImage, deleteReplacedImages } from '../lib/images'
import { toast } from '../toast'

/*
  Shared CRUD for the orderable, publishable content tables. Each admin
  screen supplies the form; this module handles loading, saving, ordering,
  publishing and deleting, and keeps the public site's cache fresh.
*/

export type ContentTable =
  | 'services'
  | 'trainers'
  | 'membership_plans'
  | 'faqs'
  | 'testimonials'
  | 'transformations'
  | 'gallery_images'

export type Row<T extends ContentTable> = Tables<T>

// The typed client can't follow a table name that's a generic parameter, so
// this module uses an untyped handle internally and re-types at the edges.
const db = supabase as unknown as SupabaseClient

// Public query keys to refresh after an edit, so "View website" is current.
const publicKeys: Record<ContentTable, QueryKey[]> = {
  services: [['services']],
  trainers: [['trainers']],
  membership_plans: [['plans']],
  faqs: [['faqs']],
  testimonials: [['testimonials']],
  transformations: [['transformations']],
  gallery_images: [['gallery']],
}

export const contentListQuery = <T extends ContentTable>(table: T) =>
  queryOptions({
    queryKey: ['admin', table],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await db.from(table).select('*').order('sort_order').order('created_at')
      if (error) throw error
      return data as Row<T>[]
    },
  })

export const contentItemQuery = <T extends ContentTable>(table: T, id: string) =>
  queryOptions({
    queryKey: ['admin', table, id],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await db.from(table).select('*').eq('id', id).maybeSingle()
      if (error) throw error
      return data as Row<T> | null
    },
  })

function useInvalidate(table: ContentTable) {
  const queryClient = useQueryClient()
  return () =>
    Promise.all(
      [['admin', table], ...publicKeys[table]].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    )
}

/** Turns a Postgres error into something an admin can act on. */
export function describeError(error: unknown, fallback: string) {
  const code = (error as { code?: string } | null)?.code
  if (code === '23505') return 'That address (slug) is already used. Choose a different one.'
  if (code === '23514') return 'Some values aren’t allowed. Check the highlighted fields and try again.'
  if (code === '42501') return 'You don’t have permission to do that. Sign in again.'
  return fallback
}

type SaveVariables<T extends ContentTable> = {
  id?: string
  values: TablesUpdate<T>
  /** Images on the record before and after the edit, so replaced files get deleted. */
  images?: { before: (Image | null | undefined)[]; after: (Image | null | undefined)[] }
}

export function useSaveContent<T extends ContentTable>(table: T) {
  const invalidate = useInvalidate(table)
  return useMutation({
    mutationFn: async ({ id, values, images }: SaveVariables<T>) => {
      let row: Row<T>
      if (id) {
        const { data, error } = await db.from(table).update(values).eq('id', id).select().single()
        if (error) throw error
        row = data as Row<T>
      } else {
        // New items go to the end of the list.
        const { data: last } = await db.from(table).select('sort_order').order('sort_order', { ascending: false }).limit(1)
        const sortOrder = ((last?.[0] as { sort_order?: number } | undefined)?.sort_order ?? -1) + 1
        const { data, error } = await db
          .from(table)
          .insert({ ...(values as TablesInsert<T>), sort_order: sortOrder })
          .select()
          .single()
        if (error) throw error
        row = data as Row<T>
      }
      if (images) await deleteReplacedImages(images.before, images.after).catch(() => {})
      return row
    },
    onSuccess: invalidate,
  })
}

export function useDeleteContent<T extends ContentTable>(table: T, imagesOf: (row: Row<T>) => (Image | null | undefined)[] = () => []) {
  const invalidate = useInvalidate(table)
  return useMutation({
    mutationFn: async (row: Row<T>) => {
      const { error } = await db.from(table).delete().eq('id', (row as { id: string }).id)
      if (error) throw error
      await Promise.all(imagesOf(row).map(deleteImage)).catch(() => {})
    },
    onSuccess: async () => {
      await invalidate()
      toast.success('Deleted.')
    },
    onError: (error) => toast.error(describeError(error, 'That didn’t delete. Try again.')),
  })
}

export function useTogglePublished(table: ContentTable) {
  const invalidate = useInvalidate(table)
  return useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await db.from(table).update({ published }).eq('id', id)
      if (error) throw error
      return published
    },
    onSuccess: async (published) => {
      await invalidate()
      toast.success(published ? 'Published. It’s now on the website.' : 'Hidden from the website.')
    },
    onError: (error) => toast.error(describeError(error, 'That didn’t change. Try again.')),
  })
}

/** Moves one item up or down, then rewrites sort_order for the whole list so gaps and ties disappear. */
export function useMoveContent(table: ContentTable) {
  const invalidate = useInvalidate(table)
  return useMutation({
    mutationFn: async ({ ids, index, delta }: { ids: string[]; index: number; delta: -1 | 1 }) => {
      const next = [...ids]
      ;[next[index], next[index + delta]] = [next[index + delta], next[index]]
      const results = await Promise.all(next.map((id, sortOrder) => db.from(table).update({ sort_order: sortOrder }).eq('id', id)))
      const failed = results.find((result) => result.error)
      if (failed?.error) throw failed.error
    },
    onSuccess: invalidate,
    onError: (error) => toast.error(describeError(error, 'The order didn’t save. Try again.')),
  })
}
