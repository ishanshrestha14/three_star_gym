import { ArrowLeft } from 'lucide-react'
import type { FormEventHandler, ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from './ui'

type EditPageProps = {
  title: string
  backTo: string
  backLabel: string
  onSubmit: FormEventHandler<HTMLFormElement>
  isSubmitting: boolean
  isDirty: boolean
  submitLabel?: string
  /** Shown beside the title, e.g. an "On website" note or a preview link */
  aside?: ReactNode
  children: ReactNode
}

/* Page shell for every admin edit form: back link, title, sections, and a save bar pinned to the bottom. */
export function EditPage({
  title,
  backTo,
  backLabel,
  onSubmit,
  isSubmitting,
  isDirty,
  submitLabel = 'Save changes',
  aside,
  children,
}: EditPageProps) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Link to={backTo} className="mb-6 inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
        <ArrowLeft aria-hidden className="size-4" />
        {backLabel}
      </Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {aside}
      </div>

      <div className="max-w-3xl space-y-6 pb-28">{children}</div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-chalk/10 bg-graphite/95 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 md:px-8">
          <span className="mr-auto text-sm text-chalk/50">{isDirty ? 'Unsaved changes' : 'All changes saved'}</span>
          <Link to={backTo} className="px-3 py-2 text-sm text-chalk/70 hover:text-chalk">
            Cancel
          </Link>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
