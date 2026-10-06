import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { contentListQuery, useDeleteContent, useMoveContent, useTogglePublished } from '../../api/content'
import { buttonClass } from '../../components/buttonClass'
import { ResourceList } from '../../components/ResourceList'
import { PageHeader } from '../../components/ui'

export default function FaqList() {
  const list = useQuery(contentListQuery('faqs'))
  const toggle = useTogglePublished('faqs')
  const move = useMoveContent('faqs')
  const remove = useDeleteContent('faqs')
  const rows = list.data ?? []

  return (
    <>
      <PageHeader
        title="FAQs"
        description="Questions shown on the FAQ page, grouped by category. The first five also appear on the homepage."
        actions={
          <Link to="/admin/faqs/new" className={buttonClass('primary')}>
            <Plus aria-hidden className="size-4" />
            Add question
          </Link>
        }
      />
      <ResourceList
        items={list.data?.map((faq) => ({ id: faq.id, title: faq.question, subtitle: faq.category, published: faq.published }))}
        isPending={list.isPending}
        isError={list.isError}
        onRetry={() => void list.refetch()}
        editPath={(id) => `/admin/faqs/${id}`}
        emptyTitle="No questions yet."
        emptyBody="Add the questions people ask most often, like prices, opening hours and free trials."
        onTogglePublished={(item) => toggle.mutate({ id: item.id, published: !item.published })}
        onMove={(index, delta) => move.mutate({ ids: rows.map((r) => r.id), index, delta })}
        onDelete={(item) => {
          const row = rows.find((r) => r.id === item.id)
          if (row) remove.mutate(row)
        }}
        busy={toggle.isPending || move.isPending || remove.isPending}
      />
    </>
  )
}
