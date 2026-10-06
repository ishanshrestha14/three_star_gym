import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { galleryCategoryLabel } from '../../../api/gallery'
import { imageSchema } from '../../../schemas/content'
import type { GalleryCategory, Image } from '../../../types/content'
import type { Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Select, Toggle } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { onInvalid, useSaveAndReturn } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const categoryValues = Object.keys(galleryCategoryLabel) as [GalleryCategory, ...GalleryCategory[]]

const schema = z.object({
  image: z
    .nullable(imageSchema)
    .refine((v) => Boolean(v), 'Choose a photo')
    .refine((v) => Boolean(v?.alt.trim()), 'Describe the photo so screen readers and Google understand it'),
  category: z.enum(categoryValues),
  caption: z.string().trim().max(120),
  published: z.boolean(),
})
type Values = z.infer<typeof schema>

export default function GalleryEdit() {
  return <ContentEditLoader table="gallery_images">{(row) => <GalleryForm row={row} />}</ContentEditLoader>
}

function GalleryForm({ row }: { row: Row<'gallery_images'> | null }) {
  const saveAndReturn = useSaveAndReturn('gallery_images', row, { listPath: '/admin/gallery', noun: 'photo' })
  const initialImage = (row?.image as Image | null) ?? null
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: initialImage,
      category: (row?.category as GalleryCategory) ?? 'gym',
      caption: row?.caption ?? '',
      published: row?.published ?? true,
    },
  })
  const { allowNavigation } = useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(
    (values) =>
      saveAndReturn(
        { ...values, image: { ...(values.image as Image), alt: (values.image as Image).alt.trim() } },
        { allowNavigation, images: { before: [initialImage], after: [values.image] } },
      ),
    onInvalid,
  )

  return (
    <EditPage
      title={row ? 'Edit photo' : 'Add a photo'}
      backTo="/admin/gallery"
      backLabel="All photos"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <FormSection title="Photo">
        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <ImageField label="Photo" folder="gallery" required value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <AdminField label="Category" hint="Visitors can filter the gallery by category." error={errors.category?.message}>
          {(a11y) => (
            <Select {...a11y} {...register('category')}>
              {Object.entries(galleryCategoryLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          )}
        </AdminField>
        <AdminField label="Caption (optional)" hint="Shown under the photo, e.g. “Saturday group class”." error={errors.caption?.message}>
          {(a11y) => <Input {...a11y} {...register('caption')} />}
        </AdminField>
      </FormSection>
      <FormSection title="Visibility">
        <Toggle {...register('published')} label="Show on the website" />
      </FormSection>
    </EditPage>
  )
}
