import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { AdminField, FormSection, Input, Textarea } from './form'

type SeoFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  titleName: Path<T>
  descriptionName: Path<T>
  titleFallback: string
  descriptionFallback: string
}

/* Optional overrides for how a page appears in Google results. Blank means "use the normal title and summary". */
export function SeoFields<T extends FieldValues>({ form, titleName, descriptionName, titleFallback, descriptionFallback }: SeoFieldsProps<T>) {
  const title = (form.watch(titleName) as string) ?? ''
  const description = (form.watch(descriptionName) as string) ?? ''

  return (
    <FormSection title="Google search (optional)" description="How this page appears in search results. Leave blank to use the title and summary.">
      <AdminField label="Search title" hint={`${title.length}/60 characters. Google cuts off longer titles.`}>
        {(a11y) => <Input {...a11y} {...form.register(titleName)} placeholder={titleFallback} maxLength={70} />}
      </AdminField>
      <AdminField label="Search description" hint={`${description.length}/160 characters.`}>
        {(a11y) => <Textarea {...a11y} {...form.register(descriptionName)} placeholder={descriptionFallback} rows={3} maxLength={200} />}
      </AdminField>
    </FormSection>
  )
}
