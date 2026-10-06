import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { trialCtaSchema } from '../../../schemas/content'
import type { TrialCtaContent } from '../../../types/content'
import { CtaFields } from '../../components/CtaFields'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Textarea } from '../../components/form'
import { ImageField } from '../../components/ImageField'
import { onInvalid } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'
import { useSectionSubmit } from './useSectionSubmit'

const empty: TrialCtaContent = {
  heading: 'Your first workout\nstarts here.',
  body: '',
  cta: { label: 'Book a free trial', to: '/free-trial' },
  image: null as unknown as TrialCtaContent['image'],
}

export function TrialCtaForm({ content }: { content: TrialCtaContent | null }) {
  const submit = useSectionSubmit('trial_cta', 'Free trial banner')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<TrialCtaContent>({ resolver: zodResolver(trialCtaSchema), defaultValues: content ?? empty })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    if (await submit(values, { before: [content?.image], after: [values.image] })) reset(values)
  }, onInvalid)

  return (
    <EditPage title="Free trial banner" backTo="/admin/homepage" backLabel="Homepage" onSubmit={(e) => void onSubmit(e)} isSubmitting={isSubmitting} isDirty={isDirty}>
      <FormSection title="Text">
        <AdminField label="Headline" hint="Each line becomes a line on the page." error={errors.heading?.message}>
          {(a11y) => <Textarea {...a11y} {...register('heading')} rows={2} className="font-semibold uppercase" />}
        </AdminField>
        <AdminField label="Supporting text" error={errors.body?.message}>
          {(a11y) => <Textarea {...a11y} {...register('body')} rows={3} />}
        </AdminField>
        <CtaFields register={register} name="cta" label="Button" errors={errors} />
      </FormSection>
      <FormSection title="Background photo">
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
