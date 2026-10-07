import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  body: string
  /** Optional buttons, e.g. call and WhatsApp */
  children?: ReactNode
}

/* Shown on a listing page when the gym hasn't published anything there yet, so the page never ends blank. */
export function EmptyState({ title, body, children }: EmptyStateProps) {
  return (
    <div className="max-w-xl border-t border-chalk/15 pt-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-lg text-chalk/70">{body}</p>
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </div>
  )
}
