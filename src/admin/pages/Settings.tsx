import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { openingHoursSchema, parseOrNull } from '../../schemas/content'
import type { Tables } from '../../types/database'
import { describeError } from '../api/content'
import { adminSettingsQuery, useSaveSettings } from '../api/settings'
import { EditPage } from '../components/EditPage'
import { AdminField, FormSection, Input, Textarea } from '../components/form'
import { Button, ErrorState, LoadingRows, Panel } from '../components/ui'
import { toast } from '../toast'
import { onInvalid } from '../useSaveAndReturn'
import { useUnsavedChanges } from '../useUnsavedChanges'

const optionalUrl = z.union([z.literal(''), z.url('Enter a full link starting with https://')])

const schema = z.object({
  gym_name: z.string().trim().min(1, 'Enter the gym’s name').max(80),
  short_name: z.string().trim().min(1, 'Enter a short name for the logo').max(30),
  description: z.string().trim().max(200),
  phone: z.string().trim().min(1, 'Enter a phone number').max(30),
  whatsapp_number: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v === '' || /^[0-9]{8,15}$/.test(v), 'Use the full number with country code, e.g. 9779800000000'),
  whatsapp_message: z.string().trim().max(300),
  email: z.union([z.literal(''), z.email('Enter a valid email address')]),
  address: z.string().trim().min(1, 'Enter the address').max(200),
  area: z.string().trim().max(60),
  city: z.string().trim().min(1, 'Enter the city').max(60),
  google_maps_url: optionalUrl,
  google_business_url: optionalUrl,
  instagram_url: optionalUrl,
  facebook_url: optionalUrl,
  tiktok_url: optionalUrl,
  opening_hours: z.array(z.object({ days: z.string().trim().min(1, 'Enter the days'), hours: z.string().trim().min(1, 'Enter the hours') })),
})
type FormInput = z.input<typeof schema>
type Values = z.output<typeof schema>

export default function Settings() {
  const settings = useQuery(adminSettingsQuery)
  if (settings.isPending) return <Panel><LoadingRows rows={8} /></Panel>
  if (settings.isError) return <Panel><ErrorState onRetry={() => void settings.refetch()} /></Panel>
  return <SettingsForm settings={settings.data} />
}

