import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { imageSchema } from '../../../schemas/content'
import type { Image } from '../../../types/content'
import type { Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Textarea, Toggle } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { ListField } from '../../components/ListField'
import { SeoFields } from '../../components/SeoFields'
import { SlugField } from '../../components/SlugField'
import { SLUG_PATTERN } from '../../lib/slug'
import { onInvalid, useSaveAndReturn } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const schema = z.object({
  title: z.string().trim().min(1, 'Enter the service name').max(100),
  slug: z.string().regex(SLUG_PATTERN, 'Use lowercase letters, numbers and dashes only'),
  short_description: z.string().trim().min(1, 'Add a one-line summary').max(160, 'Keep the summary under 160 characters'),
  image: z.nullable(imageSchema),
  body: z.string().trim().max(5000),
  benefits: z.array(z.string()),
  audience: z.string().trim().max(1000),
  what_to_expect: z.string().trim().max(1000),
  seo_title: z.string().trim().max(70),
  seo_description: z.string().trim().max(200),
  published: z.boolean(),
})
type Values = z.infer<typeof schema>

export default function ServiceEdit() {
  return <ContentEditLoader table="services">{(row) => <ServiceForm row={row} />}</ContentEditLoader>
}

function ServiceForm({ row }: { row: Row<'services'> | null }) {
  const saveAndReturn = useSaveAndReturn('services', row, { listPath: '/admin/services', noun: 'service' })
  const initialImage = (row?.image as Image | null) ?? null
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: row?.title ?? '',
      slug: row?.slug ?? '',
      short_description: row?.short_description ?? '',
      image: initialImage,
      body: row?.body ?? '',
      benefits: row?.benefits ?? [],
      audience: row?.audience ?? '',
      what_to_expect: row?.what_to_expect ?? '',
      seo_title: row?.seo_title ?? '',
      seo_description: row?.seo_description ?? '',
      published: row?.published ?? true,
    },
  })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = form
  const { allowNavigation } = useUnsavedChanges(isDirty)
  const [title, summary] = useWatch({ control, name: ['title', 'short_description'] })

  const onSubmit = handleSubmit((values) =>
    saveAndReturn(
      { ...values, benefits: values.benefits.map((b) => b.trim()).filter(Boolean) },
      { allowNavigation, images: { before: [initialImage], after: [values.image] } },
    ),
    onInvalid,
  )

  return (
    <EditPage
      title={row ? `Edit ${row.title}` : 'Add a service'}
      backTo="/admin/services"
      backLabel="All services"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      aside={
        row?.published && (
          <a href={`/services/${row.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
            View on website
            <ExternalLink aria-hidden className="size-4" />
          </a>
        )
      }
    >
      <FormSection title="Basics">
        <AdminField label="Service name" error={errors.title?.message}>
          {(a11y) => <Input {...a11y} {...register('title')} placeholder="Strength training" />}
        </AdminField>
        <SlugField form={form} name="slug" source="title" prefix="/services/" isNew={!row} />
        <AdminField label="One-line summary" hint="Shown in service lists and under the title." error={errors.short_description?.message}>
          {(a11y) => <Input {...a11y} {...register('short_description')} placeholder="Barbells, racks and platforms for lifting heavy, safely." />}
        </AdminField>
        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <ImageField
              label="Photo"
              folder="services"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              hint="Landscape works best. Shown large at the top of the service page."
            />
          )}
        />
      </FormSection>

      <FormSection title="Service page" description="The detail page for this service.">
        <AdminField label="Overview" hint="Leave a blank line between paragraphs." error={errors.body?.message}>
          {(a11y) => <Textarea {...a11y} {...register('body')} rows={7} />}
        </AdminField>
        <Controller
          control={control}
          name="benefits"
          render={({ field }) => (
            <ListField label="Benefits" hint="Short points, shown with ticks." value={field.value} onChange={field.onChange} placeholder="Build muscle and bone density" addLabel="Add benefit" />
          )}
        />
        <AdminField label="Who it’s for" error={errors.audience?.message}>
          {(a11y) => <Textarea {...a11y} {...register('audience')} rows={3} />}
        </AdminField>
        <AdminField label="What to expect in the first session" error={errors.what_to_expect?.message}>
          {(a11y) => <Textarea {...a11y} {...register('what_to_expect')} rows={3} />}
        </AdminField>
      </FormSection>

      <SeoFields
        form={form}
        titleName="seo_title"
        descriptionName="seo_description"
        titleFallback={title || 'Service name'}
        descriptionFallback={summary || 'One-line summary'}
      />

      <FormSection title="Visibility">
        <Toggle {...register('published')} label="Show on the website" description="Untick to hide the service and its page." />
      </FormSection>
    </EditPage>
  )
}
