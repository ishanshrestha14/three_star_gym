import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { whyUsSchema } from '../../../schemas/content'
import type { WhyUsContent } from '../../../types/content'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Textarea } from '../../components/form'
import { RowControls } from '../../components/RowControls'
import { Button } from '../../components/ui'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'
import { useSectionSubmit } from './useSectionSubmit'

export function WhyUsForm({ content }: { content: WhyUsContent | null }) {
  const submit = useSectionSubmit('why_us', 'Why choose us')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<WhyUsContent>({ resolver: zodResolver(whyUsSchema), defaultValues: content ?? { heading: 'Why people\nstay.', items: [] } })
  const items = useFieldArray({ control, name: 'items' })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values)) reset(values)
  }, onInvalid)

  return (
    <EditPage title="Why choose us" backTo="/admin/homepage" backLabel="Homepage" onSubmit={(e) => void onSubmit(e)} isSubmitting={isSubmitting} isDirty={isDirty}>
      <FormSection title="Heading">
        <AdminField label="Heading" hint="Each line becomes a line on the page." error={errors.heading?.message}>
          {(a11y) => <Textarea {...a11y} {...register('heading')} rows={2} className="font-semibold uppercase" />}
        </AdminField>
      </FormSection>
      <FormSection title="Reasons" description="Three to five works best.">
        <ol className="space-y-5">
          {items.fields.map((field, index) => (
            <li key={field.id} className="space-y-2 rounded border border-chalk/10 p-3">
              <div className="flex items-start gap-2">
                <Input {...register(`items.${index}.title`)} aria-label={`Reason ${index + 1} title`} aria-invalid={Boolean(errors.items?.[index]?.title)} placeholder="Coaches who coach" className="flex-1" />
                <RowControls index={index} count={items.fields.length} onMove={items.move} onRemove={items.remove} label={`reason ${index + 1}`} />
              </div>
              <Textarea {...register(`items.${index}.description`)} aria-label={`Reason ${index + 1} description`} rows={2} placeholder="One sentence explaining it." />
              {errors.items?.[index]?.title && <p className="text-sm text-accent">Give this reason a title.</p>}
            </li>
          ))}
        </ol>
        <Button onClick={() => items.append({ title: '', description: '' })}>
          <Plus aria-hidden className="size-4" />
          Add a reason
        </Button>
      </FormSection>
    </EditPage>
  )
}
