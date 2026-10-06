import type { FieldErrors } from 'react-hook-form'
import { useNavigate } from 'react-router'
import type { Image } from '../types/content'
import type { TablesUpdate } from '../types/database'
import { describeError, useSaveContent, type ContentTable, type Row } from './api/content'
import { toast } from './toast'

type Options = {
  /** Where to go after saving, e.g. "/admin/faqs" */
  listPath: string
  /** Lower-case noun for messages, e.g. "question" → "Question saved." */
  noun: string
}

/* Save a content record, confirm it, and return to the list. Errors stay on the form. */
export function useSaveAndReturn<T extends ContentTable>(table: T, row: Row<T> | null, { listPath, noun }: Options) {
  const navigate = useNavigate()
  const save = useSaveContent(table)
  const label = noun.charAt(0).toUpperCase() + noun.slice(1)

  return async (
    values: TablesUpdate<T>,
    { images, allowNavigation }: { images?: { before: (Image | null | undefined)[]; after: (Image | null | undefined)[] }; allowNavigation: () => void },
  ) => {
    try {
      const saved = await save.mutateAsync({ id: (row as { id?: string } | null)?.id, values, images })
      toast.success(row ? `${label} saved.` : `${label} added.`)
      allowNavigation()
      navigate(listPath)
      return saved
    } catch (error) {
      toast.error(describeError(error, `The ${noun} didn’t save. Try again.`))
      return null
    }
  }
}

/*
  Second argument for handleSubmit: when validation fails, say so and move to
  the first problem, so a mistake further down a long form isn't missed.
*/
export function onInvalid(errors: FieldErrors) {
  const fields = Object.keys(errors)
  if (import.meta.env.DEV) console.warn('Form invalid:', errors)
  toast.error(fields.length === 1 ? 'One field needs attention before saving.' : `${fields.length} fields need attention before saving.`)
  document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}
