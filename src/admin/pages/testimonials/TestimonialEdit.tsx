import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { imageSchema } from '../../../schemas/content'
import type { Image } from '../../../types/content'
import type { Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Select, Textarea, Toggle } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { onInvalid, useSaveAndReturn } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const SOURCES = [
  { value: 'google', label: 'Google review' },
  { value: 'facebook', label: 'Facebook review' },
  { value: 'website', label: 'Sent to the gym directly' },
  { value: 'other', label: 'Other' },
] as const

const schema = z.object({
  name: z.string().trim().min(1, 'Enter the member’s name as shown on the review').max(100),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1, 'Paste the review text').max(2000),
  source: z.enum(['google', 'facebook', 'website', 'other']),
  source_url: z.union([z.literal(''), z.url('Enter a full link starting with https://')]),
  review_date: z.string(),
  photo: z.nullable(imageSchema),
  published: z.boolean(),
})
type Values = z.infer<typeof schema>

export default function TestimonialEdit() {
  return <ContentEditLoader table="testimonials">{(row) => <TestimonialForm row={row} />}</ContentEditLoader>
}

function TestimonialForm({ row }: { row: Row<'testimonials'> | null }) {
  const saveAndReturn = useSaveAndReturn('testimonials', row, { listPath: '/admin/testimonials', noun: 'review' })
  const initialPhoto = (row?.photo as Image | null) ?? null
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: row?.name ?? '',
      rating: row?.rating ?? 5,
      content: row?.content ?? '',
      source: (row?.source as Values['source']) ?? 'google',
      source_url: row?.source_url ?? '',
      review_date: row?.review_date ?? '',
      photo: initialPhoto,
      published: row?.published ?? true,
    },
  })
  const { allowNavigation } = useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(
    (values) =>
      saveAndReturn(
        { ...values, review_date: values.review_date || null },
        { allowNavigation, images: { before: [initialPhoto], after: [values.photo] } },
      ),
    onInvalid,
  )

  return (
    <EditPage
      title={row ? `Review from ${row.name}` : 'Add a review'}
      backTo="/admin/testimonials"
      backLabel="All reviews"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <p className="rounded border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
        Only add real reviews, copied word for word, from members who are happy to be quoted.
      </p>

      <FormSection title="Review">
        <AdminField label="Member’s name" error={errors.name?.message}>
          {(a11y) => <Input {...a11y} {...register('name')} />}
        </AdminField>
        <AdminField label="Review" error={errors.content?.message}>
          {(a11y) => <Textarea {...a11y} {...register('content')} rows={5} />}
        </AdminField>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Rating" error={errors.rating?.message}>
            {(a11y) => (
              <Select {...a11y} {...register('rating', { valueAsNumber: true })}>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <option key={stars} value={stars}>
                    {'★'.repeat(stars)} ({stars} out of 5)
                  </option>
                ))}
              </Select>
            )}
          </AdminField>
          <AdminField label="Date of the review (optional)" error={errors.review_date?.message}>
            {(a11y) => <Input {...a11y} {...register('review_date')} type="date" />}
          </AdminField>
        </div>
      </FormSection>

      <FormSection title="Where it came from">
        <AdminField label="Source" error={errors.source?.message}>
          {(a11y) => (
            <Select {...a11y} {...register('source')}>
              {SOURCES.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </Select>
          )}
        </AdminField>
        <AdminField label="Link to the review (optional)" hint="Lets you find the original later." error={errors.source_url?.message}>
          {(a11y) => <Input {...a11y} {...register('source_url')} type="url" placeholder="https://" />}
        </AdminField>
        <Controller
          control={control}
          name="photo"
          render={({ field, fieldState }) => (
            <ImageField
              label="Member photo"
              folder="testimonials"
              aspect="aspect-square"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              hint="Only with the member’s permission."
            />
          )}
        />
      </FormSection>

      <FormSection title="Visibility">
        <Toggle {...register('published')} label="Show on the website" />
      </FormSection>
    </EditPage>
  )
}
