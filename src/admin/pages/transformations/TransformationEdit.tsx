import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { imageSchema } from '../../../schemas/content'
import type { Image } from '../../../types/content'
import type { Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Textarea, Toggle } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { onInvalid, useSaveAndReturn } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const schema = z
  .object({
    person_name: z.string().trim().min(1, 'Enter the member’s name (first name is fine)').max(100),
    before_image: z.nullable(imageSchema).refine((v) => Boolean(v), 'Add the before photo'),
    after_image: z.nullable(imageSchema).refine((v) => Boolean(v), 'Add the after photo'),
    duration_label: z.string().trim().max(40),
    goal: z.string().trim().max(200),
    result: z.string().trim().min(1, 'Describe the result, e.g. -8 kg').max(60),
    testimonial: z.string().trim().max(500),
    consent_confirmed: z.boolean(),
    published: z.boolean(),
  })
  // Mirrors the database rule: nothing goes public without the member's permission.
  .refine((v) => !v.published || v.consent_confirmed, {
    path: ['consent_confirmed'],
    message: 'Confirm you have the member’s permission before publishing',
  })
type Values = z.infer<typeof schema>

export default function TransformationEdit() {
  return <ContentEditLoader table="transformations">{(row) => <TransformationForm row={row} />}</ContentEditLoader>
}

function TransformationForm({ row }: { row: Row<'transformations'> | null }) {
  const saveAndReturn = useSaveAndReturn('transformations', row, { listPath: '/admin/transformations', noun: 'transformation' })
  const before = (row?.before_image as Image | null) ?? null
  const after = (row?.after_image as Image | null) ?? null
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      person_name: row?.person_name ?? '',
      before_image: before,
      after_image: after,
      duration_label: row?.duration_label ?? '',
      goal: row?.goal ?? '',
      result: row?.result ?? '',
      testimonial: row?.testimonial ?? '',
      consent_confirmed: row?.consent_confirmed ?? false,
      published: row?.published ?? false,
    },
  })
  const { allowNavigation } = useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(
    (values) =>
      saveAndReturn(
        { ...values, before_image: values.before_image as Image, after_image: values.after_image as Image },
        { allowNavigation, images: { before: [before, after], after: [values.before_image, values.after_image] } },
      ),
    onInvalid,
  )

  return (
    <EditPage
      title={row ? `${row.person_name}’s transformation` : 'Add a transformation'}
      backTo="/admin/transformations"
      backLabel="All transformations"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <FormSection title="Photos" description="Similar pose, lighting and distance in both photos makes the change easier to see.">
        <div className="grid gap-6">
          {(['before_image', 'after_image'] as const).map((name) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field, fieldState }) => (
                <ImageField
                  label={name === 'before_image' ? 'Before' : 'After'}
                  folder="transformations"
                  aspect="aspect-[3/4]"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Result">
        <AdminField label="Member’s name" hint="First name or initials is fine if they prefer." error={errors.person_name?.message}>
          {(a11y) => <Input {...a11y} {...register('person_name')} />}
        </AdminField>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Result" hint="Shown large, e.g. “-8 kg”." error={errors.result?.message}>
            {(a11y) => <Input {...a11y} {...register('result')} />}
          </AdminField>
          <AdminField label="Time taken" hint="e.g. 12 weeks" error={errors.duration_label?.message}>
            {(a11y) => <Input {...a11y} {...register('duration_label')} />}
          </AdminField>
        </div>
        <AdminField label="Goal (optional)" error={errors.goal?.message}>
          {(a11y) => <Input {...a11y} {...register('goal')} placeholder="Lose fat and get stronger" />}
        </AdminField>
        <AdminField label="In their words (optional)" hint="A short quote from the member." error={errors.testimonial?.message}>
          {(a11y) => <Textarea {...a11y} {...register('testimonial')} rows={3} />}
        </AdminField>
      </FormSection>

      <FormSection title="Permission and visibility">
        <div>
          <Toggle
            {...register('consent_confirmed')}
            label="The member has agreed to have these photos published"
            description="Keep their written permission (a message or form) in case they ask."
          />
          {errors.consent_confirmed && (
            <p role="alert" className="mt-2 text-sm text-accent">
              {errors.consent_confirmed.message}
            </p>
          )}
        </div>
        <Toggle {...register('published')} label="Show on the website" />
      </FormSection>
    </EditPage>
  )
}
