import { useEffect, useRef } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { slugify } from '../lib/slug'
import { AdminField, Input } from './form'

type SlugFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  /** Field the slug is generated from while it hasn't been edited by hand */
  source: Path<T>
  /** e.g. "/services/" */
  prefix: string
  isNew: boolean
}

/*
  Web address for a page. For new items it follows the title until edited by
  hand; for existing items it's left alone, because changing it breaks links
  people have already shared.
*/
export function SlugField<T extends FieldValues>({ form, name, source, prefix, isNew }: SlugFieldProps<T>) {
  const edited = useRef(!isNew)
  const sourceValue = form.watch(source) as string

  useEffect(() => {
    if (!edited.current) form.setValue(name, slugify(sourceValue ?? '') as never, { shouldValidate: false })
  }, [form, name, sourceValue])

  const error = form.formState.errors[name]?.message as string | undefined
  const registration = form.register(name)

  return (
    <AdminField
      label="Web address"
      hint={
        isNew
          ? `The page will live at ${prefix}your-address. Lowercase letters, numbers and dashes.`
          : 'Changing this breaks links people have already shared, including on Google.'
      }
      error={error}
    >
      {(a11y) => (
        <div className="flex items-stretch">
          <span className="flex items-center rounded-l border border-r-0 border-chalk/20 bg-iron px-3 text-sm text-chalk/50">{prefix}</span>
          <Input
            {...a11y}
            {...registration}
            onChange={(event) => {
              edited.current = true
              void registration.onChange(event)
            }}
            className="rounded-l-none"
          />
        </div>
      )}
    </AdminField>
  )
}
