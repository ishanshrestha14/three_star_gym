import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { imageSchema } from '../../../schemas/content'
import type { Image } from '../../../types/content'
import type { Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Textarea, Toggle } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { ListField } from '../../components/ListField'
import { SlugField } from '../../components/SlugField'
import { SLUG_PATTERN } from '../../lib/slug'
import { onInvalid, useSaveAndReturn } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const optionalUrl = z.union([z.literal(''), z.url('Enter a full link starting with https://')])

const schema = z.object({
  name: z.string().trim().min(1, 'Enter the trainer’s name').max(100),
  slug: z.string().regex(SLUG_PATTERN, 'Use lowercase letters, numbers and dashes only'),
  position: z.string().trim().min(1, 'Enter their role, e.g. Personal trainer').max(80),
  years_experience: z.number({ error: 'Enter a number of years' }).int().min(0).max(80),
  specializations: z.array(z.string()),
  bio: z.string().trim().max(3000),
  certifications: z.array(z.string()),
  photo: imageSchema.nullable(),
  instagram: optionalUrl,
  facebook: optionalUrl,
  tiktok: optionalUrl,
  published: z.boolean(),
})
type Values = z.infer<typeof schema>
type SocialLinks = { instagram?: string; facebook?: string; tiktok?: string }

const clean = (items: string[]) => items.map((item) => item.trim()).filter(Boolean)

export default function TrainerEdit() {
  return <ContentEditLoader table="trainers">{(row) => <TrainerForm row={row} />}</ContentEditLoader>
}

function TrainerForm({ row }: { row: Row<'trainers'> | null }) {
  const saveAndReturn = useSaveAndReturn('trainers', row, { listPath: '/admin/trainers', noun: 'trainer' })
  const initialPhoto = (row?.photo as Image | null) ?? null
  const socials = (row?.social_links ?? {}) as SocialLinks
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: row?.name ?? '',
      slug: row?.slug ?? '',
      position: row?.position ?? '',
      years_experience: row?.years_experience ?? 0,
      specializations: row?.specializations ?? [],
      bio: row?.bio ?? '',
      certifications: row?.certifications ?? [],
      photo: initialPhoto,
      instagram: socials.instagram ?? '',
      facebook: socials.facebook ?? '',
      tiktok: socials.tiktok ?? '',
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

  const onSubmit = handleSubmit(({ instagram, facebook, tiktok, ...values }) => {
    const social_links = Object.fromEntries(Object.entries({ instagram, facebook, tiktok }).filter(([, url]) => url))
    return saveAndReturn(
      { ...values, social_links, specializations: clean(values.specializations), certifications: clean(values.certifications) },
      { allowNavigation, images: { before: [initialPhoto], after: [values.photo] } },
    )
  }, onInvalid)

  return (
    <EditPage
      title={row ? `Edit ${row.name}` : 'Add a trainer'}
      backTo="/admin/trainers"
      backLabel="All trainers"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      aside={
        row?.published && (
          <a href={`/trainers/${row.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
            View profile
            <ExternalLink aria-hidden className="size-4" />
          </a>
        )
      }
    >
      <FormSection title="Trainer">
        <AdminField label="Full name" error={errors.name?.message}>
          {(a11y) => <Input {...a11y} {...register('name')} />}
        </AdminField>
        <SlugField form={form} name="slug" source="name" prefix="/trainers/" isNew={!row} />
        <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
          <AdminField label="Role" error={errors.position?.message}>
            {(a11y) => <Input {...a11y} {...register('position')} placeholder="Personal trainer" />}
          </AdminField>
          <AdminField label="Years coaching" error={errors.years_experience?.message}>
            {(a11y) => <Input {...a11y} {...register('years_experience', { valueAsNumber: true })} type="number" inputMode="numeric" min={0} />}
          </AdminField>
        </div>
        <Controller
          control={control}
          name="photo"
          render={({ field, fieldState }) => (
            <ImageField
              label="Portrait"
              folder="trainers"
              aspect="aspect-[3/4]"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              hint="Upright photo, ideally on the gym floor. Shown in black and white until hovered."
            />
          )}
        />
      </FormSection>

      <FormSection title="Profile">
        <Controller
          control={control}
          name="specializations"
          render={({ field }) => (
            <ListField label="Specialisations" hint="Two or three is plenty." value={field.value} onChange={field.onChange} placeholder="Fat loss" addLabel="Add specialisation" />
          )}
        />
        <AdminField label="Bio" hint="Leave a blank line between paragraphs. The first paragraph also appears on the trainers page." error={errors.bio?.message}>
          {(a11y) => <Textarea {...a11y} {...register('bio')} rows={7} />}
        </AdminField>
        <Controller
          control={control}
          name="certifications"
          render={({ field }) => (
            <ListField
              label="Certifications"
              hint="Only list certifications the trainer actually holds."
              value={field.value}
              onChange={field.onChange}
              addLabel="Add certification"
            />
          )}
        />
      </FormSection>

      <FormSection title="Social links (optional)">
        <AdminField label="Instagram" error={errors.instagram?.message}>
          {(a11y) => <Input {...a11y} {...register('instagram')} type="url" placeholder="https://instagram.com/…" />}
        </AdminField>
        <AdminField label="Facebook" error={errors.facebook?.message}>
          {(a11y) => <Input {...a11y} {...register('facebook')} type="url" placeholder="https://facebook.com/…" />}
        </AdminField>
        <AdminField label="TikTok" error={errors.tiktok?.message}>
          {(a11y) => <Input {...a11y} {...register('tiktok')} type="url" placeholder="https://tiktok.com/@…" />}
        </AdminField>
      </FormSection>

      <FormSection title="Visibility">
        <Toggle {...register('published')} label="Show on the website" description="Untick to hide the trainer and their profile page." />
      </FormSection>
    </EditPage>
  )
}
