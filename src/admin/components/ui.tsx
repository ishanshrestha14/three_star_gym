import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { buttonClass, type ButtonVariant } from './buttonClass'

/*
  Small, plain building blocks for the admin. Function over flourish: clear
  labels, obvious states, nothing that can be mistaken for decoration.
*/

export function Button({
  variant,
  className,
  type = 'button',
  ...props
}: ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-chalk/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
  return <section className={cn('rounded-lg border border-chalk/10 bg-iron/60', className)} {...props} />
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-sm text-sm text-chalk/60">{children}</div>}
    </div>
  )
}

export function ErrorState({ message = 'This didn’t load.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="px-6 py-16 text-center">
      <p className="font-medium">{message}</p>
      <p className="mt-2 text-sm text-chalk/60">Check your connection, then try again.</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading" className="divide-y divide-chalk/10">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="h-4 w-40 animate-pulse rounded bg-chalk/10" />
          <div className="h-4 w-28 animate-pulse rounded bg-chalk/10" />
          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-chalk/10" />
        </div>
      ))}
    </div>
  )
}
