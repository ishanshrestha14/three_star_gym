import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/*
  Admin form controls. Plain, bordered and roomy: these are used by the gym
  owner on a phone as often as on a laptop.
*/

type FieldProps = {
  label: string
  hint?: string
  error?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
  className?: string
}

export function AdminField({ label, hint, error, children, className }: FieldProps) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-chalk/50">
          {hint}
        </p>
      )}
      <div className="mt-2">{children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  )
}

const control =
  'block w-full rounded border border-chalk/20 bg-graphite px-3 py-2.5 text-base text-chalk placeholder:text-chalk/30 transition-colors focus:border-chalk/60 focus:outline-none aria-invalid:border-accent'

export function Input({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return <input className={cn(control, className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea className={cn(control, 'min-h-24 resize-y leading-relaxed', className)} {...props} />
}

export function Select({ className, ...props }: ComponentPropsWithoutRef<'select'>) {
  return <select className={cn(control, 'appearance-auto', className)} {...props} />
}

/** Checkbox with its label and an optional explanation underneath. */
export function Toggle({
  label,
  description,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<'input'>, 'type'> & { label: string; description?: string }) {
  const id = useId()
  return (
    <div className={cn('flex gap-3', className)}>
      <input id={id} type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]" {...props} />
      <label htmlFor={id} className="text-sm">
        <span className="font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-chalk/50">{description}</span>}
      </label>
    </div>
  )
}

/** Groups related fields under a heading inside a form. */
export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-chalk/10 bg-iron/60 p-5 md:p-6">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-chalk/60">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}
