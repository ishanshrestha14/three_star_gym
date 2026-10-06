import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { statsSchema } from '../../../schemas/content'
import type { Stat } from '../../../types/content'
import { EditPage } from '../../components/EditPage'
import { FormSection, Input } from '../../components/form'
import { RowControls } from '../../components/RowControls'
import { Button } from '../../components/ui'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'
import { useSectionSubmit } from './useSectionSubmit'

const MAX = 4

export function StatsForm({ content }: { content: { items: Stat[] } | null }) {
  const submit = useSectionSubmit('stats', 'Stats')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<{ items: Stat[] }>({ resolver: zodResolver(statsSchema), defaultValues: content ?? { items: [] } })
  const items = useFieldArray({ control, name: 'items' })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values)) reset(values)
  }, onInvalid)

  return (
    <EditPage title="Stats" backTo="/admin/homepage" backLabel="Homepage" onSubmit={(e) => void onSubmit(e)} isSubmitting={isSubmitting} isDirty={isDirty}>
      <p className="rounded border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
        Use real numbers only. Remove every row to hide the strip completely.
      </p>
      <FormSection title="Numbers" description={`Up to ${MAX}. Keep the number short, e.g. “10+” or “4.9”.`}>
        <ul className="space-y-3">
          {items.fields.map((field, index) => (
            <li key={field.id} className="grid gap-2 sm:grid-cols-[8rem_1fr_auto] sm:items-start">
              <div>
                <Input {...register(`items.${index}.value`)} aria-label={`Number ${index + 1}`} aria-invalid={Boolean(errors.items?.[index]?.value)} placeholder="10+" />
              </div>
              <div>
                <Input {...register(`items.${index}.label`)} aria-label={`Label ${index + 1}`} aria-invalid={Boolean(errors.items?.[index]?.label)} placeholder="Years in Manamaiju" />
              </div>
              <RowControls index={index} count={items.fields.length} onMove={items.move} onRemove={items.remove} label={`stat ${index + 1}`} />
              {errors.items?.[index] && <p className="text-sm text-accent sm:col-span-3">Fill in both the number and the label.</p>}
            </li>
          ))}
        </ul>
        {items.fields.length < MAX && (
          <Button onClick={() => items.append({ value: '', label: '' })}>
            <Plus aria-hidden className="size-4" />
            Add a number
          </Button>
        )}
      </FormSection>
    </EditPage>
  )
}
