import { ContentListPage } from '../../components/ContentListPage'

export default function FaqList() {
  return (
    <ContentListPage
      table="faqs"
      path="faqs"
      title="FAQs"
      description="Questions shown on the FAQ page, grouped by category. The first five also appear on the homepage."
      addLabel="Add question"
      emptyTitle="No questions yet."
      emptyBody="Add the questions people ask most often, like prices, opening hours and free trials."
      toItem={(faq) => ({ title: faq.question, subtitle: faq.category })}
    />
  )
}
