import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Plus } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { aboutPageSchema } from '../../../schemas/content'
import type { AboutPageContent, Image } from '../../../types/content'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Textarea } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { ListField } from '../../components/ListField'
import { RowControls } from '../../components/RowControls'
import { Button } from '../../components/ui'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'
import { useSectionSubmit } from './useSectionSubmit'

const noImage = null as unknown as Image

const empty: AboutPageContent = {
  title: 'More than\na gym.',
  intro: '',
  image: noImage,
  story: { heading: 'How it\nstarted.', body: '' },
  values: { heading: 'What we\nbelieve.', items: [] },
  facilities: { heading: 'On the floor', items: [], image: noImage },
  community: { heading: 'Train with\npeople who\nshow up.', body: '', image: noImage },
}

const imagesOf = (content: AboutPageContent | null) => (content ? [content.image, content.facilities.image, content.community.image] : [])

export function AboutPageForm({ content }: { content: AboutPageContent | null }) {
  const submit = useSectionSubmit('about_page', 'About page')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AboutPageContent>({ resolver: zodResolver(aboutPageSchema), defaultValues: content ?? empty })
  const values = useFieldArray({ control, name: 'values.items' })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (data) => {
    const cleaned = { ...data, facilities: { ...data.facilities, items: data.facilities.items.map((i) => i.trim()).filter(Boolean) } }
    if (await submit(cleaned, { before: imagesOf(content), after: imagesOf(cleaned) })) reset(cleaned)
  }, onInvalid)

  const photo = (name: 'image' | 'facilities.image' | 'community.image', label: string, aspect: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <ImageField label={label} folder="pages" required aspect={aspect} value={field.value} onChange={field.onChange} error={fieldState.error && 'Add a photo'} />
      )}
    />
  )
  const heading = (name: 'title' | 'story.heading' | 'values.heading' | 'community.heading', label = 'Heading') => (
    <AdminField label={label} hint="Each line becomes a line on the page.">
      {(a11y) => <Textarea {...a11y} {...register(name)} rows={2} className="font-semibold uppercase" />}
    </AdminField>
  )

  return (
    <EditPage
      title="About page"
      backTo="/admin/homepage"
      backLabel="Homepage"
      onSubmit={(e) => void onSubmit(e)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      aside={
        <a href="/about" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-chalk/60 hover:text-chalk">
          View page
          <ExternalLink aria-hidden className="size-4" />
        </a>
      }
    >
      <FormSection title="Opening">
        {heading('title', 'Page title')}
        <AdminField label="Introduction" error={errors.intro?.message}>
          {(a11y) => <Textarea {...a11y} {...register('intro')} rows={3} />}
        </AdminField>
        {photo('image', 'Wide photo', 'aspect-[21/9]')}
      </FormSection>

      <FormSection title="Story" description="How the gym started and what it’s about.">
        {heading('story.heading')}
        <AdminField label="Story" hint="Leave a blank line between paragraphs.">
          {(a11y) => <Textarea {...a11y} {...register('story.body')} rows={8} />}
        </AdminField>
      </FormSection>

      <FormSection title="Values">
        {heading('values.heading')}
        <ol className="space-y-4">
          {values.fields.map((field, index) => (
            <li key={field.id} className="space-y-2 rounded border border-chalk/10 p-3">
              <div className="flex items-start gap-2">
                <Input {...register(`values.items.${index}.title`)} aria-label={`Value ${index + 1} title`} className="flex-1" />
                <RowControls index={index} count={values.fields.length} onMove={values.move} onRemove={values.remove} label={`value ${index + 1}`} />
              </div>
              <Textarea {...register(`values.items.${index}.description`)} aria-label={`Value ${index + 1} description`} rows={2} />
            </li>
          ))}
        </ol>
        <Button onClick={() => values.append({ title: '', description: '' })}>
          <Plus aria-hidden className="size-4" />
          Add a value
        </Button>
      </FormSection>

      <FormSection title="Facilities">
        <AdminField label="Heading">{(a11y) => <Input {...a11y} {...register('facilities.heading')} />}</AdminField>
        <Controller
          control={control}
          name="facilities.items"
          render={({ field }) => (
            <ListField label="What’s on the floor" value={field.value} onChange={field.onChange} placeholder="Squat racks and lifting platforms" addLabel="Add facility" />
          )}
        />
        {photo('facilities.image', 'Upright photo', 'aspect-[3/4]')}
      </FormSection>

      <FormSection title="Community banner" description="The full-width photo banner at the bottom of the page.">
        {heading('community.heading')}
        <AdminField label="Text">{(a11y) => <Textarea {...a11y} {...register('community.body')} rows={3} />}</AdminField>
        {photo('community.image', 'Background photo', 'aspect-video')}
      </FormSection>
    </EditPage>
  )
}
