import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Button } from './ui'

type ListFieldProps = {
  label: string
  value: string[]
  onChange: (items: string[]) => void
  hint?: string
  placeholder?: string
  addLabel?: string
}

/** Editable list of short text items (plan features, benefits, specialisations…). */
export function ListField({ label, value, onChange, hint, placeholder, addLabel = 'Add item' }: ListFieldProps) {
  const id = useId()

  const update = (index: number, text: string) => onChange(value.map((item, i) => (i === index ? text : item)))
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index))
  const move = (index: number, delta: number) => {
    const next = [...value]
    ;[next[index], next[index + delta]] = [next[index + delta], next[index]]
    onChange(next)
  }

  return (
    <fieldset aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="text-sm font-medium">{label}</legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-chalk/50">
          {hint}
        </p>
      )}
      <ol className="mt-2 space-y-2">
        {value.map((item, index) => (
          <li key={index} className="flex gap-1.5">
            <input
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              aria-label={`${label} ${index + 1}`}
              className="block min-w-0 flex-1 rounded border border-chalk/20 bg-graphite px-3 py-2 focus:border-chalk/60 focus:outline-none"
            />
            <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton label="Move down" disabled={index === value.length - 1} onClick={() => move(index, 1)}>
              <ArrowDown className="size-4" />
            </IconButton>
            <IconButton label="Remove" onClick={() => remove(index)}>
              <X className="size-4" />
            </IconButton>
          </li>
        ))}
      </ol>
      <Button className="mt-2" onClick={() => onChange([...value, ''])}>
        <Plus aria-hidden className="size-4" />
        {addLabel}
      </Button>
    </fieldset>
  )
}

function IconButton({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & Omit<ComponentPropsWithoutRef<'button'>, 'aria-label'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center rounded border border-chalk/15 text-chalk/70 hover:border-chalk/40 hover:text-chalk disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  )
}