function SettingsForm({ settings }: { settings: Tables<'site_settings'> }) {
  const save = useSaveSettings()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormInput, unknown, Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      gym_name: settings.gym_name,
      short_name: settings.short_name,
      description: settings.description,
      phone: settings.phone,
      whatsapp_number: settings.whatsapp_number,
      whatsapp_message: settings.whatsapp_message,
      email: settings.email,
      address: settings.address,
      area: settings.area,
      city: settings.city,
      google_maps_url: settings.google_maps_url,
      google_business_url: settings.google_business_url,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
      tiktok_url: settings.tiktok_url,
      opening_hours: parseOrNull(openingHoursSchema, settings.opening_hours, 'opening hours') ?? [],
    },
  })
  const hours = useFieldArray({ control, name: 'opening_hours' })
  useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    try {
      await save.mutateAsync(values)
      reset(values)
      toast.success('Settings saved. The website is updated.')
    } catch (error) {
      toast.error(describeError(error, 'Settings didn’t save. Try again.'))
    }
  }, onInvalid)

  return (
    <EditPage
      title="Site settings"
      backTo="/admin"
      backLabel="Dashboard"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <FormSection title="The gym">
        <AdminField label="Gym name" hint="Used in page titles and the footer, e.g. “Three Star Gym”." error={errors.gym_name?.message}>
          {(a11y) => <Input {...a11y} {...register('gym_name')} />}
        </AdminField>
        <AdminField label="Short name" hint="The wordmark in the top corner of every page." error={errors.short_name?.message}>
          {(a11y) => <Input {...a11y} {...register('short_name')} />}
        </AdminField>
        <AdminField label="Description" hint="One sentence. Used by Google and when links are shared." error={errors.description?.message}>
          {(a11y) => <Textarea {...a11y} {...register('description')} rows={2} />}
        </AdminField>
      </FormSection>

      <FormSection title="Contact" description="Every Call and WhatsApp button on the site uses these.">
        <AdminField label="Phone number" hint="As people should dial it, e.g. +977 9800000000." error={errors.phone?.message}>
          {(a11y) => <Input {...a11y} {...register('phone')} type="tel" />}
        </AdminField>
        <AdminField label="WhatsApp number" hint="Full number with country code, digits only, e.g. 9779800000000." error={errors.whatsapp_number?.message}>
          {(a11y) => <Input {...a11y} {...register('whatsapp_number')} inputMode="numeric" />}
        </AdminField>
        <AdminField label="WhatsApp starting message" hint="Pre-filled when someone taps a WhatsApp button." error={errors.whatsapp_message?.message}>
          {(a11y) => <Textarea {...a11y} {...register('whatsapp_message')} rows={2} />}
        </AdminField>
        <AdminField label="Email (optional)" error={errors.email?.message}>
          {(a11y) => <Input {...a11y} {...register('email')} type="email" />}
        </AdminField>
      </FormSection>

      <FormSection title="Location">
        <AdminField label="Address" error={errors.address?.message}>
          {(a11y) => <Input {...a11y} {...register('address')} />}
        </AdminField>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Area" hint="Shown on the homepage, e.g. Manamaiju." error={errors.area?.message}>
            {(a11y) => <Input {...a11y} {...register('area')} />}
          </AdminField>
          <AdminField label="City" error={errors.city?.message}>
            {(a11y) => <Input {...a11y} {...register('city')} />}
          </AdminField>
        </div>
        <AdminField label="Google Maps link" hint="Open the gym in Google Maps, tap Share, and paste the link here." error={errors.google_maps_url?.message}>
          {(a11y) => <Input {...a11y} {...register('google_maps_url')} type="url" />}
        </AdminField>
        <AdminField label="Google Business profile (optional)" hint="Where people leave reviews." error={errors.google_business_url?.message}>
          {(a11y) => <Input {...a11y} {...register('google_business_url')} type="url" />}
        </AdminField>
      </FormSection>

      <FormSection title="Opening hours" description="One line per group of days, in the order you want them shown.">
        <ul className="space-y-3">
          {hours.fields.map((field, index) => (
            <li key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2">
              <div>
                <Input
                  {...register(`opening_hours.${index}.days`)}
                  aria-label={`Days, line ${index + 1}`}
                  aria-invalid={Boolean(errors.opening_hours?.[index]?.days)}
                  placeholder="Sunday – Friday"
                />
                {errors.opening_hours?.[index]?.days && <p className="mt-1 text-sm text-accent">{errors.opening_hours[index]?.days?.message}</p>}
              </div>
              <div>
                <Input
                  {...register(`opening_hours.${index}.hours`)}
                  aria-label={`Hours, line ${index + 1}`}
                  aria-invalid={Boolean(errors.opening_hours?.[index]?.hours)}
                  placeholder="5:00 am – 9:00 pm"
                />
                {errors.opening_hours?.[index]?.hours && <p className="mt-1 text-sm text-accent">{errors.opening_hours[index]?.hours?.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => hours.remove(index)}
                aria-label={`Remove line ${index + 1}`}
                className="flex size-11 items-center justify-center rounded border border-chalk/15 text-chalk/70 hover:text-chalk"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button onClick={() => hours.append({ days: '', hours: '' })}>
          <Plus aria-hidden className="size-4" />
          Add line
        </Button>
      </FormSection>

      <FormSection title="Social media (optional)">
        <AdminField label="Instagram" error={errors.instagram_url?.message}>
          {(a11y) => <Input {...a11y} {...register('instagram_url')} type="url" placeholder="https://instagram.com/…" />}
        </AdminField>
        <AdminField label="Facebook" error={errors.facebook_url?.message}>
          {(a11y) => <Input {...a11y} {...register('facebook_url')} type="url" placeholder="https://facebook.com/…" />}
        </AdminField>
        <AdminField label="TikTok" error={errors.tiktok_url?.message}>
          {(a11y) => <Input {...a11y} {...register('tiktok_url')} type="url" placeholder="https://tiktok.com/@…" />}
        </AdminField>
      </FormSection>
    </EditPage>
  )
}
