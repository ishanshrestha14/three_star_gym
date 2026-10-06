import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { db } from '../lib/db'
import type { Transformation } from '../types/content'
import { toImage, unwrap } from './shared'

async function fetchTransformations(): Promise<Transformation[]> {
  const rows = await db
    .from('transformations')
    .select('id, person_name, before_image, after_image, duration_label, result, testimonial')
    .eq('published', true)
    .order('sort_order')
    .then(unwrap)

  return rows.flatMap((row) => {
    const before = toImage(row.before_image, 'transformation before image')
    const after = toImage(row.after_image, 'transformation after image')
    if (!before || !after) return []
    return [
      {
        id: row.id,
        personName: row.person_name,
        before,
        after,
        durationLabel: row.duration_label,
        result: row.result,
        testimonial: row.testimonial,
      },
    ]
  })
}

export const transformationsQuery = queryOptions({ queryKey: ['transformations'], queryFn: fetchTransformations })

export const useTransformations = () => useSuspenseQuery(transformationsQuery).data
