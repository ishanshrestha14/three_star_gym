import { imageSchema, parseOrNull } from '../schemas/content'

/** Throws the Supabase error, otherwise returns the rows. */
export function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) throw error
  return data as T
}

/** Parses an optional jsonb image column. */
export function toImage(value: unknown, label: string) {
  return value == null ? null : parseOrNull(imageSchema, value, label)
}
