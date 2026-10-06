import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from '../../../lib/supabase'
import type { Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Toggle } from '../../components/form'
import { ListField } from '../../components/ListField'
import { useSaveAndReturn } from '../../useSaveAndReturn'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const NO_ID = '00000000-0000-0000-0000-000000000000'

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a plan name, e.g. Quarterly').max(60),
  price_npr: z.number({ error: 'Enter the price in rupees' }).int('Use whole rupees').min(0, 'Price can’t be negative'),
  duration_label: z.string().trim().min(1, 'Enter how long the plan lasts, e.g. 3 months').max(40),
  duration_months: z.number().int().positive('Use a whole number of months').nullable(),
  features: z.array(z.string()),
  is_popular: z.boolean(),
  published: z.boolean(),
})
type Values = z.infer<typeof schema>

const toNumberOrNull = (value: unknown) => (value === '' || value == null ? null : Number(value))

export default function MembershipEdit() {
  return <ContentEditLoader table="membership_plans">{(row) => <MembershipForm row={row} />}</ContentEditLoader>
}

function MembershipForm({ row }: { row: Row<'membership_plans'> | null }) {
  const saveAndReturn = useSaveAndReturn('membership_plans', row, { listPath: '/admin/memberships', noun: 'plan' })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: row?.name ?? '',
      price_npr: row?.price_npr ?? (undefined as unknown as number),
      duration_label: row?.duration_label ?? '',
      duration_months: row?.duration_months ?? null,
      features: row?.features ?? ['Full gym access'],
      is_popular: row?.is_popular ?? false,
      published: row?.published ?? true,
    },
  })
  const { allowNavigation } = useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    // Only one plan carries the "Most popular" label.
    if (values.is_popular) {
      await supabase.from('membership_plans').update({ is_popular: false }).neq('id', row?.id ?? NO_ID)
    }
    await saveAndReturn(
      { ...values, features: values.features.map((f) => f.trim()).filter(Boolean) },
      { allowNavigation },
    )
  })

  return (
    <EditPage
      title={row ? `Edit ${row.name}` : 'Add a plan'}
      backTo="/admin/memberships"
      backLabel="All plans"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <FormSection title="Plan">
        <AdminField label="Plan name" error={errors.name?.message}>
          {(a11y) => <Input {...a11y} {...register('name')} placeholder="Quarterly" />}
        </AdminField>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Price (NPR)" hint="Whole rupees, no commas." error={errors.price_npr?.message}>
            {(a11y) => <Input {...a11y} {...register('price_npr', { valueAsNumber: true })} type="number" inputMode="numeric" min={0} />}
          </AdminField>
          <AdminField label="Length shown on the site" hint="e.g. 3 months" error={errors.duration_label?.message}>
            {(a11y) => <Input {...a11y} {...register('duration_label')} />}
          </AdminField>
        </div>
        <AdminField
          label="Number of months (optional)"
          hint="Used to show the “about NPR X a month” price. Leave blank for plans that aren’t monthly."
          error={errors.duration_months?.message}
        >
          {(a11y) => (
            <Input {...a11y} {...register('duration_months', { setValueAs: toNumberOrNull })} type="number" inputMode="numeric" min={1} className="sm:max-w-40" />
          )}
        </AdminField>
      </FormSection>

      <FormSection title="What’s included" description="Each item shows as a ticked line on the plan.">
        <Controller
          control={control}
          name="features"
          render={({ field }) => (
            <ListField label="Features" value={field.value} onChange={field.onChange} placeholder="Locker and showers" addLabel="Add feature" />
          )}
        />
      </FormSection>

      <FormSection title="Display">
        <Toggle {...register('is_popular')} label="Mark as most popular" description="Highlights this plan. Any other plan loses the label." />
        <Toggle {...register('published')} label="Show on the website" description="Untick to hide the plan without deleting it." />
      </FormSection>
    </EditPage>
  )
}
