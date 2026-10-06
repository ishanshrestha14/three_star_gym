import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { contentListQuery, describeError, useSaveContent, type Row } from '../../api/content'
import { ContentEditLoader } from '../../components/ContentEditLoader'
import { EditPage } from '../../components/EditPage'
import { AdminField, FormSection, Input, Textarea, Toggle } from '../../components/form'
import { toast } from '../../toast'
import { useUnsavedChanges } from '../../useUnsavedChanges'

const schema = z.object({
  question: z.string().trim().min(1, 'Enter the question').max(300, 'Keep the question under 300 characters'),
  answer: z.string().trim().min(1, 'Enter the answer').max(3000, 'Keep the answer under 3,000 characters'),
  category: z.string().trim().min(1, 'Enter a category, e.g. Membership').max(60),
  published: z.boolean(),
})
type Values = z.infer<typeof schema>

export default function FaqEdit() {
  return <ContentEditLoader table="faqs">{(row) => <FaqForm row={row} />}</ContentEditLoader>
}

function FaqForm({ row }: { row: Row<'faqs'> | null }) {
  const navigate = useNavigate()
  const save = useSaveContent('faqs')
  // Offer existing categories so the same group isn't spelled two ways.
  const categories = [...new Set((useQuery(contentListQuery('faqs')).data ?? []).map((faq) => faq.category))]

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: row?.question ?? '',
      answer: row?.answer ?? '',
      category: row?.category ?? '',
      published: row?.published ?? true,
    },
  })
  const { allowNavigation } = useUnsavedChanges(isDirty)

  const onSubmit = handleSubmit(async (values) => {
    try {
      await save.mutateAsync({ id: row?.id, values })
      toast.success(row ? 'Question saved.' : 'Question added.')
      allowNavigation()
      navigate('/admin/faqs')
    } catch (error) {
      toast.error(describeError(error, 'The question didn’t save. Try again.'))
    }
  })

  return (
    <EditPage
      title={row ? 'Edit question' : 'Add a question'}
      backTo="/admin/faqs"
      backLabel="All FAQs"
      onSubmit={(event) => void onSubmit(event)}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
    >
      <FormSection title="Question and answer">
        <AdminField label="Question" error={errors.question?.message}>
          {(a11y) => <Input {...a11y} {...register('question')} placeholder="Do you offer a free trial?" />}
        </AdminField>
        <AdminField label="Answer" hint="Keep it short and specific. Two or three sentences is plenty." error={errors.answer?.message}>
          {(a11y) => <Textarea {...a11y} {...register('answer')} rows={5} />}
        </AdminField>
        <AdminField label="Category" hint="Questions are grouped by category on the FAQ page." error={errors.category?.message}>
          {(a11y) => (
            <>
              <Input {...a11y} {...register('category')} list="faq-categories" />
              <datalist id="faq-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </>
          )}
        </AdminField>
      </FormSection>
      <FormSection title="Visibility">
        <Toggle {...register('published')} label="Show on the website" description="Untick to keep it as a draft." />
      </FormSection>
    </EditPage>
  )
}
