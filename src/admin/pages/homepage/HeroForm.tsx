import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { heroSchema } from '../../../schemas/content'
import type { HeroContent } from '../../../types/content'
import { heroVideo } from '../../../content/heroVideo'
import { CtaFields } from '../../components/CtaFields'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Select, Textarea } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'
import { useSectionSubmit } from './useSectionSubmit'

const empty: HeroContent = {
  heading: '',
  subheading: '',
  primaryCta: { label: 'Start your journey', to: '/free-trial' },
  secondaryCta: { label: 'Explore memberships', to: '/membership' },
  image: null as unknown as HeroContent['image'],
  background: 'video',
}

export function HeroForm({ content }: { content: HeroContent | null }) {
  const submit = useSectionSubmit('hero', 'Hero')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<HeroContent>({ resolver: zodResolver(heroSchema), defaultValues: content ? { background: 'video', ...content } : empty })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values, { before: [content?.image], after: [values.image] })) reset(values)
  }, onInvalid)

  return (
    <EditPage title="Hero" backTo="/admin/homepage" backLabel="Homepage" onSubmit={(e) => void onSubmit(e)} isSubmitting={isSubmitting} isDirty={isDirty}>
      <FormSection title="Headline">
        <AdminField
          label="Headline"
          hint="Each line you type here becomes a line on the homepage. Keep lines short: two or three words each."
          error={errors.heading?.message}
        >
          {(a11y) => <Textarea {...a11y} {...register('heading')} rows={3} className="font-semibold uppercase" />}
        </AdminField>
        <AdminField label="Supporting line" error={errors.subheading?.message}>
          {(a11y) => <Input {...a11y} {...register('subheading')} />}
        </AdminField>
      </FormSection>
      <FormSection title="Buttons">
        <CtaFields register={register} name="primaryCta" label="Main button" errors={errors} />
        <CtaFields register={register} name="secondaryCta" label="Second button" errors={errors} />
      </FormSection>
      <FormSection title="Background" description="The first thing visitors see. Use a dark, atmospheric landscape photo with space for the headline.">
        {heroVideo && (
          <AdminField
            label="Show"
            hint="The video is the clip that ships with the website. The photo below still shows while it loads, and instead of it for visitors saving mobile data."
          >
            {(a11y) => (
              <Select {...a11y} {...register('background')}>
                <option value="video">Video</option>
                <option value="image">Photo only</option>
              </Select>
            )}
          </AdminField>
        )}
        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <ImageField label="Photo" folder="pages" required value={field.value} onChange={field.onChange} error={fieldState.error && 'Add a background photo'} aspect="aspect-video" />
          )}
        />
      </FormSection>
    </EditPage>
  )
}
