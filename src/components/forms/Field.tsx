import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '../../lib/cn'

type FieldProps = {
  label: string
  hint?: string
  error?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}

/** Label, control, hint and error wired together for screen readers. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label htmlFor={id} className="block text-sm text-chalk/70">
        {label}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-steel">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  )
}

const control =
  'mt-2 block w-full border-0 border-b border-chalk/30 bg-transparent px-0 py-3 text-lg text-chalk placeholder:text-chalk/30 transition-colors focus:border-chalk focus:shadow-[0_1px_0_0_var(--color-chalk)] focus:outline-none focus:ring-0 aria-invalid:border-accent'

export function TextInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return <input className={cn(control, className)} {...props} />
}

export function TextArea({ className, ...props }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 resize-y', className)} {...props} />
}
