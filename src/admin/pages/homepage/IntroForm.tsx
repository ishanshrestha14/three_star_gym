import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { aboutSchema } from '../../../schemas/content'
import type { AboutContent } from '../../../types/content'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Textarea } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'
import { useSectionSubmit } from './useSectionSubmit'

export function IntroForm({ content }: { content: AboutContent | null }) {
  const submit = useSectionSubmit('about', 'Introduction')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<AboutContent>({
    resolver: zodResolver(aboutSchema),
    defaultValues: content ?? { heading: 'More than\na gym.', body: '', images: [null, null] as unknown as AboutContent['images'] },
  })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values, { before: content?.images ?? [], after: values.images })) reset(values)
  }, onInvalid)

  return (
    <EditPage title="Introduction" backTo="/admin/homepage" backLabel="Homepage" onSubmit={(e) => void onSubmit(e)} isSubmitting={isSubmitting} isDirty={isDirty}>
      <FormSection title="Text">
        <AdminField label="Heading" hint="Each line becomes a line on the page." error={errors.heading?.message}>
          {(a11y) => <Textarea {...a11y} {...register('heading')} rows={2} className="font-semibold uppercase" />}
        </AdminField>
        <AdminField label="Paragraph" error={errors.body?.message}>
          {(a11y) => <Textarea {...a11y} {...register('body')} rows={5} />}
        </AdminField>
      </FormSection>
      <FormSection title="Photos" description="The first is shown large and wide; the second smaller and upright.">
        {([0, 1] as const).map((index) => (
          <Controller
            key={index}
            control={control}
            name={`images.${index}`}
            render={({ field, fieldState }) => (
              <ImageField
                label={index === 0 ? 'Large photo' : 'Small photo'}
                folder="pages"
                required
                aspect={index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error && 'Add a photo'}
              />
            )}
          />
        ))}
      </FormSection>
    </EditPage>
  )
}
