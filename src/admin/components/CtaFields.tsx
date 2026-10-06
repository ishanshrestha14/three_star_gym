import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { AdminField, Input } from './form'

type CtaFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>
  name: string
  label: string
  errors?: FieldErrors
}

/* Button text and where it goes. */
export function CtaFields<T extends FieldValues>({ register, name, label, errors }: CtaFieldsProps<T>) {
  const fieldErrors = errors as Record<string, { label?: { message?: string }; to?: { message?: string } }> | undefined
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AdminField label={`${label}: text`} error={fieldErrors?.[name]?.label?.message}>
        {(a11y) => <Input {...a11y} {...register(`${name}.label` as Path<T>)} />}
      </AdminField>
      <AdminField label={`${label}: goes to`} hint="A page like /free-trial, or a full link." error={fieldErrors?.[name]?.to?.message}>
        {(a11y) => <Input {...a11y} {...register(`${name}.to` as Path<T>)} />}
      </AdminField>
    </div>
  )
}
